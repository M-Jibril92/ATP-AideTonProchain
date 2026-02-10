import React from 'react';
import logoATP from '../assets/logo-atp.png';

const PROVIDERS = [
  { id: 'p1', name: 'Mohamed-Jibril', skills: 'Souriant et motivé je souhaite aider le plus de personnes ', rating: 5.0, avatar: '👨‍🌾', experience: 'CEO & Président', missions: 0 },
  { id: 'p2', name: 'Ayman', skills: 'Infatiguable et dynamique je peux réaliser toutes les missions', rating: 4.9, avatar: '👩‍🏫', experience: 'Develloper & étudiant en informatque', missions: 0 },
  { id: 'p3', name: 'Elyas Badry', skills: 'Informatique, Dépannage et performant dans toutes les missions physiques', rating: 4.7, avatar: '👨‍💻', experience: 'Etudiant à EPITA', missions: 0 },
  { id: 'p4', name: 'Naim', skills: 'Promenade chiens, Pet sitting, informatique et grand sportif', rating: 5.0, avatar: '👩‍⚕️', experience: 'Resonsable de la sécurité', missions: 0},
  { id: 'p5', name: 'Djime', skills: 'Champion de France de Volley', rating: 5.0, avatar: '👩‍⚕️', experience: 'Responsable de la gestion et de la comptabilité', missions: 0},
];

export default function Providers() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header avec logo */}
      <div style={{
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, #e6f4f1 0%, #f0f6ff 100%)',
        padding: '2.5rem 2rem 2rem 2rem',
        borderRadius: '20px',
        border: '1px solid #b6d4e7',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <img src={logoATP} alt="Logo ATP" style={{ height: 70, marginRight: 24, borderRadius: 12, boxShadow: '0 2px 8px #b6d4e7' }} />
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#003366',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Nos prestataires
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            lineHeight: '1.8',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Des voisins de confiance, vérifiés et notés par la communauté
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {PROVIDERS.map((p, index) => (
          <div
            key={p.id}
            style={{
              padding: '2rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #e6f4f1 0%, #f0f6ff 100%)',
              border: '1px solid #b6d4e7',
              boxShadow: '0 8px 24px #b6d4e7',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              animation: `slideUp ${0.5 + index * 0.08}s ease`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#003366';
              e.currentTarget.style.boxShadow = '0 12px 32px #b6d4e7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#b6d4e7';
              e.currentTarget.style.boxShadow = '0 8px 24px #b6d4e7';
            }}
          >
            {/* Header with Avatar and Name */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              <div style={{
                fontSize: '3rem',
                background: '#fff',
                padding: '1rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '80px',
                height: '80px',
                boxShadow: '0 8px 20px #b6d4e7'
              }}>
                {p.avatar}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#003366', // bleu foncé, très lisible
                  textShadow: '0 1px 4px #b6d4e7', // léger contour pour contraste
                }}>
                  {p.name}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '700',
                    fontSize: '1.1rem'
                  }}>
                    ⭐ {p.rating}
                  </span>
                  <span style={{
                    color: '#cbd5e1',
                    fontSize: '0.9rem'
                  }}>
                    {p.missions} missions
                  </span>
                </div>

                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  margin: '0',
                  fontStyle: 'italic'
                }}>
                  {p.experience}
                </p>
              </div>
            </div>

            {/* Skills Box */}
            <div style={{
              padding: '1.25rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              flex: 1
            }}>
              <p style={{
                color: '#60a5fa',
                fontSize: '0.85rem',
                margin: '0 0 0.75rem 0',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🛠️ Compétences
              </p>
              <p style={{
                color: '#cbd5e1',
                margin: '0',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                {p.skills}
              </p>
            </div>

            {/* Contact Button */}
            <button
              style={{
                padding: '0.9rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              📞 Contacter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}