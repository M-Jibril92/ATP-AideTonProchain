import React, { useEffect, useState } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/orders', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des commandes');
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container" style={{maxWidth:900, margin:'2rem auto'}}>
      <h1>Commandes reçues</h1>
      {loading && <p>Chargement...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && !error && (
        <table style={{width:'100%', borderCollapse:'collapse', marginTop:'2rem'}}>
          <thead>
            <tr style={{background:'#f5f7fa'}}>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Date</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Client</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Email</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Ville</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Service</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Catégorie</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Durée</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Montant</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Méthode</th>
              <th style={{padding:'0.7rem', border:'1px solid #eee'}}>Détail</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{new Date(order.createdAt).toLocaleString()}</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{order.clientName || order.userId}</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{order.email}</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{order.ville}</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{order.service}</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{order.categorie}</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{order.duree}</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{order.amount} €</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}>{order.paymentMethod}</td>
                <td style={{padding:'0.7rem', border:'1px solid #eee'}}><pre style={{fontSize:'0.9em', whiteSpace:'pre-wrap'}}>{order.description}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
