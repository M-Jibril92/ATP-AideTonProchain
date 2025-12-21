import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState(''); // On utilise l'email, plus le "name"
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password); // Appel au Backend
      navigate('/tasks'); // Redirection si succès
    } catch (err) {
      setError(err.message); // Affiche l'erreur du backend (ex: "Mot de passe faux")
    }
  };

  return (
    <div className="page-container">
      <h1>Connexion</h1>
      {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{maxWidth: '400px', margin: '0 auto'}}>
        <div style={{marginBottom: '1rem'}}>
          <label>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            className="form-control"
            style={{width: '100%', padding: '8px'}}
          />
        </div>
        
        <div style={{marginBottom: '1rem'}}>
          <label>Mot de passe</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className="form-control"
            style={{width: '100%', padding: '8px'}}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Se connecter
        </button>
      </form>
    </div>
  );
}