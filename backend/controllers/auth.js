const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegister, validators } = require('../utils/validators');

// --- INSCRIPTION ---
exports.register = async (req, res) => {
    try {
        // 1. Récupérer les infos
        const { firstName, lastName, email, password, role, phone, bio, location } = req.body;

        // 2. Valider les données
        const validationErrors = validateRegister({ firstName, lastName, email, password, role });
        if (validationErrors) {
            return res.status(400).json({ message: 'Données invalides', errors: validationErrors });
        }

        // 3. Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // 4. Hacher le mot de passe (Sécurité)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Créer l'utilisateur dans la BDD
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'CLIENT', // Par défaut CLIENT
            phone,
            bio,
            location
        });

        res.status(201).json({ message: 'Compte créé avec succès !', userId: newUser.id });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// --- CONNEXION ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Chercher l'utilisateur
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // 3. Générer le Token (Le "Pass VIP" pour naviguer connecté)
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};