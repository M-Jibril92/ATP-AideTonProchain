import React from 'react';

export default function About() {
  const cardStyle = {
    padding: '2.5rem',
    borderRadius: '16px',
    background: '#ffffff',
    border: '1px solid #e0e4e8',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 4px 12px rgba(31, 58, 95, 0.06)'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
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
          À propos d'Aide Ton Prochain
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: '#7f8c8d',
          lineHeight: '1.8',
          maxWidth: '700px',
          margin: '0 auto',
          fontWeight: '400'
        }}>
          Découvrez comment notre plateforme renforce les liens de solidarité et facilite l'entraide dans votre commune.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Mission Card */}
        <div className="card" style={{ ...cardStyle }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              background: 'linear-gradient(135deg, #1e3a5f, #2d5a8a)',
              padding: '1.5rem',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '80px',
              height: '80px',
              flexShrink: 0,
              boxShadow: '0 6px 16px rgba(31, 58, 95, 0.15)',
              color: 'white'
            }}>
              🤝
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#1e3a5f', fontWeight: '700' }}>
                Notre Mission
              </h2>
              <p style={{ color: '#7f8c8d', lineHeight: '1.7', marginBottom: '1rem', fontSize: '1rem' }}>
                Aide Ton Prochain rapproche les voisins pour s'entraider simplement. 
                Nous croyons en la force de la solidarité locale et facilitons les échanges 
                de services entre habitants d'une même commune.
              </p>
              <p style={{ color: '#7f8c8d', lineHeight: '1.7', fontSize: '1rem' }}>
                Que vous ayez besoin d'aide pour vos courses, d'un coup de main en informatique, 
                ou que vous souhaitiez proposer vos services, notre plateforme vous met en relation 
                avec des personnes de confiance près de chez vous.
              </p>
            </div>
          </div>
        </div>

        {/* Values Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          <div className="card" style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem'
            }}>
              🌍
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e3a5f', fontWeight: '700' }}>
              Local & Solidaire
            </h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Nous privilégions les circuits courts et l'entraide de proximité pour renforcer 
              le tissu social de votre commune.
            </p>
          </div>

          <div className="card" style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem'
            }}>
              ✨
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e3a5f', fontWeight: '700' }}>
              Simple & Accessible
            </h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Une plateforme intuitive accessible à tous. 
              Pas de complications, juste de l'entraide simple et directe.
            </p>
          </div>

          <div className="card" style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem'
            }}>
              🔒
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1e3a5f', fontWeight: '700' }}>
              Confiance & Sécurité
            </h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Tous nos prestataires sont vérifiés et notés par la communauté. 
              Votre sécurité est notre priorité.
            </p>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="card" style={{ 
          ...cardStyle,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)',
          border: '2px solid #00a8b5',
          padding: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem', marginTop: '0.25rem', minWidth: '60px' }}>🚀</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1e3a5f', fontWeight: '700' }}>
                Version Prototype en Évolution
              </h3>
              <p style={{ color: '#7f8c8d', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Vous utilisez notre prototype fonctionnel. De nombreuses améliorations sont prévues et en cours de développement !
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>✅ Paiement intégré</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>✅ Profils complets</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>✅ Système de notation avancé</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>✅ Messagerie instantanée</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>✅ Calendrier partagé</div>
                <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>✅ Et bien plus !</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}