const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validatePayment } = require('../utils/validators');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');

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
