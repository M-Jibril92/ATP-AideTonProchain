
import React, { useState } from 'react';
import AdresseAutoComplete from '../components/AdresseAutoComplete.jsx';
import { useAuth } from '../contexts/useAuth';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const { user } = useAuth();
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0).toFixed(2);
  const [address, setAddress] = useState({
    rue: '',
    ville: '',
    batiment: '',
    quartier: ''
  });
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="page-container">
        <h1>Paiement</h1>
        <p style={{ color: 'red' }}>Vous devez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

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
            Retournez à votre panier pour ajouter des services.
          </p>
          <button
            onClick={() => navigate('/reservation')}
            className="btn btn-primary"
          >
            🛒 Retour au panier
          </button>
        </div>
      </div>
    );
  }

  const handleStripeCheckout = async () => {
    setError('');
    if (!address.rue || !address.ville) {
      setError('Merci de renseigner au moins la rue et la ville.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.title,
            quantity: item.qty,
            price: Math.round((item.price || 0) * 100),
          })),
          userId: user.id,
          email: user.email,
          address
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur lors de la création de la session Stripe');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCashPayment = async () => {
    setError('');
    if (!address.rue || !address.ville) {
      setError('Merci de renseigner au moins la rue et la ville.');
      return;
    }
    // Ici tu peux envoyer la commande au backend (à adapter si tu veux stocker les paiements espèces)
    alert('Commande validée pour paiement en espèce sur place !');
    clear();
    navigate('/tasks');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Finaliser le paiement</h1>
        <p className="page-subtitle">
          Confirmez votre commande et payez en toute sécurité via Stripe
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card" style={{ animation: 'slideUp 0.3s ease', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>📦 Récapitulatif de commande</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  animation: `slideUp ${0.3 + index * 0.1}s ease`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0' }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                      Quantité: {item.qty}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: '600' }}>
                    {(item.price * item.qty).toFixed(2)} €
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #ddd'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Total:</span>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                {total} €
              </span>
            </div>
          </div>
        </div>
        {/* Formulaire d'adresse */}
        <form style={{marginBottom: '1.5rem'}} onSubmit={e => {e.preventDefault(); handleStripeCheckout();}}>
          <h3 style={{marginBottom: '1rem'}}>Adresse de la prestation</h3>
          <div style={{display:'flex', gap:'1rem', marginBottom:'0.7rem'}}>
            <div style={{flex:2}}>
              <AdresseAutoComplete value={address.rue} onChange={val=>setAddress({...address, rue: val})} />
            </div>
            <div style={{flex:1}}>
              <input type="text" placeholder="Ville*" value={address.ville} onChange={e=>setAddress({...address, ville: e.target.value})} style={{width:'100%', padding:'0.7rem', borderRadius:6, border:'1px solid #ddd'}} required />
            </div>
          </div>
          <div style={{display:'flex', gap:'1rem', marginBottom:'0.7rem'}}>
            <input type="text" placeholder="Bâtiment / Immeuble" value={address.batiment} onChange={e=>setAddress({...address, batiment: e.target.value})} style={{flex:1, padding:'0.7rem', borderRadius:6, border:'1px solid #ddd'}} />
          </div>
          {error && <div style={{color:'red', marginBottom:'0.7rem'}}>{error}</div>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', fontWeight: '700', marginBottom:'0.5rem' }}
          >
            🔒 Payer avec Stripe
          </button>
        </form>
        <button
          onClick={handleCashPayment}
          className="btn btn-outline"
          style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', fontWeight: '600', marginBottom:'0.5rem', background:'#f5f5f5', border:'1.5px dashed #003366', color:'#003366' }}
        >
          💶 Payer en espèce sur place
        </button>
        <button
          onClick={() => navigate('/reservation')}
          className="btn btn-outline"
          style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}
        >
          ← Retour au panier
        </button>
      </div>
    </div>
  );
}
