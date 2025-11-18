import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const BASE_MISSIONS = [
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
  {
    id: 'm7',
    title: 'Accompagnement au rdv médicaux',
    price: 15,
    duration: '1h30',
    category: 'Accompagnement',
    icon: '🚑',
    description: 'Aide au déplacement et accompagnement à un rendez-vous médical'
  }
];

const ALL_CATEGORIES = ['Tous', ...new Set(BASE_MISSIONS.map(m => m.category)), 'Personnalisée'];

export default function Tasks() {
  const nav = useNavigate();
  const [filter, setFilter] = useState('Tous');
  const [missions, setMissions] = useState(BASE_MISSIONS);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [customTask, setCustomTask] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    icon: '⭐'
  });

  // Filtres
  const filteredMissions =
    filter === 'Tous'
      ? missions
      : filter === 'Personnalisée'
        ? missions.filter(m => m.custom)
        : missions.filter(m => m.category === filter);

  const availableCategories = [...new Set(BASE_MISSIONS.map(m => m.category))];

  // Ajout tâche personnalisée
  const handleCustomTaskSubmit = (e) => {
    e.preventDefault();
    if (!customTask.title || !customTask.category) return;
    setMissions([
      ...missions,
      {
        ...customTask,
        id: `custom-${Date.now()}`,
        custom: true
      }
    ]);
    setShowModal(false);
    setCustomTask({
      title: '',
      description: '',
      category: '',
      price: '',
      duration: '',
      icon: '⭐'
    });
    setFilter('Personnalisée');
  };

  return (
    <div className="page-container">
      <style>{`
        .header-tasks-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }
        @media (max-width:600px) {
          .header-tasks-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.9rem;
          }
          .tasks-custom-btn {
            align-self: flex-end;
          }
        }
        .tasks-custom-btn {
          background: linear-gradient(120deg,#a259e4 0%,#ff6ee4 85%,#7ee8fa 100%);
          color: #231942;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.01rem;
          box-shadow: 0 2px 14px #a259e488;
          padding: 0.68rem 1.15rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
        }
        .tasks-custom-btn:hover {
          background: linear-gradient(120deg,#ff6ee4 0%,#a259e4 85%,#7ee8fa 100%);
          transform: scale(1.06);
          box-shadow:0 7px 37px #a259e4cc;
        }
        .custom-modal-bg {
          position: fixed;
          top:0;left:0;right:0;bottom:0;
          background: rgba(34,18,60,0.56);
          z-index:60;
        }
        .custom-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          min-width: 320px;
          max-width: 98vw;
          width: 400px;
          background: linear-gradient(120deg, #231942 20%, #3a0ca3 80%);
          color: #ececec;
          border-radius: 18px;
          box-shadow: 0 7px 30px #3a0ca3aa, 0 2px 40px #a259e4bb;
          padding: 2rem 1.3rem 1.3rem 1.3rem;
          z-index:100;
          animation: fadeIn 0.4s cubic-bezier(.4,0,.2,1);
          border: 2px solid #ff6ee433;
          display: flex;
          flex-direction: column;
        }
        .custom-modal h2 {
          margin-bottom: 1.1rem;
          font-size: 1.13rem;
          font-weight: 800;
          text-align:center;
          background: linear-gradient(120deg,#ff6ee4,#a259e4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .custom-modal form label {
          font-size: 0.96rem;
          font-weight: 600;
          margin-bottom:0.15rem;
        }
        .custom-modal form input,
        .custom-modal form textarea,
        .custom-modal form select {
          width: 100%;
          padding: 0.63rem;
          border-radius: 8px;
          border: none;
          margin-bottom: 0.7rem;
          font-size: 1rem;
          background: #141032;
          color: #ececec;
        }
        .custom-modal .modal-btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 0.4rem;
        }
        .custom-modal .modal-btns button {
          padding: 0.58rem 1.2rem;
        }
        .custom-modal .modal-btns .cancel {
          background: #231942;
          color: #a259e4;
          border: 1px solid #a259e4aa;
        }
        .custom-modal .modal-btns .submit {
          background: linear-gradient(120deg,#ff6ee4 0%,#a259e4 100%);
          color: #fff;
          border: none;
          font-weight:700;
        }
      `}</style>

      {/* Barre d'en-tête avec bouton à droite */}
      <div className="header-tasks-bar">
        <div>
          <div className="page-header" style={{marginBottom:0, position:"static"}}>
            <h1 className="page-title">Tâches & Missions</h1>
            <p className="page-subtitle">
              Découvrez les services disponibles et réservez en un clic
            </p>
          </div>
        </div>
        <button className="tasks-custom-btn" onClick={() => setShowModal(true)}>
          ⭐ Tâches personnalisée
        </button>
      </div>

      {/* Modal tâche personnalisée */}
      {showModal && (
        <>
          <div className="custom-modal-bg" onClick={() => setShowModal(false)} />
          <div className="custom-modal">
            <h2>Créer une tâche personnalisée</h2>
            <form onSubmit={handleCustomTaskSubmit}>
              <label htmlFor="custom-title">Titre*</label>
              <input 
                type="text"
                id="custom-title"
                required
                placeholder="Ex : Ranger la cave"
                value={customTask.title}
                onChange={e => setCustomTask({...customTask, title: e.target.value})}
              />
              <label htmlFor="custom-desc">Description</label>
              <textarea
                id="custom-desc"
                placeholder="Décrivez la tâche..."
                rows={2}
                value={customTask.description}
                onChange={e => setCustomTask({...customTask, description: e.target.value})}
              />
              <label htmlFor="custom-cat">Catégorie*</label>
              <select 
                id="custom-cat"
                required
                value={customTask.category}
                onChange={e => setCustomTask({...customTask, category: e.target.value})}
              >
                <option value="">Choisir...</option>
                {availableCategories.map(cat =>
                  <option key={cat} value={cat}>{cat}</option>
                )}
                <option value="Autre">Autre</option>
              </select>
              <label htmlFor="custom-dur">Durée</label>
              <input 
                type="text"
                id="custom-dur"
                placeholder="Ex : 30min"
                value={customTask.duration}
                onChange={e => setCustomTask({...customTask, duration: e.target.value})}
              />
              <label htmlFor="custom-price">Prix (€)</label>
              <input 
                type="number"
                id="custom-price"
                placeholder="Ex : 10"
                value={customTask.price}
                onChange={e => setCustomTask({...customTask, price: e.target.value})}
              />
              <div className="modal-btns">
                <button type="button" className="cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button className="submit" type="submit">Ajouter</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Filtres */}
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        animation: 'slideDown 0.5s ease'
      }}>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ padding: '0.45rem 0.85rem', fontSize:"0.95rem"}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      <div className="card-grid">
        {filteredMissions.map((m, index) => (
          <div 
            key={m.id} 
            className="card"
            style={{ 
              animation: `slideUp ${0.3 + index * 0.09}s ease`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              fontSize: '3rem', 
              textAlign: 'center',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg,#a259e4 0%,#ff6ee4 80%,#7ee8fa 100%)',
              padding: '1rem',
              borderRadius: '12px'
            }}>
              {m.icon || '⭐'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '0.55rem' }}>
                <span style={{ 
                  fontSize: '0.74rem',
                  fontWeight: '600',
                  color: '#a259e4',
                  background: '#23194222',
                  padding: '0.18rem 0.58rem',
                  borderRadius: '6px'
                }}>
                  {m.category}
                </span>
              </div>

              <h3 style={{ 
                  fontSize: '1.13rem', 
                  marginBottom: '0.5rem',
                  color: m.custom ? '#ff6ee4' : "inherit"
                }}>
                {m.title}
              </h3>
              
              <p style={{ 
                color: '#aaa2c8', 
                fontSize: '0.83rem',
                marginBottom: '1rem',
                lineHeight: '1.48'
              }}>
                {m.description}
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '0.85rem',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0.57rem',
                background: '#141032',
                borderRadius: '7px'
              }}>
                <div>
                  <p style={{ fontSize: '0.71rem', color: '#aaa2c8', margin: 0 }}>
                    Durée
                  </p>
                  <p style={{ fontWeight: '600', margin: 0 }}>⏱️ {m.duration || "N/A"}</p>
                </div>
                <div style={{ width: '1px', height: '27px', background: '#302464' }} />
                <div>
                  <p style={{ fontSize: '0.71rem', color: '#aaa2c8', margin: 0 }}>
                    Tarif
                  </p>
                  <p style={{ fontWeight: '600', color: '#a259e4', margin: 0 }}>
                    💰 {m.price ? `${m.price}€` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => nav("/selectSlot", { state: { task: m } })}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: m.custom ? 0 : undefined }}
            >
              📅 Réserver
            </button>
          </div>
        ))}
      </div>

      {filteredMissions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.07rem', marginBottom: '0.5rem' }}>
            Aucune mission trouvée
          </h3>
          <p style={{ color: '#aaa2c8' }}>
            Essayez un autre filtre ou créez une tâche personnalisée !
          </p>
        </div>
      )}
    </div>
  );
}