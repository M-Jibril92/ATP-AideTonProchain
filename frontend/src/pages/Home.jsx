import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const cardStyle = {
    padding: '2.5rem',
    borderRadius: '16px',
    background: '#ffffff',
    border: '1px solid #e0e4e8',
    boxShadow: '0 4px 12px rgba(31, 58, 95, 0.06)',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardHoverStyle = {
    transform: 'translateY(-6px)',
    borderColor: '#20c5d6',
    boxShadow: '0 12px 32px rgba(0, 168, 181, 0.15)'
  };

  const linkStyle = {
    display: 'inline-block',
    padding: '0.9rem 1.8rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    marginTop: '1.5rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(30, 58, 95, 0.2)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <header style={{
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)',
        padding: '5rem 2rem',
        borderRadius: '20px',
        border: '1px solid #e0e4e8',
        textAlign: 'center',
        boxShadow: '0 8px 20px rgba(31, 58, 95, 0.06)'
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: '700',
          color: '#1e3a5f',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Bienvenue sur Aide Ton Prochain
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: '#7f8c8d',
          lineHeight: '1.8',
          maxWidth: '700px',
          margin: '0 auto',
          fontWeight: '400'
        }}>
          Plateforme d'entraide locale : trouvez des missions, réservez un prestataire, aidez votre voisin.
        </p>
      </header>

      {/* Main Cards Grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        {/* Besoin d'aide Card */}
        <div
          className="home-card"
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = cardHoverStyle.transform;
            e.currentTarget.style.borderColor = cardHoverStyle.borderColor;
            e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#e0e4e8';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(31, 58, 95, 0.08)';
          }}
        >
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: '#1e3a5f',
            textAlign: 'center'
          }}>
            🆘
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e3a5f',
            marginBottom: '0.5rem'
          }}>
            Besoin d'aide ?
          </h3>
          <p style={{
            color: '#7f8c8d',
            marginBottom: '1rem',
            lineHeight: '1.6'
          }}>
            Vous avez besoin d'un coup de main ? Créez une tâche et trouvez un prestataire qualifié dans votre région.
          </p>
          <Link to="/tasks" style={linkStyle}>
            Créer une tâche →
          </Link>
        </div>
        {/* Prestataire Card */}
        <div
          className="home-card"
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = cardHoverStyle.transform;
            e.currentTarget.style.borderColor = cardHoverStyle.borderColor;
            e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#e0e4e8';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(31, 58, 95, 0.08)';
          }}
        >
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: '#2d5a8a',
            textAlign: 'center'
          }}>
            💼
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e3a5f',
            marginBottom: '0.5rem'
          }}>
            Vous êtes prestataire ?
          </h3>
          <p style={{
            color: '#7f8c8d',
            marginBottom: '1rem',
            lineHeight: '1.6'
          }}>
            Inscrivez-vous pour proposer vos services et gagner de l'argent. Développez votre activité.
          </p>
          <Link to="/providers" style={linkStyle}>
            Voir les prestataires →
          </Link>
        </div>

        {/* À propos Card */}
        <div
          className="home-card"
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = cardHoverStyle.transform;
            e.currentTarget.style.borderColor = cardHoverStyle.borderColor;
            e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#e0e4e8';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(31, 58, 95, 0.08)';
          }}
        >
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: '#00a8b5',
            textAlign: 'center'
          }}>
            ℹ️
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e3a5f',
            marginBottom: '0.5rem'
          }}>
            En savoir plus
          </h3>
          <p style={{
            color: '#7f8c8d',
            marginBottom: '1rem',
            lineHeight: '1.6'
          }}>
            Découvrez notre mission et nos valeurs. Comprenez comment nous aidons votre communauté.
          </p>
          <Link to="/about" style={linkStyle}>
            Lire notre histoire →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)',
        padding: '3rem 2rem',
        borderRadius: '16px',
        textAlign: 'center',
        color: 'white',
        marginBottom: '3rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          Prêt à commencer ?
        </h2>
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Rejoignez notre communauté dès maintenant et aidez votre voisin ou trouvez de l'aide.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/register" 
            style={{
              ...linkStyle,
              background: 'white',
              color: '#1e3a5f',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            S'inscrire
          </Link>
          <Link 
            to="/about" 
            style={{
              ...linkStyle,
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              color: 'white'
            }}
          >
            En savoir plus
          </Link>
        </div>
      </section>
    </div>
  );
}
