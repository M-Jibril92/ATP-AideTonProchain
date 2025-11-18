import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name) return;
    login(name);
    nav('/');
  };

  return (
    <div className="page-container">
      <div className="card" style={{ 
        maxWidth: '480px', 
        margin: '4rem auto',
        animation: 'slideUp 0.5s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Connexion / Inscription</h1>
          <p style={{ color: 'var(--text-light)' }}>
            Connectez-vous pour accéder à tous les services
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label">Votre prénom</label>
            <input 
              className="input"
              placeholder="Ex: Sophie" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            🚀 Se connecter / S'inscrire
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem',
          background: 'var(--bg-light)',
          borderRadius: '8px',
          border: '1px dashed var(--border)'
        }}>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-light)', 
            margin: 0,
            lineHeight: '1.6'
          }}>
            ℹ️ <strong>Mode démo :</strong> Ceci est une authentification simplifiée. 
            En production, un système complet avec mot de passe, validation et tokens sera implémenté.
          </p>
        </div>
      </div>
    </div>
  );
}