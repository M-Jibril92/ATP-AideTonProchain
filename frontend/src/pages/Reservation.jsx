import React from 'react';
import { useCart } from '../contexts/CartContext';

export default function Reservation() {
  const { items, removeItem, updateQty, clear } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="card" style={{ 
          maxWidth: '600px', 
          margin: '4rem auto',
          textAlign: 'center',
          padding: '3rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Votre panier est vide</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Découvrez nos services disponibles et réservez dès maintenant !
          </p>
          <a href="/tasks" className="btn btn-primary">
            Voir les tâches disponibles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mon panier</h1>
        <p className="page-subtitle">
          Finalisez votre réservation en un clic
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {items.map((it, index) => (
            <div 
              key={it.id} 
              className="card"
              style={{ animation: `slideUp ${0.3 + index * 0.1}s ease` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{it.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      background: 'var(--bg-light)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--primary)'
                    }}>
                      {it.price}€
                    </span>
                    {it.duration && (
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                        ⏱️ {it.duration}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Qté:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={it.qty} 
                      onChange={(e) => updateQty(it.id, Number(e.target.value) || 1)} 
                      style={{ 
                        width: '70px',
                        padding: '0.5rem',
                        border: '2px solid var(--border)',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => removeItem(it.id)}
                    className="btn btn-danger"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    🗑️ Retirer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Actions */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          border: '2px solid var(--primary)',
          animation: 'slideUp 0.5s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                Total à payer
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>
                {total.toFixed(2)}€
              </p>
            </div>
            <div style={{ fontSize: '3rem' }}>💳</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <button 
              onClick={() => { alert('Procéder au paiement (fonctionnalité à venir)'); }}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
            >
              🔒 Procéder au paiement
            </button>
            <button 
              onClick={clear}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              🗑️ Vider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
