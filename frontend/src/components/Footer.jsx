import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>À propos</h4>
          <p>
            Aide Ton Prochain est une plateforme d'entraide locale qui connecte 
            les gens qui ont besoin d'aide avec ceux qui peuvent la fournir.
          </p>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }}>
                Accueil
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/tasks" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }}>
                Tâches
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/providers" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }}>
                Prestataires
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/about" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }}>
                À propos
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Légal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }}>
                Conditions d'utilisation
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }}>
                Politique de confidentialité
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }}>
                CGU
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>
            Email: <a href="mailto:info@aidetoprochain.com" style={{ color: '#20c5d6', textDecoration: 'none' }}>
              info@aidetoprochain.com
            </a>
          </p>
          <p>Téléphone: +33 1 XX XX XX XX</p>
          <p>Adresse: France</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} Aide Ton Prochain. Tous droits réservés. | 
          Fait avec ❤️ pour la communauté
        </p>
      </div>
    </footer>
  );
}