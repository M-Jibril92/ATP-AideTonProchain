import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const PROVIDERS = [
  { id: 'p1', name: 'Julie Dupont', rating: 4.8 },
  { id: 'p2', name: 'Karim Ben', rating: 4.6 },
  { id: 'p3', name: 'Sophie Martin', rating: 5.0 },
];

export default function SelectProvider() {
  const { state } = useLocation();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const mission = state?.mission;
  const selectedSlot = state?.selectedSlot;

  if (!mission || !selectedSlot) {
    return <div className="page-container"><p>Erreur : données incomplètes.</p></div>;
  }

  const handleSelect = (provider) => {
    addItem({
      ...mission,
      provider: provider.name,
      timeSlot: selectedSlot,
    }, 1);
    navigate('/cart'); // redirige vers panier
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Choisissez un prestataire</h1>
      <p className="page-subtitle">
        Pour <strong>{mission.title}</strong> à <strong>{selectedSlot}</strong>
      </p>

      <div className="card-grid">
        {PROVIDERS.map(p => (
          <div 
            key={p.id}
            className="card"
            style={{ cursor: 'pointer' }}
            onClick={() => handleSelect(p)}
          >
            <h3>{p.name}</h3>
            <p>⭐ {p.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
