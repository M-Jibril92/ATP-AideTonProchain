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

  // Style pour liens nav compacts Galaxy
  const navLinkStyle = ({ isActive }) => ({
    padding: '0.33rem 0.7rem',              // Plus petit
    textDecoration: 'none',
    color: isActive ? '#fff' : '#a259e4',
    fontWeight: isActive ? '700' : '500',
    fontSize: '0.89rem',                     // Police réduite
    borderRadius: '10px',
    transition: 'all 0.27s cubic-bezier(.5,0,.2,1)',
    background: isActive 
      ? 'linear-gradient(120deg,#3a0ca3 0%,#a259e4 55%,#ff6ee4 100%)'
      : 'transparent',
    boxShadow: isActive 
      ? '0 2px 8px rgba(162,89,228,0.31)' 
      : 'none',
    display: 'block',
    whiteSpace: 'nowrap',
    marginLeft: '0.17rem',
    marginRight: '0.17rem'
  });

  return (
    <>
      <style>{`
        .navbar {
          background: linear-gradient(120deg, #0b082d 0%, #141032 90%);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 18px #3a0ca366, 0 1.5px 11px #560bad33;
          position: sticky;
          top: 0;
          z-index: 1200;
          transition: all 0.31s cubic-bezier(.4,0,.2,1);
          border-bottom: 2px solid transparent;
        }
        .navbar.scrolled {
          box-shadow: 0 7px 22px #3a0ca3A0, 0 2px 17px #7ee8fa44;
          border-bottom-color: #a259e455;
        }
        .nav-container {
          max-width: 1270px;
          margin: 0 auto;
          padding: 0.63rem 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.35rem;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.67rem;
          text-decoration: none;
          transition: all 0.23s cubic-bezier(.5,0,.2,1);
        }
        .logo-icon {
          font-size: 1.85rem;
          transition: all 0.35s cubic-bezier(.5,0,.2,1);
          filter: drop-shadow(0 4px 13px #a259e488);
        }
        .logo-section:hover .logo-icon { transform: scale(1.05) rotate(5deg); }
        .logo-text {
          font-size: 1.13rem;
          font-weight: 800;
          background: linear-gradient(120deg, #a259e4 0%, #ff6ee4 80%, #7ee8fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .nav-links {
          display: flex;
          gap: 0.12rem;
          list-style: none;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        .nav-link:hover:not(.active) {
          background: rgba(162,89,228,0.11);
          color: #ff6ee4;
        }
        .nav-actions {
          display: flex;
          gap: 0.52rem;
          align-items: center;
        }
        .cart-badge {
          background: linear-gradient(120deg,#3a0ca3 0%,#ff6ee4 95%,#7ee8fa 100%);
          color: #fff;
          padding: 0.38rem 0.75rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 3px 9px #a259e488;
          display: flex;
          align-items: center;
          gap: 0.42rem;
          transition: all 0.25s cubic-bezier(.4,0,.2,1);
          border: 1px solid #560bad33;
        }
        .cart-badge:hover {
          transform: scale(1.04); 
          box-shadow: 0 8px 15px #a259e4aa;
          background: linear-gradient(120deg,#ff6ee4 0%,#a259e4 85%,#7ee8fa 100%);
        }
        .cart-count {
          background: #ff6ee4;
          color: #3a0ca3;
          border-radius: 50%;
          width: 19px;
          height: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.74rem;
          font-weight: 800;
          animation: ${totalItems>0?'pulse 0.4s ease':'none'};
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 0.59rem;
          padding: 0.37rem 0.72rem;
          background: #231942CC;
          border-radius: 30px;
          border: 1px solid #a259e488;
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(120deg,#a259e4 20%,#ff6ee4 80%,#7ee8fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.83rem;
          color: #231942;
          font-weight: 600;
          box-shadow: 0 1.5px 6px #7ee8fa44;
        }
        .user-name { font-weight: 600; color: #d0b3f7; font-size: 0.83rem; }
        .btn-logout {
          padding: 0.29rem 0.5rem;
          background: linear-gradient(120deg,#ee4266 0%,#ff6ee4 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.78rem;
          transition: all 0.24s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 1px 6px #ff6ee488;
        }
        .btn-logout:hover {
          transform: scale(1.05); 
          box-shadow: 0 4px 11px #ee4266aa;
          background: linear-gradient(90deg,#ee4266 0%,#a259e4 100%);
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.47rem;
          cursor: pointer;
          color: #d0b3f7;
          padding: 0.4rem;
        }
        .mobile-menu-btn:hover { color: #ff6ee4; transform: scale(1.06);}
        @keyframes pulse {0%,100%{transform:scale(1);}50%{transform:scale(1.14);}}
        @keyframes slideDown {from{opacity:0;transform:translateY(-17px);}to{opacity:1;transform:translateY(0);}}
        @media (max-width:768px) {
          .mobile-menu-btn { display:block; }
          .nav-links {
            position: fixed; top:60px; left:0; right:0;
            background:#0b082df5;
            flex-direction:column;
            padding:1.47rem 0.4rem;
            max-height:calc(100vh-60px);
            overflow-y:auto;
            transform:translateX(-100%);
            transition: transform 0.28s cubic-bezier(.4,0,.2,1);
            z-index:1100;
          }
          .nav-links.open { 
            transform:translateX(0); 
            animation:slideDown 0.27s cubic-bezier(.4,0,.2,1);
            box-shadow:0 4px 22px #3a0ca3dd;
          }
          .nav-links a { width:100%; text-align:center; padding:0.82rem !important; font-size:0.99rem !important;}
          .nav-actions { 
            position:fixed; bottom:0; left:0; right:0; 
            background:#141032f3; flex-direction:column; 
            padding:1.12rem; transform:translateY(100%); 
            transition: transform 0.28s cubic-bezier(.4,0,.2,1); 
            z-index:1102;
            box-shadow: 0 -2px 25px #a259e4bb;
          }
          .nav-actions.open { transform:translateY(0); }
          .cart-badge,.user-section{width:100%;justify-content:center;}
          .btn-logout{width:100%;}
        }
      `}</style>

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo compact : nom et emoji d'origine */}
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
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn-logout">🚪 Déconnexion</button>
              </div>
            ) : (
              <NavLink 
                to="/login"
                style={{
                  padding:'0.38rem 0.8rem',
                  background:'linear-gradient(120deg,#7ee8fa 0%, #a259e4 95%, #ff6ee4 100%)',
                  color:'#231942', borderRadius:'10px',
                  fontWeight:600, fontSize:'0.85rem', display:'flex',
                  alignItems:'center', gap:'0.32rem'
                }}
                onClick={closeMobileMenu}
              >
                🔐 Connexion
              </NavLink>
            )}
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
            top:'60px',
            left:0,
            right:0,
            bottom:0,
            background:'rgba(34,18,60,0.39)',
            zIndex:1098
          }}
        />
      )}
    </>
  );
}