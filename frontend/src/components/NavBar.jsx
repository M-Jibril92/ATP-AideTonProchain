import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    nav('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinkStyle = ({ isActive }) => ({
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    color: isActive ? 'white' : '#cbd5e1',
    fontWeight: isActive ? '700' : '600',
    fontSize: '0.95rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
    boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
    display: 'block',
    whiteSpace: 'nowrap'
  });

  return (
    <>
      <style>{`
        .navbar {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }
        .navbar.scrolled {
          box-shadow: 0 8px 30px rgba(0,0,0,0.7);
          border-bottom-color: rgba(99,102,241,0.2);
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .logo-icon {
          font-size: 2rem;
          transition: all 0.4s ease;
          filter: drop-shadow(0 4px 8px rgba(99,102,241,0.3));
        }
        .logo-section:hover .logo-icon { transform: scale(1.1) rotate(5deg); }
        .logo-text {
          font-size: 1.35rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .nav-links {
          display: flex;
          gap: 0.5rem;
          list-style: none;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        .nav-link:hover:not(.active) {
          background: rgba(99,102,241,0.08);
          color: #6366f1;
        }
        .nav-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .cart-badge {
          background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        .cart-badge:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.5); }
        .cart-count {
          background: white;
          color: #667eea;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 800;
          animation: ${totalItems>0?'pulse 0.5s ease':'none'};
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: #1f2937;
          border-radius: 50px;
          border: 2px solid rgba(99,102,241,0.2);
        }
        .user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: white;
          font-weight: 700;
        }
        .user-name { font-weight: 600; color: #cbd5e1; font-size: 0.9rem; }
        .btn-logout {
          padding: 0.4rem 0.8rem;
          background: linear-gradient(135deg,#ef4444 0%,#dc2626 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-logout:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239,68,68,0.4); }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: #cbd5e1;
          padding: 0.5rem;
        }
        .mobile-menu-btn:hover { color: #6366f1; transform: scale(1.1); }
        @keyframes pulse {0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes slideDown {from{opacity:0;transform:translateY(-20px);}to{opacity:1;transform:translateY(0);}}
        @media (max-width:768px) {
          .mobile-menu-btn { display:block; }
          .nav-links {
            position: fixed; top:70px; left:0; right:0;
            background:#0f172a;
            flex-direction:column;
            padding:2rem;
            max-height:calc(100vh-70px);
            overflow-y:auto;
            transform:translateX(-100%);
            transition: transform 0.3s ease;
            z-index:999;
          }
          .nav-links.open { transform:translateX(0); animation:slideDown 0.3s ease; }
          .nav-links a { width:100%; text-align:center; padding:1rem !important; }
          .nav-actions { position:fixed; bottom:0; left:0; right:0; background:#0f172a; flex-direction:column; padding:1.5rem; transform:translateY(100%); transition: transform 0.3s ease; z-index:1001; }
          .nav-actions.open { transform:translateY(0); }
          .cart-badge,.user-section{width:100%;justify-content:center;}
          .btn-logout{width:100%;}
        }
      `}</style>

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="logo-section" onClick={closeMobileMenu}>
            <span className="logo-icon">🤝</span>
            <h2 className="logo-text">Aide Ton Prochain</h2>
          </a>

          <ul className={`nav-links ${isMobileMenuOpen?'open':''}`}>
            {['/','/tasks','/providers','/about','/contact'].map((path,i)=>(
              <li key={i}>
                <NavLink to={path} style={navLinkStyle} onClick={closeMobileMenu}>
                  {['🏠 Accueil','📋 Tâches','👥 Prestataires','ℹ️ À propos','📧 Contact'][i]}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={`nav-actions ${isMobileMenuOpen?'open':''}`}>
            <NavLink to="/reservation" className="cart-badge" onClick={closeMobileMenu}>
              🛒 Panier <span className="cart-count">{totalItems}</span>
            </NavLink>

            {user ? (
  <div className="user-section">
    {/* Correction : On utilise firstName qui vient de la base de données */}
    <div className="user-avatar">
      {(user.firstName || user.email).charAt(0).toUpperCase()}
    </div>
    <span className="user-name">
      {user.firstName} {user.lastName}
    </span>
    <button onClick={handleLogout} className="btn-logout">🚪 Déconnexion</button>
  </div>
) : (
              <NavLink 
                to="/login"
                style={{
                  padding:'0.5rem 1rem', background:'linear-gradient(135deg,#10b981 0%,#059669 100%)',
                  color:'white', borderRadius:'10px', fontWeight:700, display:'flex', alignItems:'center', gap:'0.5rem'
                }}
                onClick={closeMobileMenu}
              >
                🔐 Connexion
              </NavLink>
            )}
            <NavLink 
                  to="/register"
                  style={{
                    padding:'0.5rem 1rem', 
                    background:'linear-gradient(135deg,#10b981 0%,#059669 100%)',
                    color:'white', 
                    borderRadius:'10px', 
                    fontWeight:700, 
                    display:'flex', 
                    alignItems:'center',
                    textDecoration: 'none'
                  }}
                  onClick={closeMobileMenu}
                >
                  📝 S'inscrire
                </NavLink>
          </div>

          <button className="mobile-menu-btn" onClick={()=>setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div 
          onClick={closeMobileMenu}
          style={{
            position:'fixed',
            top:'70px',
            left:0,
            right:0,
            bottom:0,
            background:'rgba(0,0,0,0.5)',
            zIndex:998
          }}
        />
      )}
    </>
  );
}
