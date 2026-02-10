const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service');
const { authenticateToken, authorizeProvider, authorizeAdmin } = require('../middleware/auth');

// GET /api/services -> Récupère la liste (public)
router.get('/', serviceController.getAllServices);

// GET /api/services/:id -> Récupère un service spécifique (public)
router.get('/:id', serviceController.getServiceById);

// POST /api/services -> Créer un service (prestataire/admin seulement)
router.post('/', authenticateToken, authorizeProvider, serviceController.createService);

// PUT /api/services/:id -> Modifier un service (prestataire/admin seulement)
router.put('/:id', authenticateToken, authorizeProvider, serviceController.updateService);

// DELETE /api/services/:id -> Supprimer un service (prestataire/admin seulement)
router.delete('/:id', authenticateToken, authorizeProvider, serviceController.deleteService);

// POST /api/services/seed -> Remplit la base avec les fausses données (admin seulement)
router.post('/seed', authenticateToken, authorizeAdmin, serviceController.seedServices);

module.exports = router;
