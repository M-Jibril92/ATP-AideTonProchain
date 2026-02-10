const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateRefreshToken } = require('../middleware/auth');

// Route pour s'inscrire : POST /api/auth/register
router.post('/register', authController.register);

// Route pour se connecter : POST /api/auth/login
router.post('/login', authController.login);

// Route pour rafraîchir le token : POST /api/auth/refresh
router.post('/refresh', authController.refresh);

// Route d'activation email : GET /api/auth/activate
router.get('/activate', authController.activate);

module.exports = router;
