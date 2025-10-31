import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <header style={{marginBottom:20}}>
        <h1 style={{fontSize:28}}>Bienvenue sur Aide Ton Prochain</h1>
        <p>Plateforme d'entraide locale : trouvez des missions, réservez un prestataire, aidez votre voisin.</p>
      </header>

      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div style={{padding:16, border:'1px solid #eee', borderRadius:8}}>
          <h3>Besoin d'aide ?</h3>
          <p>Publiez une mission ou choisissez parmi les missions disponibles.</p>
          <Link to="/tasks">Voir les tâches</Link>
        </div>

        <div style={{padding:16, border:'1px solid #eee', borderRadius:8}}>
          <h3>Vous êtes prestataire ?</h3>
          <p>Inscrivez-vous pour proposer vos services et gagner de l'argent.</p>
          <Link to="/providers">Nos prestataires</Link>
        </div>
      </section>
    </div>
  );
}
