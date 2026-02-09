import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';

export default function Payment() {
  const { user } = useAuth();
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [processing, setProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0).toFixed(2);

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

  // Stripe Checkout flow
  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setProcessing(true);

      // Ask backend to create a Checkout session
      const host = window.location.origin;
      const session = await paymentsAPI.createCheckoutSession({
        items: items.map(i => ({ id: i.id, title: i.title, quantity: i.qty, amount: i.price })) ,
        successUrl: `${host}/payment-success`,
        cancelUrl: `${host}/payment-cancel`
      });

      // If backend returned a full URL, redirect there
      if (session.url) {
        window.location.href = session.url;
        return;
      }

      // Otherwise expect { id } and redirect using Stripe.js
      const stripePk = import.meta.env.VITE_STRIPE_PK;
      if (!stripePk) throw new Error('VITE_STRIPE_PK non défini dans .env');
      const stripe = await loadStripe(stripePk);
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) setError(result.error.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Fallback: server-side record creation (existing behavior)
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setProcessing(true);

      for (const item of items) {
        await paymentsAPI.create({
          serviceId: item.id,
          amount: (item.price || 0) * item.qty,
          paymentMethod,
          description: item.title,
          quantity: item.qty
        });
      }

      clear();
      alert('✅ Paiement enregistré (mode démo).');
      navigate('/reservation');
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Finaliser le paiement</h1>
        <p className="page-subtitle">
          Confirmez votre commande et choisissez votre méthode de paiement
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Récapitulatif */}
        <div className="card" style={{ animation: 'slideUp 0.3s ease' }}>
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
                    ${(item.price * item.qty).toFixed(2)}
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
                ${total}
              </span>
            </div>
          </div>
        </div>

        {/* Formulaire de paiement */}
        <div className="card" style={{ animation: 'slideUp 0.4s ease' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>💳 Méthode de paiement</h2>
          
          <form onSubmit={paymentMethod === 'CARD' ? handleStripeCheckout : handlePayment} style={{ display: 'grid', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>
                Choisissez votre méthode:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                <option value="CARD">💳 Carte Bancaire</option>
                <option value="PAYPAL">🅿️ PayPal</option>
                <option value="TRANSFER">🏦 Virement Bancaire</option>
                <option value="CASH">💵 Paiement à la Livraison</option>
              </select>
            </div>

            {error && (
              <div style={{ 
                padding: '1rem',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '8px',
                border: '1px solid #fcc'
              }}>
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="btn btn-primary"
              style={{ 
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                opacity: processing ? 0.6 : 1,
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              {processing ? '⏳ Traitement...' : (paymentMethod === 'CARD' ? `🔒 Payer par carte ${total}€` : `🔒 Payer ${total}€`)}
            </button>

            <button
              type="button"
              onClick={() => navigate('/reservation')}
              className="btn btn-outline"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              ← Retour au panier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
