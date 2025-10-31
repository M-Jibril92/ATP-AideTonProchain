import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      id: 1,
      icon: '🛒',
      title: 'Courses & Livraison',
      description: 'Aide aux courses pour personnes âgées ou à mobilité réduite. Livraison à domicile.',
      features: ['Courses alimentaires', 'Livraison de médicaments', 'Achats divers'],
      price: 'À partir de 10€'
    },
    {
      id: 2,
      icon: '💻',
      title: 'Assistance Informatique',
      description: 'Installation de matériel, dépannage, formation aux outils numériques.',
      features: ['Installation logiciels', 'Dépannage PC/Mac', 'Formation internet'],
      price: 'À partir de 25€'
    },
    {
      id: 3,
      icon: '🐕',
      title: 'Garde d\'animaux',
      description: 'Promenade de chiens, garde à domicile, soins quotidiens.',
      features: ['Promenade quotidienne', 'Garde à domicile', 'Nourrissage'],
      price: 'À partir de 15€'
    },
    {
      id: 4,
      icon: '👶',
      title: 'Babysitting',
      description: 'Garde d\'enfants par des prestataires vérifiés et de confiance.',
      features: ['Garde à domicile', 'Sortie d\'école', 'Activités ludiques'],
      price: 'À partir de 12€/h'
    },
    {
      id: 5,
      icon: '🔧',
      title: 'Bricolage & Jardinage',
      description: 'Petits travaux, entretien extérieur, jardinage léger.',
      features: ['Petites réparations', 'Tonte pelouse', 'Taille de haies'],
      price: 'À partir de 20€'
    },
    {
      id: 6,
      icon: '📚',
      title: 'Soutien Scolaire',
      description: 'Aide aux devoirs et cours particuliers par des étudiants qualifiés.',
      features: ['Aide aux devoirs', 'Cours particuliers', 'Préparation examens'],
      price: 'À partir de 18€/h'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Nos Services</h1>
        <p className="page-subtitle">
          Une gamme complète de services pour tous vos besoins quotidiens
        </p>
      </div>

      <div className="card-grid">
        {services.map((service, index) => (
          <div 
            key={service.id}
            className="card"
            style={{ 
              animation: `slideUp ${0.3 + index * 0.1}s ease`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              fontSize: '4rem',
              textAlign: 'center',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: '1.5rem',
              borderRadius: '12px'
            }}>
              {service.icon}
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              {service.title}
            </h3>

            <p style={{ 
              color: 'var(--text-light)', 
              marginBottom: '1.5rem',
              lineHeight: '1.6',
              textAlign: 'center',
              flex: 1
            }}>
              {service.description}
            </p>

            <div style={{
              background: 'var(--bg-light)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <p style={{ 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}>
                ✨ Inclut :
              </p>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '1.25rem',
                color: 'var(--text-light)',
                fontSize: '0.875rem'
              }}>
                {service.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{feature}</li>
                ))}
              </ul>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)'
            }}>
              <span style={{ 
                fontWeight: '600',
                color: 'var(--primary)',
                fontSize: '1.1rem'
              }}>
                {service.price}
              </span>
              <Link to="/tasks" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Réserver →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="card" style={{
        marginTop: '3rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '3rem 2rem',
        animation: 'slideUp 1s ease'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Vous ne trouvez pas ce que vous cherchez ?
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
          Contactez-nous pour nous faire part de vos besoins spécifiques
        </p>
        <Link 
          to="/contact" 
          className="btn"
          style={{ background: 'white', color: 'var(--primary)' }}
        >
          📧 Nous contacter
        </Link>
      </div>
    </div>
  );
}