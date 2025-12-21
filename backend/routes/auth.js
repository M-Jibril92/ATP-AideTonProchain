const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Route pour s'inscrire : POST /api/auth/register
router.post('/register', authController.register);

// Route pour se connecter : POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;