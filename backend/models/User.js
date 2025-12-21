const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    // --- Infos de base ---
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Impossible d'avoir 2 fois le même email
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    // --- Infos Spécifiques ATP ---
    role: {
        type: DataTypes.ENUM('CLIENT', 'PROVIDER', 'ADMIN'),
        defaultValue: 'CLIENT'
    },
    // Ces champs serviront surtout pour les Prestataires (PROVIDER)
    phone: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING }
});

module.exports = User;