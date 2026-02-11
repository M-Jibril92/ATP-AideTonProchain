import React, { useEffect, useState } from 'react';
import { apiCall } from '../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiCall('/payments/admin/orders');
        console.log('✅ Commandes reçues:', data);
        setOrders(data.orders || []);
      } catch (err) {
        console.error('❌ Erreur:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Parser le description JSON pour extraire le timeSlot
  const getTimeSlot = (description) => {
    try {
      const parsed = JSON.parse(description);
      const items = parsed.items || [];
      if (items.length > 0 && items[0].timeSlot) {
        return items[0].timeSlot;
      }
    } catch {
      // Erreur de parsing JSON, retour N/A
    }
    return 'N/A';
  };

  // Parser le description JSON pour extraire l'adresse
  const getAddress = (description) => {
    try {
      const parsed = JSON.parse(description);
      if (parsed.address) {
        const { rue, batiment, quartier, ville } = parsed.address;
        return `${rue}${batiment ? ', ' + batiment : ''}${quartier ? ', ' + quartier : ''} ${ville}`;
      }
    } catch {
      // Erreur de parsing JSON, retour N/A
    }
    return 'N/A';
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#003366' }}>
        📋 Commandes reçues
      </h1>
      
      {loading && <p style={{ fontSize: '1.1rem' }}>⏳ Chargement des commandes...</p>}
      {error && <p style={{ color: 'red', fontSize: '1.1rem' }}>❌ {error}</p>}
      
      {!loading && !error && (
        <div style={{
          overflowX: 'auto',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.95rem'
          }}>
            <thead>
              <tr style={{
                background: '#003366',
                color: 'white',
                fontWeight: 'bold'
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '3px solid #003366' }}>📅 Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '3px solid #003366' }}>👤 Client</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '3px solid #003366' }}>📧 Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '3px solid #003366' }}>🏠 Adresse</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '3px solid #003366' }}>🕐 Créneau</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '3px solid #003366' }}>🔧 Service</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '3px solid #003366' }}>📂 Catégorie</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '3px solid #003366' }}>⏱️ Durée</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '3px solid #003366' }}>💰 Montant</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '3px solid #003366' }}>💳 Méthode</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                    Aucune commande pour le moment
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr 
                    key={order.id}
                    style={{
                      background: idx % 2 === 0 ? '#f9f9f9' : '#fff',
                      borderBottom: '1px solid #eee',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#f9f9f9' : '#fff'}
                  >
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee' }}>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee', fontWeight: 'bold' }}>
                      {order.clientName || order.userId}
                    </td>
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee', fontSize: '0.9rem' }}>
                      {order.email}
                    </td>
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee', fontSize: '0.9rem' }}>
                      {getAddress(order.description)}
                    </td>
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee', fontWeight: '500' }}>
                      {getTimeSlot(order.description)}
                    </td>
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee' }}>
                      {order.service}
                    </td>
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee', fontSize: '0.9rem' }}>
                      {order.categorie}
                    </td>
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee', fontSize: '0.9rem' }}>
                      {order.duree}
                    </td>
                    <td style={{ padding: '1rem', borderRight: '1px solid #eee', textAlign: 'center', fontWeight: 'bold', color: '#2ecc71' }}>
                      {order.amount} €
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        background: order.paymentMethod === 'CASH' ? '#fff3cd' : '#cfe2ff',
                        color: order.paymentMethod === 'CASH' ? '#d39e00' : '#0d47a1',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                      }}>
                        {order.paymentMethod === 'CASH' ? '💵 Espèce' : '💳 Stripe'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#666' }}>
            📊 <strong>{orders.length}</strong> commande{orders.length > 1 ? 's' : ''} au total
          </p>
        </div>
      )}
    </div>
  );
}
