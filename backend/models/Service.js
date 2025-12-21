const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING, // Ex: "1h", "45m"
        allowNull: false
    },
    category: {
        type: DataTypes.STRING // Ex: "Bricolage", "Courses"
    },
    icon: {
        type: DataTypes.STRING // Ex: "🛒", "🌱"
    }
});

module.exports = Service;