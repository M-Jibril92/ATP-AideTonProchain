const Service = require('../models/Service');
const { validateService, sanitizeString } = require('../utils/validators');

// -------------------- TOUS LES SERVICES --------------------
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      attributes: ['id', 'title', 'price', 'duration', 'category', 'icon', 'description'],
      order: [['createdAt', 'DESC']]
    });

    return res.json(services);
  } catch (error) {
    console.error('Erreur getAllServices:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- SERVICE PAR ID --------------------
exports.getServiceById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const service = await Service.findByPk(id, {
      attributes: ['id', 'title', 'price', 'duration', 'category', 'icon', 'description']
    });

    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }

    return res.json(service);
  } catch (error) {
    console.error('Erreur getServiceById:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- CRÉER SERVICE --------------------
exports.createService = async (req, res) => {
  try {
    const validationErrors = validateService(req.body);
    if (validationErrors) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: validationErrors
      });
    }

    const service = await Service.create({
      title: sanitizeString(req.body.title),
      price: Number(req.body.price),
      duration: sanitizeString(req.body.duration),
      category: sanitizeString(req.body.category),
      icon: sanitizeString(req.body.icon),
      description: sanitizeString(req.body.description)
    });

    return res.status(201).json({
      message: 'Service créé avec succès',
      service
    });
  } catch (error) {
    console.error('Erreur createService:', error);
    return res.status(500).json({ message: 'Erreur création du service' });
  }
};

// -------------------- UPDATE SERVICE --------------------
exports.updateService = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }

    const validationErrors = validateService(req.body, true);
    if (validationErrors) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: validationErrors
      });
    }

    await service.update({
      title: req.body.title ? sanitizeString(req.body.title) : service.title,
      price: req.body.price ? Number(req.body.price) : service.price,
      duration: req.body.duration ? sanitizeString(req.body.duration) : service.duration,
      category: req.body.category ? sanitizeString(req.body.category) : service.category,
      icon: req.body.icon ? sanitizeString(req.body.icon) : service.icon,
      description: req.body.description ? sanitizeString(req.body.description) : service.description
    });

    return res.json({
      message: 'Service mis à jour avec succès',
      service
    });
  } catch (error) {
    console.error('Erreur updateService:', error);
    return res.status(500).json({ message: 'Erreur mise à jour du service' });
  }
};

// -------------------- DELETE SERVICE --------------------
exports.deleteService = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }

    await service.destroy();
    return res.json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteService:', error);
    return res.status(500).json({ message: 'Erreur suppression du service' });
  }
};

// -------------------- SEED (DEV ONLY) --------------------
exports.seedServices = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Action interdite en production' });
    }

    const count = await Service.count();
    if (count > 0) {
      return res.json({ message: 'Services déjà existants' });
    }

    await Service.bulkCreate([
      { title: 'Courses pour personne âgée', price: 10, duration: '45m', category: 'Courses', icon: '🛒', description: 'Aide aux courses hebdomadaires' },
      { title: 'Garde d’animaux', price: 15, duration: '1h', category: 'Animaux', icon: '🐕', description: 'Promenade et garde' },
      { title: 'Jardinage léger', price: 20, duration: '2h', category: 'Bricolage', icon: '🌱', description: 'Entretien du jardin' }
    ]);

    return res.status(201).json({ message: 'Services ajoutés' });
  } catch (error) {
    console.error('Erreur seedServices:', error);
    return res.status(500).json({ message: 'Erreur initialisation' });
  }
};
