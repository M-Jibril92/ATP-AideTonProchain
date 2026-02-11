const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting général (100 requêtes par 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, essayez plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting strict pour login (5 tentatives par 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de connexion, essayez dans 15 minutes',
  skipSuccessfulRequests: false,
  keyGenerator: (req) => req.body?.email || req.ip,
});

// Rate limiting strict pour register (3 par 1h)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Trop de tentatives d\'inscription, essayez plus tard',
  keyGenerator: (req) => req.body?.email || req.ip,
});

// Rate limiting pour password reset (3 par 1h)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Trop de demandes de réinitialisation, essayez dans 1 heure',
  keyGenerator: (req) => req.body?.email || req.ip,
});

// Middleware pour les headers de sécurité
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Middleware pour validation des en-têtes de sécurité
const validateSecurityHeaders = (req, res, next) => {
  // Vérifier que Content-Type est valide
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    const contentType = req.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      return res.status(400).json({ message: 'Content-Type invalide' });
    }
  }
  next();
};

// Middleware pour logging des erreurs de sécurité
const securityLogger = (req, res, next) => {
  // Enregistrer les tentatives d'accès suspectes
  if (req.path.includes('..') || req.path.includes('//')) {
    console.warn(`⚠️  Tentative suspecte: ${req.method} ${req.path} - IP: ${req.ip}`);
  }
  next();
};

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  securityHeaders,
  validateSecurityHeaders,
  securityLogger,
};
