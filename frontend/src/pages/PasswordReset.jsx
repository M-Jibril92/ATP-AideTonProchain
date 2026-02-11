import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiCall } from '../services/api';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Email requis');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email invalide');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiCall('/auth/password-reset-request', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      });

      setMessage('✅ ' + (data?.message || 'Si cet email existe, un lien de réinitialisation vous sera envoyé'));
      
      // Rediriger après 3 secondes
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err?.message || 'Erreur lors de la demande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '450px', margin: '2rem auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🔑 Réinitialiser le mot de passe</h1>

        {error && (
          <div style={{
            color: '#d32f2f',
            background: '#ffebee',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #ef5350'
          }}>
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div style={{
            color: '#2e7d32',
            background: '#e8f5e9',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #66bb6a'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email associé à votre compte
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              disabled={isLoading}
              placeholder="votre@email.com"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
              autoComplete="email"
            />
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              Nous vous enverrons un lien pour réinitialiser votre mot de passe
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              background: isLoading ? '#ccc' : '#003366',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {isLoading ? '⏳ Envoi en cours...' : '📧 Envoyer le lien'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #eee',
          textAlign: 'center'
        }}>
          <Link 
            to="/login"
            style={{
              color: '#0066cc',
              textDecoration: 'none',
              fontSize: '0.95rem'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
