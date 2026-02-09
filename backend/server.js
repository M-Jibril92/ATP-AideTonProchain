require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import Modèles
const User = require('./models/User');
const Service = require('./models/Service');
const Payment = require('./models/Payment');

// Import Routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');
const paymentRoutes = require('./routes/payment');

const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.send('✅ API ATP AideTonProchain fonctionnelle !');
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Base de données synchronisée');
        app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
    })
    .catch(err => console.error('❌ Erreur BDD:', err));