import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Contact message', form);
    
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="page-container">
        <div className="card" style={{ 
          maxWidth: '600px', 
          margin: '4rem auto',
          textAlign: 'center',
          padding: '3rem',
          animation: 'slideUp 0.5s ease'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', color: 'var(--secondary)' }}>
            Message envoyé !
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setSent(false)}
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Contactez-nous</h1>
        <p className="page-subtitle">
          Une question ? Une suggestion ? N'hésitez pas à nous écrire !
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Contact Form */}
        <div className="card" style={{ animation: 'slideUp 0.6s ease' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Envoyez-nous un message</h2>
          
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="label">Votre nom</label>
              <input 
                className="input"
                placeholder="Jean Dupont" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="label">Votre email</label>
              <input 
                className="input"
                type="email" 
                placeholder="jean.dupont@email.com" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="label">Votre message</label>
              <textarea 
                className="input"
                placeholder="Décrivez votre demande..." 
                value={form.message} 
                onChange={e => setForm({ ...form, message: e.target.value })} 
                rows={6} 
                required
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Envoi en cours...' : '📧 Envoyer le message'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ animation: 'slideUp 0.7s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Email</h3>
            <a href="mailto:aidetonprochain@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              Aidetonprochain@gmail.com
            </a>
          </div>

          <div className="card" style={{ animation: 'slideUp 0.8s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Réseaux sociaux</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '0' }}>
              Suivez-nous sur nos réseaux pour rester informé des nouveautés !
            </p>
          </div>

          <div className="card" style={{ animation: 'slideUp 0.9s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏰</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Horaires de réponse</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '0' }}>
              Nous répondons généralement sous 24-48h, du lundi au vendredi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}