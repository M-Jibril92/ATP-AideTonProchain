import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const MISSIONS = [
  { 
    id: 'm1', 
    title: 'Courses pour personne âgée', 
    price: 10, 
    duration: '45m',
    category: 'Courses',
    icon: '🛒',
    description: 'Aide aux courses hebdomadaires, livraison à domicile'
  },
  { 
    id: 'm2', 
    title: 'Garde d\'animaux', 
    price: 15, 
    duration: '1h',
    category: 'Animaux',
    icon: '🐕',
    description: 'Promenade et garde d\'animaux de compagnie'
  },
  { 
    id: 'm3', 
    title: 'Jardinage léger', 
    price: 20, 
    duration: '2h',
    category: 'Bricolage',
    icon: '🌱',
    description: 'Tonte, taille de haies, entretien général'
  },
  { 
    id: 'm4', 
    title: 'Soutien scolaire maths', 
    price: 18, 
    duration: '1h',
    category: 'Éducation',
    icon: '📐',
    description: 'Aide aux devoirs niveau collège/lycée'
  },
  { 
    id: 'm5', 
    title: 'Installation informatique', 
    price: 25, 
    duration: '1h30',
    category: 'Informatique',
    icon: '💻',
    description: 'Installation logiciels, dépannage PC'
  },
  { 
    id: 'm6', 
    title: 'Babysitting', 
    price: 12, 
    duration: '1h',
    category: 'Garde',
    icon: '👶',
    description: 'Garde d\'enfants à domicile'
  },
];

export default function Tasks() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tous');
  const categories = ['Tous', ...new Set(MISSIONS.map(m => m.category))];

  const filteredMissions = filter === 'Tous' 
    ? MISSIONS 
    : MISSIONS.filter(m => m.category === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Tâches & Missions</h1>
        <p className="page-subtitle">
          Découvrez les services disponibles et réservez en un clic
        </p>
      </div>

      {/* Filtres */}
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        animation: 'slideDown 0.5s ease'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ padding: '0.5rem 1rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Missions */}
      <div className="card-grid">
        {filteredMissions.map((m, index) => (
          <div 
            key={m.id} 
            className="card"
            style={{ 
              animation: `slideUp ${0.3 + index * 0.1}s ease`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              fontSize: '3.5rem', 
              textAlign: 'center',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: '1rem',
              borderRadius: '12px'
            }}>
              {m.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ 
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--primary)',
                  background: 'var(--bg-light)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px'
                }}>
                  {m.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {m.title}
              </h3>
              
              <p style={{ 
                color: 'var(--text-light)', 
                fontSize: '0.875rem',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {m.description}
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'var(--bg-light)',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>
                    Durée
                  </p>
                  <p style={{ fontWeight: '600', margin: 0 }}>⏱️ {m.duration}</p>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>
                    Tarif
                  </p>
                  <p style={{ fontWeight: '600', color: 'var(--primary)', margin: 0 }}>
                    💰 {m.price}€
                  </p>
                </div>
              </div>
            </div>

            {/* 🔁 Bouton modifié */}
            <button 
              onClick={() => navigate('/select-time', { state: { mission: m } })}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              📅 Réserver
            </button>
          </div>
        ))}
      </div>

      {filteredMissions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Aucune mission trouvée
          </h3>
          <p style={{ color: 'var(--text-light)' }}>
            Essayez un autre filtre ou revenez plus tard
          </p>
        </div>
      )}
    </div>
  );
}
