const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validatePayment } = require('../utils/validators');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// GET /api/admin/orders - Liste toutes les commandes (admin)
router.get('/admin/orders', async (req, res) => {
  try {
    const Payment = require('../models/Payment');
    const User = require('../models/User');
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
    res.json({ orders: result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
const { sendAdminOrderEmail } = require('../utils/mailer');

// POST /api/payments/create-checkout-session - Créer une session Stripe Checkout
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, email } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Aucun article à payer.' });
    }
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
    // Notifier l'admin (commande Stripe en attente)
    await sendAdminOrderEmail({
      clientName: email,
      amount: items.reduce((sum, i) => sum + (i.price * i.quantity) / 100, 0),
      paymentMethod: 'CARD',
      description: JSON.stringify(items, null, 2),
      createdAt: new Date().toISOString()
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur Stripe Checkout:', error);
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
