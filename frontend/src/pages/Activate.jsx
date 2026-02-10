import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Activate() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (!token || !email) {
      setMessage('Lien d\'activation invalide.');
      return;
    }
    fetch(`http://localhost:5000/api/auth/activate?token=${token}&email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || 'Activation réussie.');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(() => setMessage('Erreur lors de l\'activation.'));
  }, [searchParams, navigate]);

  return (
    <div className="page-container" style={{maxWidth: 500, margin: '2rem auto'}}>
      <div className="card">
        <h1>Activation du compte</h1>
        <p style={{marginTop: '2rem', textAlign: 'center'}}>{message}</p>
        <p style={{marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center'}}>Vous serez redirigé vers la connexion...</p>
      </div>
    </div>
  );
}
