import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation frontend
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email invalide');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '450px', margin: '2rem auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🔐 Connexion</h1>
        
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
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              disabled={isLoading}
              placeholder="votre@email.com"
              className="form-control"
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
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  paddingRight: '2.5rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#666',
                  padding: '0.5rem'
                }}
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-primary"
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
            {isLoading ? '⏳ Connexion...' : '✅ Se connecter'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #eee',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <Link 
            to="/password-reset"
            style={{
              color: '#0066cc',
              textDecoration: 'none',
              fontSize: '0.95rem'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            🔑 Mot de passe oublié ?
          </Link>
          
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            Pas encore de compte ?{' '}
            <Link 
              to="/register"
              style={{
                color: '#0066cc',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}