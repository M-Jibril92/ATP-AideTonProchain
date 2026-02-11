import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Activate() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('⏳ Activation en cours...');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    console.log('🔍 Paramètres reçus:', { token, email }); // Debug
    
    if (!token || !email) {
      setMessage('❌ Lien d\'activation invalide.');
      setStatus('error');
      return;
    }

    // Appeler l'endpoint d'activation avec API_URL configurée
    const activateUrl = `${API_URL}/auth/activate?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
    console.log('🔗 URL d\'activation:', activateUrl); // Debug
    
    fetch(activateUrl)
      .then(res => {
        console.log('📡 Statut réponse:', res.status); // Debug
        return res.json();
      })
      .then(data => {
        console.log('📦 Réponse API:', data); // Debug
        
        if (data.accessToken && data.refreshToken) {
          // ✅ Activation réussie avec tokens
          setMessage('✅ ' + (data.message || 'Votre compte a été activé avec succès !'));
          setStatus('success');
          
          // Stocker les tokens et l'utilisateur dans sessionStorage (comme login())
          sessionStorage.setItem('accessToken', data.accessToken);
          sessionStorage.setItem('refreshToken', data.refreshToken);
          sessionStorage.setItem('user', JSON.stringify(data.user));
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          console.error('❌ Tokens manquants dans la réponse:', data);
          setMessage('❌ Activation échouée. Tokens manquants.');
          setStatus('error');
        }
      })
      .catch(err => {
        console.error('❌ Erreur activation:', err);
        setMessage('❌ Erreur lors de l\'activation. Veuillez réessayer.');
        setStatus('error');
      });
  }, [searchParams, navigate]);

  return (
    <div className="page-container" style={{maxWidth: 500, margin: '2rem auto'}}>
      <div className="card" style={{textAlign: 'center'}}>
        <h1>🔐 Activation du compte</h1>
        <div style={{marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem'}}>
          {message}
        </div>
        {status === 'loading' && (
          <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#666'}}>
            Veuillez patienter...
          </p>
        )}
        {status === 'success' && (
          <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#28a745'}}>
            ✅ Vous serez redirigé vers l'accueil dans un instant...
          </p>
        )}
        {status === 'error' && (
          <div style={{marginTop: '1rem'}}>
            <p style={{fontSize: '0.9rem', color: '#d32f2f', marginBottom: '1rem'}}>
              Si le problème persiste, veuillez vous inscrire à nouveau.
            </p>
            <a href="/register" style={{color: '#0066cc', textDecoration: 'none'}}>
              ← Retour à l'inscription
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
