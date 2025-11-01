import React from 'react';

const PROVIDERS = [
  { id: 'p1', name: 'Mohamed-Jibril', skills: 'Souriant et motivé je souhaite aider le plus de personnes ', rating: 5.0, avatar: '👨‍🌾', experience: 'CEO & Président', missions: 0 },
  { id: 'p2', name: 'Ayman', skills: 'Infatiguable et dynamique je peux réaliser toutes les missions', rating: 4.9, avatar: '👩‍🏫', experience: 'Develloper & étudiant en informatque', missions: 0 },
  { id: 'p3', name: 'Elyas Badry', skills: 'Informatique, Dépannage et performant dans toutes les missions physiques', rating: 4.7, avatar: '👨‍💻', experience: 'Etudiant à EPITA', missions: 0 },
  { id: 'p4', name: 'Naim', skills: 'Promenade chiens, Pet sitting, informatique et grand sportif', rating: 5.0, avatar: '👩‍⚕️', experience: 'Resonsable de la sécurité', missions: 0},
  { id: 'p5', name: 'Djime', skills: 'Champion de France de Volley', rating: 5.0, avatar: '👩‍⚕️', grade: 'Responsable de la gestion et de la comptabilité', missions: 0},


];

export default function Providers() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Nos prestataires</h1>
        <p className="page-subtitle">
          Des voisins de confiance, vérifiés et notés par la communauté
        </p>
      </div>

      <div className="card-grid">
        {PROVIDERS.map((p, index) => (
          <div 
            key={p.id} 
            className="card"
            style={{ animation: `slideUp ${0.6 + index * 0.1}s ease` }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '3rem',
                background: 'linear-gradient(135deg, #6366f1, #10b981)',
                padding: '0.75rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {p.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: '600' }}>⭐ {p.rating}</span>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    • {p.missions} missions
                  </span>
                </div>
              </div>
            </div>

            <div style={{ 
              padding: '0.75rem',
              background: 'var(--bg-light)',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <p style={{ 
                color: 'var(--text-light)', 
                fontSize: '0.875rem',
                margin: '0 0 0.5rem 0',
                fontWeight: '600'
              }}>
                🛠️ Compétences
              </p>
              <p style={{ color: 'var(--text)', margin: 0 }}>{p.skills}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                📅 {p.experience} d'expérience
              </span>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Contacter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

