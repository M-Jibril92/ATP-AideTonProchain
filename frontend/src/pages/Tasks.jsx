import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tasks() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]); // Liste vide au départ
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tous');

  // --- RÉCUPÉRATION DES DONNÉES (FETCH) ---
  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        setMissions(data); // On remplit la liste avec les vraies données
        setLoading(false);
      })
      .catch(err => console.error("Erreur chargement services:", err));
  }, []);

  // Gestion des catégories dynamiques
  const categories = ['Tous', ...new Set(missions.map(m => m.category || 'Autre'))];

  const filteredMissions = filter === 'Tous' 
    ? missions 
    : missions.filter(m => m.category === filter);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Chargement des missions...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Tâches & Missions</h1>
        <p className="page-subtitle">Services disponibles en temps réel</p>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'btn btn-primary' : 'btn btn-outline'}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille des Missions */}
      <div className="card-grid">
        {filteredMissions.map((m) => (
          <div key={m.id} className="card" style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
              {m.icon || '🛠️'}
            </div>
            <h3>{m.title}</h3>
            <p style={{color: '#666', flex: 1}}>{m.description}</p>
            
            <div style={{display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontWeight: 'bold'}}>
              <span>⏱️ {m.duration}</span>
              <span style={{color: 'var(--primary)'}}>💰 {m.price}€</span>
            </div>

            <button 
              onClick={() => navigate('/select-time', { state: { mission: m } })}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              📅 Réserver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}