import React from 'react';

const PROVIDERS = [
  { id: 'p1', name: 'Jean Dupont', skills: 'Jardinage, Bricolage', rating: 4.8, avatar: '👨‍🌾', experience: '5 ans', missions: 127 },
  { id: 'p2', name: 'Sophie Martin', skills: 'Garde d\'enfants, Soutien scolaire', rating: 4.9, avatar: '👩‍🏫', experience: '3 ans', missions: 94 },
  { id: 'p3', name: 'Lucas Bernard', skills: 'Informatique, Dépannage', rating: 4.7, avatar: '👨‍💻', experience: '4 ans', missions: 156 },
  { id: 'p4', name: 'Marie Dubois', skills: 'Promenade chiens, Pet sitting', rating: 5.0, avatar: '👩‍⚕️', experience: '2 ans', missions: 78 },
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

