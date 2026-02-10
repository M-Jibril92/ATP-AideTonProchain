
import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  // Inscription
  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Connexion
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      setUser(response.user);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    // On peut aussi nettoyer les tokens ici
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

