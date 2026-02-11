import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiCall } from '../services/api';

export default function PasswordResetConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifier que le lien est valide
    if (!token || !email) {
      setError('❌ Lien de réinitialisation invalide');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validations
    if (!newPassword || !confirmPassword) {
      setError('Veuillez entrer votre nouveau mot de passe');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérifier la complexité du mot de passe
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError('Le mot de passe doit contenir des majuscules, minuscules et chiffres');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiCall('/auth/password-reset-confirm', {
        method: 'POST',
        body: JSON.stringify({ token, email, newPassword })
      });

      setMessage(data?.message || '✅ Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err?.message || 'Erreur serveur. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error && error.includes('invalide')) {
    return (
      <div className="page-container">
        <div style={{ maxWidth: '450px', margin: '2rem auto', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '2rem' }}>⚠️ Lien invalide</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link 
            to="/password-reset"
            style={{
              display: 'inline-block',
              padding: '0.8rem 2rem',
              background: '#003366',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ maxWidth: '450px', margin: '2rem auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🔑 Définir un nouveau mot de passe</h1>

        {error && (
          <div style={{
            color: '#d32f2f',
            background: '#ffebee',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #ef5350'
          }}>
            {error}
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
              Nouveau mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Entrez votre nouveau mot de passe"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  paddingRight: '40px'
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              ✓ Au moins 8 caractères
              <br />
              ✓ Majuscules, minuscules et chiffres
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Confirmer le mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Confirmez votre mot de passe"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
                autoComplete="new-password"
              />
            </div>
            {newPassword && confirmPassword && newPassword === confirmPassword && (
              <p style={{ fontSize: '0.85rem', color: '#2e7d32', marginTop: '0.5rem' }}>
                ✅ Les mots de passe correspondent
              </p>
            )}
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p style={{ fontSize: '0.85rem', color: '#d32f2f', marginTop: '0.5rem' }}>
                ❌ Les mots de passe ne correspondent pas
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !newPassword || !confirmPassword}
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              background: (isLoading || !newPassword || !confirmPassword) ? '#ccc' : '#003366',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: (isLoading || !newPassword || !confirmPassword) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {isLoading ? '⏳ Réinitialisation...' : '✅ Réinitialiser le mot de passe'}
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
