// Validation des données d'entrée
const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  required: (value) => {
    return value && String(value).trim().length > 0;
  },

  isNumber: (value) => {
    return !isNaN(value) && value > 0;
  },

  isValidRole: (role) => {
    return ['CLIENT', 'PROVIDER', 'ADMIN'].includes(role);
  }
};

// Validation pour l'inscription
const validateRegister = (data) => {
  const errors = {};

  if (!validators.required(data.firstName)) {
    errors.firstName = 'Le prénom est requis';
  }

  if (!validators.required(data.lastName)) {
    errors.lastName = 'Le nom est requis';
  }

  if (!validators.email(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!validators.password(data.password)) {
    errors.password = 'Le mot de passe doit avoir au moins 6 caractères';
  }

  if (data.role && !validators.isValidRole(data.role)) {
    errors.role = 'Rôle invalide';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Validation pour le paiement
const validatePayment = (data) => {
  const errors = {};

  if (!validators.isNumber(data.amount)) {
    errors.amount = 'Montant invalide (doit être > 0)';
  }

  if (!validators.required(data.serviceId)) {
    errors.serviceId = 'Service requis';
  }

  if (!validators.required(data.paymentMethod)) {
    errors.paymentMethod = 'Méthode de paiement requise';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

module.exports = {
  validators,
  validateRegister,
  validatePayment
};
