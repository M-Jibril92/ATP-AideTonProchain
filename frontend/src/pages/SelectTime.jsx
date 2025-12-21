import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // <--- 1. IMPORT DU PANIER

export default function SelectTime() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart(); // <--- 2. RÉCUPÉRATION DE LA FONCTION AJOUTER
  const [selectedSlot, setSelectedSlot] = useState(null);

  const mission = state?.mission;

  if (!mission) {
    return (
      <div className="page-container">
        <p>Erreur : aucune mission sélectionnée.</p>
      </div>
    );
  }

  // --- Configuration des créneaux (Inchangé) ---
  const daysToShow = 3;
  const startHour = 8;
  const endHour = 19;
  const slotDuration = 1;

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
  const dailySlots = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayString = date.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
    dailySlots.push({ day: dayString, slots: slotsPerDay });
  }

  // --- FONCTION CORRIGÉE ---
  const handleContinue = () => {
    // 3. On ajoute VRAIMENT la mission au panier avant de partir
    addItem({
      ...mission, // On garde toutes les infos de la mission (titre, prix...)
      timeSlot: selectedSlot // On ajoute le créneau choisi
    });

    // 4. Ensuite, on va vers la page de paiement
    navigate('/reservation', { state: { selectedSlot } });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Choisissez un créneau horaire</h1>
      <p className="page-subtitle">Pour : <strong>{mission.title}</strong></p>

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
                    border: isSelected ? `2px solid var(--primary)` : '1px solid transparent',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : undefined,
                    transition: 'all 0.2s'
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
          marginTop: '2rem', width: '100%',
          opacity: selectedSlot ? 1 : 0.6,
          cursor: selectedSlot ? 'pointer' : 'not-allowed',
        }}
      >
        Valider ce créneau ➜
      </button>
    </div>
  );
}