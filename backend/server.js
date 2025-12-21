require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import Modèles
const User = require('./models/User');
const Service = require('./models/Service'); // <--- AJOUTÉ

// Import Routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service'); // <--- AJOUTÉ

const app = express();

app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes); // <--- AJOUTÉ

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