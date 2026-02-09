import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function CustomTasks() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [sector, setSector] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sectors = [
    'Informatique & Technologie',
    'Ménage & Nettoyage',
    'Jardinage & Espaces Verts',
    'Bricolage & Réparation',
    'Accompagnement & Assistance',
    'Cours & Formation',
    'Déménagement & Transport',
    'Garde & Babysitting',
    'Cuisine & Meal Prep',
    'Beauté & Bien-être',
    'Autre'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName && sector) {
      // Créer la tâche personnalisée
      const customTask = {
        id: 'custom-' + Date.now(),
        title: taskName,
        description: taskDescription || 'Tâche personnalisée',
        category: sector,
        price: 25,
        duration: 'À convenir',
        icon: '💼',
        isCustom: true,
        qty: 1
      };

      // Ajouter directement au panier
      addItem(customTask, 1);
      
      setSubmitted(true);
      setTimeout(() => {
        alert('✅ Tâche ajoutée au panier!');
        navigate('/reservation');
      }, 500);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Hero Section */}
      <header style={{
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)',
        padding: '4rem 2rem',
        borderRadius: '20px',
        border: '1px solid #e0e4e8',
        textAlign: 'center',
        boxShadow: '0 8px 20px rgba(31, 58, 95, 0.06)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1e3a5f',
          marginBottom: '1rem'
        }}>
          💼 Tâche Personnalisée
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#7f8c8d',
          lineHeight: '1.8',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Créez une tâche personnalisée pour 25€. Décrivez votre besoin spécifique et choisissez le secteur d'activité.
        </p>
      </header>

      {/* Form Section */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit} style={{
          background: '#ffffff',
          padding: '2.5rem',
          borderRadius: '20px',
          border: '1px solid #e0e4e8',
          boxShadow: '0 4px 12px rgba(31, 58, 95, 0.06)'
        }}>
          {/* Nom de la mission */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontWeight: '600',
              color: '#1e3a5f',
              fontSize: '1rem'
            }}>
              Nom de la mission
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Ex: Aide pour déménager, Cours de piano, etc."
              style={{
                width: '100%',
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                border: '2px solid #e0e4e8',
                fontSize: '1rem',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00a8b5'}
              onBlur={(e) => e.target.style.borderColor = '#e0e4e8'}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontWeight: '600',
              color: '#1e3a5f',
              fontSize: '1rem'
            }}>
              Description (optionnel)
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Décrivez plus en détail ce que vous recherchez..."
              style={{
                width: '100%',
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                border: '2px solid #e0e4e8',
                fontSize: '1rem',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                outline: 'none',
                minHeight: '100px',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00a8b5'}
              onBlur={(e) => e.target.style.borderColor = '#e0e4e8'}
            />
          </div>

          {/* Secteur d'activité */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontWeight: '600',
              color: '#1e3a5f',
              fontSize: '1rem'
            }}>
              Secteur d'activité
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                border: '2px solid #e0e4e8',
                fontSize: '1rem',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00a8b5'}
              onBlur={(e) => e.target.style.borderColor = '#e0e4e8'}
            >
              <option value="">Sélectionnez un secteur</option>
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '2px solid #00a8b5',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0', color: '#7f8c8d', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Prix fixe
            </p>
            <p style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#00a8b5',
              margin: '0'
            }}>
              25 €
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!taskName || !sector}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              background: taskName && sector 
                ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)' 
                : '#d4d9dd',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: taskName && sector ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: taskName && sector 
                ? '0 6px 16px rgba(30, 58, 95, 0.2)' 
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (taskName && sector) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 24px rgba(30, 58, 95, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (taskName && sector) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 16px rgba(30, 58, 95, 0.2)';
              }
            }}
          >
            {submitted ? '✓ Ajouté au panier!' : '🛒 Ajouter au panier (25€)'}
          </button>
        </form>

        {/* Info Box */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#e8f5f3',
          borderRadius: '12px',
          border: '1px solid #00a8b5',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#00a8b5',
            fontSize: '0.95rem',
            margin: '0',
            fontWeight: '600'
          }}>
            💡 Votre tâche sera affichée et les prestataires pourront proposer leurs services
          </p>
        </div>
      </div>
    </div>
  );
}
