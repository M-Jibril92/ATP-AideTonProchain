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
    // Validation du mot de passe côté frontend
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
      // On envoie les données au Backend
      await register(formData);
      // Si ça marche, on redirige vers la page de connexion
      navigate('/login');
      alert("Compte créé avec succès ! Connectez-vous maintenant.");
    } catch (err) {
      // Afficher les erreurs détaillées
      if (err.errors) {
        // Affiche chaque erreur de validation
        setError(Object.values(err.errors).join(' | '));
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="page-container" style={{maxWidth: '500px', margin: '2rem auto'}}>
      <div className="card">
        <h1 style={{textAlign: 'center', marginBottom: '1.5rem'}}>📝 Inscription</h1>
        
        {error && <div style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
        
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
                Mot de passe sécurisé
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