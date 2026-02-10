import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import logoATP from '../assets/logo-atp.png';

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
    padding: '0.65rem 1.35rem',
    textDecoration: 'none',
    color: isActive ? 'white' : '#7f8c8d',
    fontWeight: isActive ? '700' : '600',
    fontSize: '0.95rem',
    borderRadius: '14px',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    background: isActive ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)' : 'transparent',
    boxShadow: isActive ? '0 6px 16px rgba(30, 58, 95, 0.2)' : 'none',
    display: 'block',
    whiteSpace: 'nowrap',
    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
  });

  return (
    <>
      <style>{`
        .navbar {
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(31, 58, 95, 0.06);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-bottom: 1px solid #e0e4e8;
          backdrop-filter: blur(10px);
        }
        .navbar.scrolled {
          box-shadow: 0 8px 20px rgba(31, 58, 95, 0.1);
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logo-icon {
          height: 55px;
          width: auto;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 3px 6px rgba(31, 58, 95, 0.1));
        }
        .logo-section:hover .logo-icon { 
          transform: scale(1.1) rotate(3deg); 
          filter: drop-shadow(0 6px 12px rgba(0, 168, 181, 0.2)); 
        }
        .logo-text {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e3a5f;
          letter-spacing: -0.01em;
          margin: 0;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logo-section:hover .logo-text {
          letter-spacing: 0.03em;
        }
        .nav-links {
          display: flex;
          gap: 0.5rem;
          list-style: none;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          color: #7f8c8d;
        }
        .nav-link:hover:not(.active) {
          background: rgba(30, 58, 95, 0.08);
          color: #1e3a5f;
          transform: translateY(-2px);
        }
        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .cart-badge {
          background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%);
          color: white;
          padding: 0.65rem 1.3rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 6px 16px rgba(30, 58, 95, 0.15);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cart-badge:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(30, 58, 95, 0.25);
        }
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .cart-badge:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(30, 58, 95, 0.3); }
        .cart-count {
          background: white;
          color: #1e3a5f;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          animation: ${totalItems>0?'pulse 0.5s ease':'none'};
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          border: 1px solid #e0e4e8;
        }
        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: white;
          font-weight: 700;
          flex-shrink: 0;
        }
        .user-name { 
          font-weight: 500; 
          color: #2c3e50; 
          font-size: 0.65rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60px;
        }
        .btn-logout {
          padding: 0.25rem 0.5rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
                  🛒 Panier <span className="cart-count">{totalItems}</span>
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .btn-logout:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: #7f8c8d;
          padding: 0.5rem;
        }
        .mobile-menu-btn:hover { color: #1e3a5f; transform: scale(1.1); }
        @keyframes pulse {0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes slideDown {from{opacity:0;transform:translateY(-20px);}to{opacity:1;transform:translateY(0);}}
        @media (max-width:768px) {
          .mobile-menu-btn { display:block; }
          .nav-links {
            position: fixed; top:70px; left:0; right:0;
            background:#ffffff;
            flex-direction:column;
            padding:2rem;
            max-height:calc(100vh-70px);
            overflow-y:auto;
            transform:translateX(-100%);
            transition: transform 0.3s ease;
            z-index:999;
            box-shadow: 0 8px 30px rgba(31, 58, 95, 0.15);
          }
          .nav-links.open { transform:translateX(0); animation:slideDown 0.3s ease; }
          .nav-links a { width:100%; text-align:center; padding:1rem !important; color: #7f8c8d !important; }
          .nav-actions { position:fixed; bottom:0; left:0; right:0; background:#ffffff; flex-direction:column; padding:1.5rem; transform:translateY(100%); transition: transform 0.3s ease; z-index:1001; box-shadow: 0 -4px 12px rgba(31, 58, 95, 0.1); }
          .nav-actions.open { transform:translateY(0); }
          .cart-badge,.user-section{width:100%;justify-content:center;}
          .btn-logout{width:100%;}
        }
      `}</style>

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="logo-section" onClick={closeMobileMenu}>
            <img src={logoATP} alt="Logo ATP" className="logo-icon" />
            <span className="logo-text">A.T.P</span>
          </a>

          <ul className={`nav-links ${isMobileMenuOpen?'open':''}`}>
            {/* Liens publics */}
            {['/','/tasks','/providers','/about','/contact'].map((path,i)=>(
              <li key={i}>
                <NavLink to={path} style={navLinkStyle} onClick={closeMobileMenu}>
                  {['🏠 Accueil','📋 Tâches','👥 Prestataires','ℹ️ À propos','📧 Contact'][i]}
                </NavLink>
              </li>
            ))}
            {/* Lien admin visible uniquement pour ADMIN */}
            {user && user.role === 'ADMIN' && (
              <li>
                <NavLink to="/admin/orders" style={navLinkStyle} onClick={closeMobileMenu}>
                  🛠️ Admin
                </NavLink>
              </li>
            )}
          </ul>

          <div className={`nav-actions ${isMobileMenuOpen?'open':''}`}>
            <NavLink to="/reservation" className="cart-badge" onClick={closeMobileMenu}>
              🛒 Panier <span className="cart-count">{totalItems}</span>
            </NavLink>

            {user ? (
  <div className="user-section">
    <div className="user-avatar">
      {(user.firstName || user.email).charAt(0).toUpperCase()}
    </div>
    <span className="user-name">
      {user.firstName}
    </span>
    <button onClick={handleLogout} className="btn-logout">🚪</button>
  </div>
) : (
                <NavLink 
                  to="/login"
                  style={{
                    padding:'0.35rem 0.9rem',
                    background:'#003366',
                    color:'white',
                    borderRadius:'6px',
                    fontWeight:600,
                        fontSize:'0.74rem',
                        border:'0.5px solid #b6d4e7',
                    boxShadow:'0 2px 8px #b6d4e7',
                    display:'flex', alignItems:'center', gap:'0.5rem',
                    transition:'all 0.3s',
                  }}
                  onClick={closeMobileMenu}
                >
                  🔐 Connexion
                </NavLink>
            )}
            {!user && (
              <NavLink 
                to="/register"
                style={{
                  padding:'0.35rem 0.9rem',
                  background:'#003366',
                  color:'white',
                  borderRadius:'6px',
                  fontWeight:600,
                  fontSize:'0.74rem',
                  border:'0.5px solid #b6d4e7',
                  boxShadow:'0 2px 8px #b6d4e7',
                  display:'flex', alignItems:'center', gap:'0.5rem',
                  transition:'all 0.3s',
                }}
                onClick={closeMobileMenu}
              >
                📝 Inscription
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
            top:'70px',
            left:0,
            right:0,
            bottom:0,
            background:'rgba(0,0,0,0.5)',
            zIndex:998
          }}
        ></div>
      )}
    </>
  );
}
