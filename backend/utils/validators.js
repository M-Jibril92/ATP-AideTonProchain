// Sanitization simple pour éviter XSS (les balises HTML sont échappées)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

// Validation des données d'entrée
const validators = {
  email: (email) => {
    if (!email || typeof email !== 'string') return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 254;
  },

  password: (password) => {
    if (!password || typeof password !== 'string') return false;
    // Au minimum 8 caractères pour une meilleure sécurité
    return password.length >= 8 && password.length <= 128;
  },

  passwordStrength: (password) => {
    // Vérifier que le mot de passe contient au moins:
    // - 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  required: (value) => {
    return value && String(value).trim().length > 0;
  },

  isNumber: (value) => {
    return !isNaN(value) && value > 0;
  },

  isValidRole: (role) => {
    const validRoles = ['CLIENT', 'PROVIDER', 'ADMIN'];
    return validRoles.includes(role);
  },

  isValidEmail: (email) => {
    return validators.email(email);
  },

  isValidPhone: (phone) => {
    // Format basique pour numéros de téléphone
    const regex = /^[\d\s\-\+\(\)]{7,20}$/;
    return regex.test(phone);
  },

  isValidLength: (value, min = 1, max = 255) => {
    const length = String(value).length;
    return length >= min && length <= max;
  }
};

// Validation pour l'inscription
const validateRegister = (data) => {
  const errors = {};

  // Prénom
  if (!validators.required(data.firstName)) {
    errors.firstName = 'Le prénom est requis';
  } else if (!validators.isValidLength(data.firstName, 2, 50)) {
    errors.firstName = 'Le prénom doit contenir entre 2 et 50 caractères';
  }

  // Nom
  if (!validators.required(data.lastName)) {
    errors.lastName = 'Le nom est requis';
  } else if (!validators.isValidLength(data.lastName, 2, 50)) {
    errors.lastName = 'Le nom doit contenir entre 2 et 50 caractères';
  }

  // Email
  if (!validators.email(data.email)) {
    errors.email = 'Email invalide';
  }

  // Mot de passe
  if (!validators.password(data.password)) {
    errors.password = 'Le mot de passe doit avoir au moins 8 caractères';
  } else if (!validators.passwordStrength(data.password)) {
    errors.password = 'Le mot de passe doit contenir: majuscule, minuscule, chiffre, caractère spécial';
  }

  // Rôle
  if (data.role && !validators.isValidRole(data.role)) {
    errors.role = 'Rôle invalide';
  }

  // Téléphone (optionnel mais validé s'il existe)
  if (data.phone && !validators.isValidPhone(data.phone)) {
    errors.phone = 'Numéro de téléphone invalide';
  }

  // Bio (optionnel, max 500 caractères)
  if (data.bio && !validators.isValidLength(data.bio, 0, 500)) {
    errors.bio = 'La bio doit contenir max 500 caractères';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Validation pour le paiement
const validatePayment = (data) => {
  const errors = {};

  if (!validators.isNumber(data.amount)) {
    errors.amount = 'Montant invalide (doit être > 0)';
  } else if (data.amount > 10000) {
    errors.amount = 'Montant supérieur à la limite autorisée';
  }

  if (!validators.required(data.serviceId)) {
    errors.serviceId = 'Service requis';
  }

  if (!validators.required(data.paymentMethod)) {
    errors.paymentMethod = 'Méthode de paiement requise';
  }

  const validMethods = ['CARD', 'PAYPAL', 'TRANSFER', 'OTHER'];
  if (data.paymentMethod && !validMethods.includes(data.paymentMethod)) {
    errors.paymentMethod = 'Méthode de paiement invalide';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Validation pour les services
const validateService = (data) => {
  const errors = {};

  if (!validators.required(data.title)) {
    errors.title = 'Le titre est requis';
  } else if (!validators.isValidLength(data.title, 3, 100)) {
    errors.title = 'Le titre doit contenir entre 3 et 100 caractères';
  }

  if (data.price && !validators.isNumber(data.price)) {
    errors.price = 'Le prix doit être un nombre positif';
  }

  if (data.description && !validators.isValidLength(data.description, 0, 1000)) {
    errors.description = 'La description doit contenir max 1000 caractères';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Validation pour l'adresse de livraison
const validateAddress = (address) => {
  if (!address || typeof address !== 'object') {
    return 'Adresse invalide';
  }

  const { rue, ville, batiment, quartier } = address;

  // Rue requise
  if (!rue || typeof rue !== 'string' || rue.trim().length === 0) {
    return 'Rue requise';
  }
  if (rue.length > 100) {
    return 'Rue trop longue (max 100 caractères)';
  }

  // Ville requise
  if (!ville || typeof ville !== 'string' || ville.trim().length === 0) {
    return 'Ville requise';
  }
  if (ville.length > 100) {
    return 'Ville trop longue (max 100 caractères)';
  }

  // Bâtiment (optionnel)
  if (batiment && batiment.length > 100) {
    return 'Bâtiment trop long (max 100 caractères)';
  }

  // Quartier (optionnel)
  if (quartier && quartier.length > 100) {
    return 'Quartier trop long (max 100 caractères)';
  }

  return null; // Aucune erreur
};

// Sanitization de l'adresse
const sanitizeAddress = (address) => {
  if (!address || typeof address !== 'object') {
    return { rue: '', ville: '', batiment: '', quartier: '' };
  }

  return {
    rue: sanitizeString(address.rue || ''),
    ville: sanitizeString(address.ville || ''),
    batiment: sanitizeString(address.batiment || ''),
    quartier: sanitizeString(address.quartier || '')
  };
};

module.exports = {
  validators,
  validateRegister,
  validatePayment,
  validateService,
  validateAddress,
  sanitizeString,
  sanitizeAddress,
};
