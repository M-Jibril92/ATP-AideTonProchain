require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const {
  generalLimiter,
  securityHeaders,
  validateSecurityHeaders,
  securityLogger,
} = require('./middleware/security');

// Vérification des variables critiques
if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error('❌ JWT_SECRET et JWT_REFRESH_SECRET manquants');
  process.exit(1);
}

// Routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');
const paymentRoutes = require('./routes/payment');

const app = express();

// -------------------- SÉCURITÉ GLOBALE --------------------
app.use(securityHeaders);
app.use(securityLogger);
app.use(validateSecurityHeaders);
app.use(generalLimiter);

// -------------------- CORS --------------------
app.use(cors({
  origin: function (origin, callback) {
    // Accepte localhost avec n'importe quel port en développement
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// -------------------- BODY PARSING --------------------
app.use(express.json({ limit: '1mb' })); // Limite réduite pour sécurité
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// -------------------- HEADERS SÉCURISÉS --------------------
app.use((req, res, next) => {
  // Empêcher les accès directs au cache
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Empêcher Clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Empêcher MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});

// -------------------- ANTI PATH TRAVERSAL --------------------
app.use((req, res, next) => {
  if (req.path.includes('..') || req.path.includes('//')) {
    return res.status(400).json({ message: 'Requête invalide' });
  }
  next();
});

// -------------------- ROUTES --------------------
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);

// -------------------- HEALTH --------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: '✅ API ATP AideTonProchain fonctionnelle (sécurisée)' });
});

// -------------------- 404 --------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err);

  res.status(err.statusCode || 500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Une erreur est survenue'
        : err.message,
  });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Désactiver ALTER en développement pour SQLite (problèmes FOREIGN KEY)
    await sequelize.sync({ alter: false });
    console.log('✅ Base de données synchronisée');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur BDD:', err);
    process.exit(1);
  }
}

startServer();

// -------------------- SHUTDOWN --------------------
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur');
  process.exit(0);
});
