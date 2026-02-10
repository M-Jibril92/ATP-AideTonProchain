const jwt = require('jsonwebtoken');

// Vérification de la clé secrète JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.warn('⚠️  AVERTISSEMENT: JWT_SECRET doit être défini et avoir au moins 32 caractères!');
}

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier le refresh token
const authenticateRefreshToken = (req, res, next) => {
  const token = req.body.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      algorithms: ['HS256'],
    });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Refresh token invalide ou expiré' });
  }
};

// Middleware pour vérifier si l'utilisateur est un provider ou admin
const authorizeProvider = (req, res, next) => {
  if (!req.user || (req.user.role !== 'PROVIDER' && req.user.role !== 'ADMIN')) {
    return res.status(403).json({ message: 'Accès refusé: prestataire requis' });
  }
  next();
};

// Middleware pour vérifier si c'est un admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès refusé: administrateur requis' });
  }
  next();
};

// Middleware pour vérifier que l'utilisateur est propriétaire de la ressource
const authorizeOwner = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.userId !== resourceUserId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Vous n\'avez pas accès à cette ressource' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
  authorizeProvider,
  authorizeAdmin,
  authorizeOwner,
};
