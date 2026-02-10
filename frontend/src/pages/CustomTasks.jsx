import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function CustomTasks() {
  const { addItem } = useCart();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [sector, setSector] = useState('');
  const [taskDuration, setTaskDuration] = useState('1h');
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

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

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
    '18:30', '19:00', '19:30', '20:00'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName && sector) {
      const customTask = {
        id: 'custom-' + Date.now(),
        title: taskName,
        description: taskDescription || 'Tâche personnalisée',
        category: sector,
        price: 25,
        duration: taskDuration,
        icon: '💼',
        isCustom: true,
      };

      setCurrentTask(customTask);
      setSelectedTime('');
      
      // Réinitialiser le formulaire
      setTaskName('');
      setTaskDescription('');
      setSector('');
      setTaskDuration('1h');
    }
  };

  const handleAddToCart = () => {
    if (!selectedTime) {
      alert('⏰ Veuillez sélectionner un créneau horaire');
      return;
    }

    const itemForCart = {
      ...currentTask,
      selectedTime: selectedTime,
      qty: 1
    };

    addItem(itemForCart, 1);
    alert('✅ Tâche ajoutée au panier!');
    
    // Réinitialiser
    setCurrentTask(null);
    setSelectedTime('');
  };

  const handleCancel = () => {
    setCurrentTask(null);
    setSelectedTime('');
  };

  // === AFFICHAGE AVEC SÉLECTION DE CRÉNEAU EN COURS ===
  if (currentTask) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '2px solid #00a8b5',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 168, 181, 0.2)'
          }}>
            {/* Header */}
            <div style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, #00a8b5 0%, #009995 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '3rem' }}>{currentTask.icon}</span>
                <div>
                  <h2 style={{ margin: '0', color: 'white', fontSize: '1.8rem', fontWeight: '700' }}>
                    {currentTask.title}
                  </h2>
                  <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                    {currentTask.category}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '2rem' }}>
              <p style={{
                color: '#555',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                {currentTask.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: '#f0f8f9',
                borderRadius: '12px',
                border: '1px solid #00a8b5'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#7f8c8d', fontSize: '0.85rem', fontWeight: '600' }}>Durée</p>
                  <p style={{ margin: '0', fontWeight: '700', color: '#1e3a5f', fontSize: '1.2rem' }}>
                    {currentTask.duration}
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#7f8c8d', fontSize: '0.85rem', fontWeight: '600' }}>Prix fixe</p>
                  <p style={{ margin: '0', fontWeight: '700', color: '#00a8b5', fontSize: '1.2rem' }}>
                    {currentTask.price} €
                  </p>
                </div>
              </div>

              {/* Créneau Horaire */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  color: '#1e3a5f',
                  fontSize: '1rem'
                }}>
                  ⏰ Sélectionner un créneau horaire
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: selectedTime === time ? '2px solid #00a8b5' : '1px solid #e0e4e8',
                        background: selectedTime === time ? '#e8f5f3' : '#ffffff',
                        color: selectedTime === time ? '#00a8b5' : '#1e3a5f',
                        fontWeight: selectedTime === time ? '700' : '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTime !== time) {
                          e.target.style.background = '#f8f9fa';
                          e.target.style.borderColor = '#00a8b5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTime !== time) {
                          e.target.style.background = '#ffffff';
                          e.target.style.borderColor = '#e0e4e8';
                        }
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer - Buttons */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid #e0e4e8',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '0.875rem',
                  borderRadius: '10px',
                  background: '#f0f0f0',
                  color: '#555',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e0e0e0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f0f0f0';
                }}
              >
                ✕ Annuler
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedTime}
                style={{
                  padding: '0.875rem',
                  borderRadius: '10px',
                  background: selectedTime
                    ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)'
                    : '#d4d9dd',
                  color: 'white',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: selectedTime ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedTime) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(30, 58, 95, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTime) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                🛒 Ajouter au panier à {selectedTime || '--:--'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === AFFICHAGE NORMAL: FORMULAIRE DE CRÉATION ===
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

          {/* Durée */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontWeight: '600',
              color: '#1e3a5f',
              fontSize: '1rem'
            }}>
              Durée estimée
            </label>
            <select
              value={taskDuration}
              onChange={(e) => setTaskDuration(e.target.value)}
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
              <option value="30m">30 minutes</option>
              <option value="1h">1 heure</option>
              <option value="1h30">1h30</option>
              <option value="2h">2 heures</option>
              <option value="2h30">2h30</option>
              <option value="3h">3 heures</option>
              <option value="4h">4 heures</option>
              <option value="À convenir">À convenir</option>
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
            ➕ Créer la tâche
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
            💡 Après validation, vous sélectionnerez un créneau puis l'ajouterez au panier
          </p>
        </div>
      </div>
    </div>
  );
}
