const { Sequelize } = require('sequelize');
const path = require('path');

// Configuration de la base de données SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'), // Le fichier sera créé à la racine du backend
    logging: false // Mettre à true si tu veux voir toutes les requêtes SQL dans le terminal
});

module.exports = sequelize;