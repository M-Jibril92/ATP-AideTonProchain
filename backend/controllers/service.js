const Service = require('../models/Service');

// --- RÉCUPÉRER TOUS LES SERVICES ---
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// --- CRÉER UN SERVICE (Optionnel pour l'instant) ---
exports.createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: 'Erreur création', error: error.message });
    }
};

// --- FONCTION MAGIQUE : REMPLIR LA BASE (SEED) ---
exports.seedServices = async (req, res) => {
    try {
        // Vérifie si la base est déjà pleine pour éviter les doublons
        const count = await Service.count();
        if (count > 0) {
            return res.status(200).json({ message: 'La base contient déjà des services.' });
        }

        // Tes données du Frontend
        const initialData = [
            { title: 'Courses pour personne âgée', price: 10, duration: '45m', category: 'Courses', icon: '🛒', description: 'Aide aux courses hebdomadaires, livraison à domicile' },
            { title: 'Garde d\'animaux', price: 15, duration: '1h', category: 'Animaux', icon: '🐕', description: 'Promenade et garde d\'animaux de compagnie' },
            { title: 'Jardinage léger', price: 20, duration: '2h', category: 'Bricolage', icon: '🌱', description: 'Tonte, taille de haies, entretien général' },
            { title: 'Soutien scolaire maths', price: 18, duration: '1h', category: 'Éducation', icon: '📐', description: 'Aide aux devoirs niveau collège/lycée' },
            { title: 'Installation informatique', price: 25, duration: '1h30', category: 'Informatique', icon: '💻', description: 'Installation logiciels, dépannage PC' },
            { title: 'Babysitting', price: 12, duration: '1h', category: 'Garde', icon: '👶', description: 'Garde d\'enfants à domicile' }
        ];

        await Service.bulkCreate(initialData);
        res.status(201).json({ message: 'Services initiaux ajoutés avec succès !' });

    } catch (error) {
        res.status(500).json({ message: 'Erreur seeding', error: error.message });
    }
};