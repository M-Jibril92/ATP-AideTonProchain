import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SelectTime() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);

  const mission = state?.mission;

  if (!mission) {
    return (
      <div className="page-container">
        <p>Erreur : aucune mission sélectionnée.</p>
      </div>
    );
  }

  // Paramètres des créneaux
  const daysToShow = 3; // aujourd'hui + 2 jours
  const startHour = 8;
  const endHour = 19; // non inclus
  const slotDuration = 1; // 1h

  // Génère les créneaux horaires
  const generateSlots = () => {
    const slots = [];
    for (let h = startHour; h < endHour; h += slotDuration) {
      const start = h.toString().padStart(2, '0') + ':00';
      const end = (h + slotDuration).toString().padStart(2, '0') + ':00';
      slots.push(`${start} - ${end}`);
    }
    return slots;
  };

  const slotsPerDay = generateSlots();

  // Génère les créneaux par jour
  const dailySlots = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayString = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    dailySlots.push({
      day: dayString,
      slots: slotsPerDay,
    });
  }

  // Fonction pour continuer vers Reservation
  const handleContinue = () => {
    navigate('/reservation', { state: { mission, selectedSlot } });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Choisissez un créneau horaire</h1>
      <p className="page-subtitle">
        Pour : <strong>{mission.title}</strong>
      </p>

      {dailySlots.map((day) => (
        <div key={day.day} style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>{day.day}</h3>
          <div className="card-grid">
            {day.slots.map((slot) => {
              const slotId = `${day.day} ${slot}`;
              const isSelected = selectedSlot === slotId;

              return (
                <div
                  key={slotId}
                  className={`card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slotId)}
                  style={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    userSelect: 'none',
                    border: isSelected ? `2px solid var(--primary)` : undefined,
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '';
                  }}
                >
                  {slot}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        disabled={!selectedSlot}
        onClick={handleContinue}
        className="btn btn-primary"
        style={{
          marginTop: '2rem',
          width: '100%',
          opacity: selectedSlot ? 1 : 0.6,
          cursor: selectedSlot ? 'pointer' : 'not-allowed',
        }}
      >
        Continuer ➜
      </button>
    </div>
  );
}
