const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
};

// Middleware pour vérifier si l'utilisateur est un provider ou admin
const authorizeProvider = (req, res, next) => {
  if (req.user.role !== 'PROVIDER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès refusé: prestataire requis' });
  }
  next();
};

// Middleware pour vérifier si c'est un admin
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès refusé: administrateur requis' });
  }
  next();
};

module.exports = { authenticateToken, authorizeProvider, authorizeAdmin };
