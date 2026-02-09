import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const DEFAULT_MISSIONS = [
  { id: 1, title: 'Aide au ménage', description: 'Service de nettoyage professionnel', category: 'Ménage', price: 30, duration: '2h', icon: '🧹' },
  { id: 2, title: 'Jardinage', description: 'Entretien et aménagement de jardins', category: 'Jardinage', price: 40, duration: '3h', icon: '🌿' },
  { id: 3, title: 'Bricolage', description: 'Petits travaux de réparation', category: 'Bricolage', price: 35, duration: '2h', icon: '🔧' },
  { id: 4, title: 'Déménagement', description: 'Aide au déménagement et transport', category: 'Déménagement', price: 50, duration: '4h', icon: '📦' },
  { id: 5, title: 'Garde d\'enfants', description: 'Babysitting et garde d\'enfants', category: 'Garde', price: 15, duration: '1h', icon: '👶' },
  { id: 6, title: 'Courses & Commissions', description: 'Faire les courses pour vous', category: 'Assistance', price: 20, duration: '1h30', icon: '🛍️' },
  { id: 7, title: 'Accompagnement aux rendez-vous médicaux', description: 'Accompagnement et soutien lors de vos rendez-vous', category: 'Accompagnement', price: 25, duration: '2h', icon: '🏥' },
  { id: 8, title: 'Aide aux devoirs', description: 'Soutien scolaire et aide aux études', category: 'Formation', price: 20, duration: '1h', icon: '📚' },
  { id: 9, title: 'Assistance informatique', description: 'Aide informatique et dépannage', category: 'Informatique', price: 30, duration: '1h', icon: '💻' },
  { id: 10, title: 'Promenade & Sortie', description: 'Accompagnement pour promenades', category: 'Accompagnement', price: 15, duration: '1h', icon: '🚶' },
  { id: 11, title: 'Aide administrative', description: 'Aide pour démarches administratives', category: 'Assistance', price: 25, duration: '1h', icon: '📋' },
  { id: 12, title: 'Cuisine & Repas', description: 'Préparation de repas à domicile', category: 'Cuisine', price: 35, duration: '2h', icon: '🍳' }
];

export default function Tasks() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [missions, setMissions] = useState(DEFAULT_MISSIONS);
  const [customTasks, setCustomTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tous');
  const [showCustomTaskForm, setShowCustomTaskForm] = useState(false);
  const [customTaskName, setCustomTaskName] = useState('');
  const [customTaskDescription, setCustomTaskDescription] = useState('');
  const [customTaskSector, setCustomTaskSector] = useState('');

  // --- RÉCUPÉRATION DES DONNÉES (FETCH) ---
  useEffect(() => {
    // Timeout après 5 secondes si l'API ne répond pas
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeout);
        // Merge les données de l'API avec les missions par défaut
        const mergedMissions = Array.isArray(data) && data.length > 0 ? data : DEFAULT_MISSIONS;
        setMissions(mergedMissions);
        setLoading(false);
      })
      .catch(err => {
        clearTimeout(timeout);
        console.error("Erreur chargement services:", err);
        // Garde les missions par défaut en cas d'erreur
        setMissions(DEFAULT_MISSIONS);
        setLoading(false);
      });
    
    // Charger les tâches personnalisées du localStorage
    const savedCustomTasks = localStorage.getItem('customTasks');
    if (savedCustomTasks) {
      setCustomTasks(JSON.parse(savedCustomTasks));
    }
  }, []);

  // Gestion des catégories dynamiques
  const categories = ['Tous', ...new Set(missions.map(m => m.category || 'Autre'))];

  const filteredMissions = filter === 'Tous' 
    ? missions
    : missions.filter(m => m.category === filter);

  const handleAddCustomTask = () => {
    if (!customTaskName.trim() || !customTaskDescription.trim() || !customTaskSector) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newTask = {
      id: 'custom-' + Date.now(),
      title: customTaskName,
      description: customTaskDescription,
      category: 'Personnalisée',
      sector: customTaskSector,
      price: 25,
      duration: 'À convenir',
      icon: '💼'
    };

    // Ajouter directement au panier
    addItem(newTask, 1);
    
    setCustomTaskName('');
    setCustomTaskDescription('');
    setCustomTaskSector('');
    setShowCustomTaskForm(false);
    
    // Confirmation et redirection
    alert('✅ Tâche ajoutée au panier!');
    navigate('/reservation');
  };

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

      {/* Bouton Ajouter Tâche Personnalisée */}
      <button
        onClick={() => setShowCustomTaskForm(!showCustomTaskForm)}
        style={{
          marginBottom: '2rem',
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #00a8b5 0%, #00d4b4 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 168, 181, 0.3)'
        }}
      >
        {showCustomTaskForm ? '❌ Annuler' : '➕ Ajouter une tâche personnalisée'}
      </button>

      {/* Formulaire Tâche Personnalisée */}
      {showCustomTaskForm && (
        <div style={{
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          border: '2px solid #00a8b5',
          marginBottom: '2rem',
          boxShadow: '0 8px 16px rgba(0, 168, 181, 0.15)'
        }}>
          <h3 style={{ color: '#1e3a5f', marginBottom: '1.5rem' }}>Créer une tâche personnalisée (25€)</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e3a5f' }}>
              Nom de la tâche
            </label>
            <input
              type="text"
              placeholder="Ex: Aide pour déménager..."
              value={customTaskName}
              onChange={(e) => setCustomTaskName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e0e4e8',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e3a5f' }}>
              Description détaillée
            </label>
            <textarea
              placeholder="Décrivez précisément ce dont vous avez besoin..."
              value={customTaskDescription}
              onChange={(e) => setCustomTaskDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e0e4e8',
                fontSize: '1rem',
                fontFamily: 'inherit',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e3a5f' }}>
              Secteur d'activités
            </label>
            <select
              value={customTaskSector}
              onChange={(e) => setCustomTaskSector(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e0e4e8',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            >
              <option value="">Sélectionner un secteur...</option>
              <option value="Informatique & Technologie">Informatique & Technologie</option>
              <option value="Ménage & Nettoyage">Ménage & Nettoyage</option>
              <option value="Jardinage & Espaces Verts">Jardinage & Espaces Verts</option>
              <option value="Bricolage & Réparation">Bricolage & Réparation</option>
              <option value="Accompagnement & Assistance">Accompagnement & Assistance</option>
              <option value="Cours & Formation">Cours & Formation</option>
              <option value="Déménagement & Transport">Déménagement & Transport</option>
              <option value="Garde & Babysitting">Garde & Babysitting</option>
              <option value="Cuisine & Meal Prep">Cuisine & Meal Prep</option>
              <option value="Beauté & Bien-être">Beauté & Bien-être</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              background: '#ecf7f8',
              borderRadius: '12px',
              flex: 1,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00a8b5' }}>25€</span>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>Prix fixe</p>
            </div>
            <button
              onClick={handleAddCustomTask}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #00a8b5 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ✅ Créer la tâche
            </button>
          </div>
        </div>
      )}

      {/* Grille des Missions */}
      <div className="card-grid">
        {filteredMissions.map((m) => {
          const isCustom = String(m.id).startsWith('custom-');
          return (
            <div key={m.id} className="card" style={{display: 'flex', flexDirection: 'column', borderLeft: isCustom ? '4px solid #00a8b5' : 'none'}}>
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
                {m.icon || '🛠️'}
              </div>
              <h3>{m.title}</h3>
              {m.description && (
                <p style={{color: '#666', flex: 1, fontSize: isCustom ? '0.95rem' : '1rem'}}>
                  {m.description}
                </p>
              )}

              <div style={{display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontWeight: 'bold'}}>
                <span>
                  {m.duration && `⏱️ ${m.duration}`}
                  {m.sector && !m.duration && `🏢 ${m.sector}`}
                </span>
                <span style={{color: 'var(--primary)'}}>💰 {m.price}€</span>
              </div>

              <button 
                onClick={() => {
                  if (isCustom) {
                    alert(`Tâche personnalisée: ${m.title}\n${m.description}\n\nSecteur: ${m.sector || '—'}\nPrix: ${m.price}€`);
                  } else {
                    navigate('/select-time', { state: { mission: m } });
                  }
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {isCustom ? '👁️ Voir détails' : '📅 Réserver'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredMissions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p style={{ fontSize: '1.1rem' }}>Aucune tâche trouvée pour ce filtre.</p>
        </div>
      )}
    </div>
  );
}