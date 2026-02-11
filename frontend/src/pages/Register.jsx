import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const validatePassword = (password) => {
    if (password.length < 8) return 'Au moins 8 caractères';
    if (!/[A-Z]/.test(password)) return 'Au moins une majuscule';
    if (!/[a-z]/.test(password)) return 'Au moins une minuscule';
    if (!/\d/.test(password)) return 'Au moins un chiffre';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Au moins un caractère spécial';
    return '';
  };
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setPasswordError(validatePassword(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      // ✅ Inscription réussie - afficher message de vérification d'email
      setRegisteredEmail(formData.email);
      setRegistrationSuccess(true);
    } catch (err) {
      if (err.errors) {
        setError(Object.values(err.errors).join(' | '));
      } else {
        setError(err.message);
      }
    }
  };

  // 📧 Écran de confirmation après inscription
  if (registrationSuccess) {
    return (
      <div className="page-container" style={{maxWidth: '500px', margin: '2rem auto'}}>
        <div className="card" style={{textAlign: 'center'}}>
          <h1 style={{marginBottom: '1.5rem'}}>✅ Inscription réussie !</h1>
          
          <div style={{background: '#e8f5e9', border: '2px solid #28a745', borderRadius: '8px', padding: '20px', marginBottom: '1.5rem'}}>
            <p style={{fontSize: '1.1rem', color: '#1b5e20', marginBottom: '1rem'}}>
              📧 Un email de confirmation a été envoyé à :
            </p>
            <p style={{fontSize: '1rem', fontWeight: 'bold', color: '#003366', marginBottom: '1rem'}}>
              {registeredEmail}
            </p>
            
            <div style={{background: 'white', padding: '15px', borderRadius: '6px', marginBottom: '1rem', textAlign: 'left'}}>
              <p style={{fontSize: '0.95rem', marginBottom: '10px', color: '#555'}}>
                <strong>📋 Voici les étapes :</strong>
              </p>
              <ol style={{margin: '0', paddingLeft: '20px', fontSize: '0.9rem', color: '#555', lineHeight: '1.8'}}>
                <li>Vérifiez votre boîte email (et le dossier spam)</li>
                <li>Cliquez sur le lien d'activation</li>
                <li>Vous serez automatiquement connecté</li>
                <li>Vous pourrez accéder à AideTonProchain</li>
              </ol>
            </div>
            
            <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '1rem'}}>
              Le lien reste valide pendant 24 heures.
            </p>
          </div>
          
          <div style={{background: '#fff3e0', border: '2px solid #ff9800', borderRadius: '8px', padding: '15px', marginBottom: '1.5rem'}}>
            <p style={{fontSize: '0.9rem', color: '#e65100', margin: '0'}}>
              <strong>🔒 Sécurité :</strong> Nous ne vous demanderons jamais votre mot de passe par email.
            </p>
          </div>
          
          <div style={{fontSize: '0.9rem', color: '#999', lineHeight: '1.6'}}>
            <p style={{margin: '0.5rem 0'}}>N'avez pas reçu l'email ?</p>
            <p style={{margin: '0.5rem 0'}}>Vérifiez votre dossier "Spam" ou "Promotions"</p>
          </div>
          
          <button 
            onClick={() => navigate('/login')} 
            style={{marginTop: '1.5rem', padding: '10px 20px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem'}}
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{maxWidth: '500px', margin: '2rem auto'}}>
      <div className="card">
        <h1 style={{textAlign: 'center', marginBottom: '1.5rem'}}>📝 Inscription</h1>
        
        {error && <div style={{color: 'red', marginBottom: '1rem', textAlign: 'center', padding: '10px', background: '#ffe8e8', borderRadius: '6px'}}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <div style={{flex: 1}}>
              <label>Prénom</label>
              <input 
                name="firstName" 
                value={formData.firstName} onChange={handleChange} 
                required className="form-control" 
                style={{width: '100%', padding: '10px'}}
              />
            </div>
            <div style={{flex: 1}}>
              <label>Nom</label>
              <input 
                name="lastName" 
                value={formData.lastName} onChange={handleChange} 
                required className="form-control" 
                style={{width: '100%', padding: '10px'}}
              />
            </div>
          </div>

          <div>
            <label>Email</label>
            <input 
              type="email" name="email" 
              value={formData.email} onChange={handleChange} 
              required className="form-control" 
              style={{width: '100%', padding: '10px'}}
            />
          </div>
          
          <div>
            <label>Mot de passe</label>
            <input 
              type="password" name="password" 
              value={formData.password} onChange={handleChange} 
              required className="form-control" 
              style={{width: '100%', padding: '10px'}}
            />
            {formData.password && passwordError && (
              <div style={{color: 'orange', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                {passwordError}
              </div>
            )}
            {formData.password && !passwordError && (
              <div style={{color: 'green', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                Mot de passe sécurisé ✓
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>
            Créer mon compte
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem'}}>
          Déjà un compte ? <Link to="/login" style={{color: 'var(--primary)'}}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}