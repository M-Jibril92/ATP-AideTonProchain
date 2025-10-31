import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const activeStyle = { fontWeight: '700', textDecoration: 'underline' };

export default function NavBar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav style={{
      display: 'flex', gap: 16, alignItems: 'center', padding: '1rem 1.5rem',
      borderBottom: '1px solid #eee', justifyContent: 'space-between'
    }}>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <h2 style={{margin:0, color:'#0b5cff'}}>Aide Ton Prochain</h2>
        <NavLink to="/" style={({isActive}) => isActive ? activeStyle : undefined}>Accueil</NavLink>
        <NavLink to="/about" style={({isActive}) => isActive ? activeStyle : undefined}>À propos</NavLink>
        <NavLink to="/tasks" style={({isActive}) => isActive ? activeStyle : undefined}>Tâches</NavLink>
        <NavLink to="/providers" style={({isActive}) => isActive ? activeStyle : undefined}>Prestataires</NavLink>
        <NavLink to="/contact" style={({isActive}) => isActive ? activeStyle : undefined}>Nous contacter</NavLink>
      </div>

      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <NavLink to="/reservation" style={({isActive}) => isActive ? activeStyle : undefined}>
          Réservation ({totalItems})
        </NavLink>

        {user ? (
          <>
            <span>Bonjour, {user.name}</span>
            <button onClick={() => { logout(); nav('/'); }} style={{padding:'6px 10px'}}>Déconnexion</button>
          </>
        ) : (
          <NavLink to="/login" style={({isActive}) => isActive ? activeStyle : undefined}>Connexion</NavLink>
        )}
      </div>
    </nav>
  );
}
