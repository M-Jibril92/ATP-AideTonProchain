const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validatePayment, validateAddress, sanitizeAddress } = require('../utils/validators');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// GET /api/admin/orders - Liste toutes les commandes (admin)
router.get('/admin/orders', authenticateToken, async (req, res) => {
  try {
    console.log('📥 Requête admin/orders');
    console.log('   Token User ID:', req.user.id);
    console.log('   Token User Role:', req.user.role);
    
    // Vérifier que c'est un admin
    const User = require('../models/User');
    const user = await User.findByPk(req.user.id);
    
    console.log('   User trouvé en BDD:', user ? user.email : 'NOT FOUND');
    console.log('   User role en BDD:', user ? user.role : 'N/A');
    
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Accès refusé: user =', user ? `${user.email} (${user.role})` : 'null or not found');
      return res.status(403).json({ message: 'Accès refusé. Vous devez être admin.' });
    }

    const Payment = require('../models/Payment');
    const Service = require('../models/Service');
    const orders = await Payment.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email', 'location'] },
        { model: Service, attributes: ['title', 'category', 'duration'] }
      ]
    });
    const result = orders.map(o => ({
      id: o.id,
      createdAt: o.createdAt,
      amount: o.amount,
      paymentMethod: o.paymentMethod,
      description: o.description,
      clientName: o.User ? `${o.User.firstName} ${o.User.lastName}` : o.userId,
      email: o.User ? o.User.email : '',
      ville: o.User ? o.User.location : '',
      service: o.Service ? o.Service.title : '',
      categorie: o.Service ? o.Service.category : '',
      duree: o.Service ? o.Service.duration : ''
    }));
    console.log('✅ Commandes retournées:', result.length);
    res.json({ orders: result });
  } catch (error) {
    console.error('❌ Erreur admin/orders:', error.message);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
const { sendAdminOrderEmail, sendOrderConfirmationEmail } = require('../utils/mailer');

// POST /api/payments/save-order - Sauvegarder une commande
router.post('/save-order', async (req, res) => {
  try {
    console.log('📥 Données reçues dans save-order:', JSON.stringify(req.body, null, 2));
    
    const { userId, items, amount, paymentMethod, address, status } = req.body;
    
    // Validations détaillées
    if (!userId) {
      console.error('❌ userId manquant');
      return res.status(400).json({ message: 'Erreur: userId manquant' });
    }
    
    if (!items) {
      console.error('❌ items manquant');
      return res.status(400).json({ message: 'Erreur: items manquant' });
    }
    
    if (!Array.isArray(items)) {
      console.error('❌ items n\'est pas un array, reçu:', typeof items);
      return res.status(400).json({ message: 'Erreur: items doit être un array' });
    }
    
    if (items.length === 0) {
      console.error('❌ items est vide');
      return res.status(400).json({ message: 'Erreur: panier vide' });
    }

    // ✅ Validate address
    const addressError = validateAddress(address);
    if (addressError) {
      console.error('❌ Erreur adresse:', addressError);
      return res.status(400).json({ message: addressError });
    }

    // ✅ Sanitize address
    const sanitizedAddress = sanitizeAddress(address);

    const Service = require('../models/Service');

    // Créer une entrée Payment pour chaque item du panier
    const payments = [];
    for (const item of items) {
      try {
        // Chercher le service par titre
        const service = await Service.findOne({
          where: { title: item.title }
        });

        const payment = await Payment.create({
          userId,
          serviceId: service ? service.id : 1, // Utiliser le service trouvé ou 1 par défaut
          amount: parseFloat(item.price) || 0,
          quantity: parseInt(item.qty) || 1,
          paymentMethod: paymentMethod || 'CASH',
          status: status || 'PENDING',
          description: JSON.stringify({
            title: item.title,
            address: sanitizedAddress,
            items: items
          }),
          transactionId: `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
        payments.push(payment);
        console.log(`✅ Payment créé : ID ${payment.id} pour service "${item.title}"`);
      } catch (itemErr) {
        console.error(`⚠️ Erreur pour l'item "${item.title}":`, itemErr.message);
      }
    }

    if (payments.length === 0) {
      return res.status(400).json({ message: 'Aucun payment n\'a pu être créé' });
    }

    console.log(`✅ Commande sauvegardée: ${payments.length} item(s) pour l'utilisateur ${userId}`);

    try {
      const User = require('../models/User');
      const user = await User.findByPk(userId);
      if (user && user.email) {
        const addressText = [
          sanitizedAddress.rue,
          sanitizedAddress.batiment,
          sanitizedAddress.quartier,
          sanitizedAddress.ville,
        ].filter(Boolean).join(', ');

        await sendOrderConfirmationEmail(user.email, user.firstName, {
          total: amount,
          paymentMethod: paymentMethod || 'CASH',
          address: addressText,
          items: items.map((item) => ({
            title: item.title,
            qty: item.qty,
          })),
        });

        await sendAdminOrderEmail({
          clientName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          amount,
          paymentMethod: paymentMethod || 'CASH',
          description: JSON.stringify(items, null, 2),
          createdAt: new Date().toISOString()
        });
      }
    } catch (emailErr) {
      console.error('⚠️ Erreur envoi email confirmation commande:', emailErr.message);
    }
    
    res.json({ 
      message: 'Commande sauvegardée',
      count: payments.length,
      payments: payments.map(p => ({ id: p.id, serviceId: p.serviceId, amount: p.amount }))
    });
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde de la commande', error: error.message });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, email, reservationDate } = req.body;
    
    // Vérifier les paramètres
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Aucun article à payer.' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email manquant.' });
    }

    // Vérifier la clé Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY manquante');
      return res.status(500).json({ message: 'Configuration Stripe manquante' });
    }

    console.log('✅ Création session Stripe avec:', { itemsCount: items.length, email });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      customer_email: email,
      success_url: process.env.FRONTEND_URL + '/reservation?success=1',
      cancel_url: process.env.FRONTEND_URL + '/payment?canceled=1',
    });
    
    console.log('✅ Session Stripe créée:', session.id);
    
    // Envoyer l'email de notification SANS bloquer la réponse
    // Use setImmediate pour ne pas bloquer la réponse au client
    setImmediate(() => {
      sendAdminOrderEmail({
        clientName: email,
        amount: items.reduce((sum, i) => sum + (i.price * i.quantity) / 100, 0),
        paymentMethod: 'CARD',
        description: JSON.stringify(items, null, 2),
        reservationDate: reservationDate || 'Non spécifiée',
        createdAt: new Date().toISOString()
      }).catch(err => {
        console.warn('⚠️ Erreur email admin (non-bloquant):', err.message);
        // On ignore l'erreur d'email, le paiement est déjà traité
      });
    });

    // Répondre au client immédiatement
    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Erreur Stripe Checkout:', error.message);
    res.status(500).json({ message: 'Erreur lors de la création de la session Stripe', error: error.message });
  }
});
// POST /api/payments/create-intent - Créer un PaymentIntent Stripe
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, userId, items } = req.body;
    if (!amount || !userId) {
      return res.status(400).json({ message: 'Montant ou utilisateur manquant' });
    }
    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        userId: String(userId),
        items: JSON.stringify(items || [])
      }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ message: 'Erreur lors de la création du paiement', error: error.message });
  }
});

// GET /api/payments - Récupérer les paiements de l'utilisateur
router.get('/', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/payments/:id - Récupérer un paiement spécifique
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { id: req.params.id, userId: req.user.userId }
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/payments - Créer un paiement
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { serviceId, amount, paymentMethod, description, quantity } = req.body;

    // Validation
    const validationErrors = validatePayment({ serviceId, amount, paymentMethod });
    if (validationErrors) {
      return res.status(400).json({ message: 'Données invalides', errors: validationErrors });
    }

    // Créer le paiement
    const payment = await Payment.create({
      userId: req.user.userId,
      serviceId,
      amount,
      paymentMethod,
      description,
      quantity: quantity || 1,
      transactionId: `TXN-${uuidv4()}`,
      status: 'COMPLETED' // À intégrer avec un vrai système de paiement (Stripe, PayPal, etc.)
    });

    // Notifier l'admin (commande espèces)
    await sendAdminOrderEmail({
      clientName: req.user.firstName || req.user.email || payment.userId,
      amount,
      paymentMethod,
      description,
      createdAt: payment.createdAt
    });
    res.status(201).json({ message: 'Paiement effectué avec succès', payment });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// PUT /api/payments/:id - Modifier un paiement (admin seulement)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    await payment.update({ status });
    res.json({ message: 'Paiement mis à jour', payment });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// DELETE /api/payments/:id - Supprimer un paiement (admin ou propriétaire)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    if (payment.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await payment.destroy();
    res.json({ message: 'Paiement supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
