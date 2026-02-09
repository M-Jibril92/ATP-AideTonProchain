// Service API centralisé
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est en cours d\'exécution sur http://localhost:5000');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Services API
export const servicesAPI = {
  getAll: () => apiCall('/services'),
  
  getById: (id) => apiCall(`/services/${id}`),
  
  create: (serviceData) =>
    apiCall('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    }),
  
  update: (id, serviceData) =>
    apiCall(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    }),
  
  delete: (id) =>
    apiCall(`/services/${id}`, {
      method: 'DELETE',
    }),
};

// Payments API
export const paymentsAPI = {
  getAll: () => apiCall('/payments'),
  
  getById: (id) => apiCall(`/payments/${id}`),
  
  create: (paymentData) =>
    apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
  
  update: (id, paymentData) =>
    apiCall(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    }),
  
  delete: (id) =>
    apiCall(`/payments/${id}`, {
      method: 'DELETE',
    }),
  
  // Create a Stripe Checkout session on the backend. Backend should return { id } or { url }.
  createCheckoutSession: (sessionData) =>
    apiCall('/payments/checkout-session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),
};
