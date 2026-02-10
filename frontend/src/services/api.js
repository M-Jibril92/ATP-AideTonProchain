// API centralisée avec gestion robuste des erreurs JSON
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// -------------------- TOKEN STORAGE --------------------
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const storage = {
  getAccessToken: () => sessionStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => sessionStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken, refreshToken) => {
    if (accessToken) sessionStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem('user');
  },
};

// -------------------- SAFE JSON PARSER --------------------
const safeParseJSON = async (response) => {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text
    };
  }
};

// -------------------- REFRESH TOKEN --------------------
const refreshAccessToken = async () => {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) {
    storage.clearTokens();
    throw new Error('Session expirée');
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await safeParseJSON(response);

  if (!response.ok || !data?.accessToken) {
    storage.clearTokens();
    window.location.href = '/login';
    throw new Error('Session expirée');
  }

  storage.setTokens(data.accessToken, refreshToken);
  return data.accessToken;
};

// -------------------- API CALL CORE --------------------
export const apiCall = async (endpoint, options = {}, retryCount = 0) => {
  const MAX_RETRIES = 1;
  const token = storage.getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Impossible de se connecter au serveur');
  }

  const data = await safeParseJSON(response);

  // Token expiré → refresh
  if (
    response.status === 401 &&
    retryCount < MAX_RETRIES &&
    data?.message?.toLowerCase().includes('token')
  ) {
    await refreshAccessToken();
    return apiCall(endpoint, options, retryCount + 1);
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Une erreur est survenue');
  }

  return data;
};

// -------------------- AUTH API --------------------
export const authAPI = {
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: async (email, password) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response?.accessToken && response?.refreshToken) {
      storage.setTokens(response.accessToken, response.refreshToken);
      sessionStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  logout: () => {
    storage.clearTokens();
  },

  refreshToken: () => refreshAccessToken(),
};

// -------------------- SERVICES API --------------------
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

// -------------------- PAYMENTS API --------------------
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
};
