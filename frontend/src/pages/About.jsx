import React from 'react';

export default function About() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">À propos d'Aide Ton Prochain</h1>
        <p className="page-subtitle">
          Notre mission : créer des liens dans votre commune grâce à l'entraide locale
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Mission Card */}
        <div className="card" style={{ animation: 'slideUp 0.6s ease' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div style={{ 
              fontSize: '3rem', 
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              padding: '1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🤝
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
                Notre Mission
              </h2>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Aide Ton Prochain rapproche les voisins pour s'entraider simplement. 
                Nous croyons en la force de la solidarité locale et facilitons les échanges 
                de services entre habitants d'une même commune.
              </p>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
                Que vous ayez besoin d'aide pour vos courses, d'un coup de main en informatique, 
                ou que vous souhaitiez proposer vos services, notre plateforme vous met en relation 
                avec des personnes de confiance près de chez vous.
              </p>
            </div>
          </div>
        </div>

        {/* Values Cards */}
        <div className="card-grid">
          <div className="card" style={{ animation: 'slideUp 0.7s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Local & Solidaire</h3>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
              Nous privilégions les circuits courts et l'entraide de proximité pour renforcer 
              le tissu social de votre commune.
            </p>
          </div>

          <div className="card" style={{ animation: 'slideUp 0.8s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Simple & Accessible</h3>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
              Une plateforme intuitive accessible à tous, des jeunes de 16 ans aux seniors. 
              Pas de complications, juste de l'entraide.
            </p>
          </div>

          <div className="card" style={{ animation: 'slideUp 0.9s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Confiance & Sécurité</h3>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
              Tous nos prestataires sont vérifiés et notés par la communauté. 
              Votre sécurité est notre priorité.
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="card" style={{ 
          animation: 'slideUp 1s ease',
          background: 'linear-gradient(135deg, #000000ff, #000000ff)',
          border: '2px dashed var(--primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🚀</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                Version Prototype
              </h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '0' }}>
                Vous utilisez notre prototype fonctionnel. De nombreuses améliorations sont prévues : 
                paiement intégré, profils complets, système de notation avancé, messagerie instantanée, et bien plus !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}