const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service');

// GET /api/services -> Récupère la liste
router.get('/', serviceController.getAllServices);

// POST /api/services -> Ajoute un service
router.post('/', serviceController.createService);

// POST /api/services/seed -> Remplit la base avec les fausses données
router.post('/seed', serviceController.seedServices);

module.exports = router;