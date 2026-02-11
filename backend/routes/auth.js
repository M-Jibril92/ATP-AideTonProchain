const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateRefreshToken } = require('../middleware/auth');
const { loginLimiter, registerLimiter, passwordResetLimiter } = require('../middleware/security');

// Route pour s'inscrire : POST /api/auth/register
router.post('/register', registerLimiter, authController.register);

// Route pour se connecter : POST /api/auth/login
router.post('/login', loginLimiter, authController.login);

// Route pour rafraîchir le token : POST /api/auth/refresh
router.post('/refresh', authController.refresh);

// Route d'activation email : GET /api/auth/activate
router.get('/activate', authController.activate);

// Route pour demander une réinitialisation de mot de passe : POST /api/auth/password-reset-request
router.post('/password-reset-request', passwordResetLimiter, authController.passwordResetRequest);

// Route pour réinitialiser le mot de passe : POST /api/auth/password-reset-confirm
router.post('/password-reset-confirm', authController.passwordResetConfirm);

module.exports = router;
