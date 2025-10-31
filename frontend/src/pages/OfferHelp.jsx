import React, { useState } from 'react';

export default function OfferHelp() {
  const [form, setForm] = useState({
    name: '',
    skills: [],
    experience: '',
    availability: '',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const skillOptions = [
    { id: 'courses', label: '🛒 Courses & Livraison', value: 'courses' },
    { id: 'informatique', label: '💻 Informatique', value: 'informatique' },
    { id: 'animaux', label: '🐕 Garde d\'animaux', value: 'animaux' },
    { id: 'babysitting', label: '👶 Babysitting', value: 'babysitting' },
    { id: 'bricolage', label: '🔧 Bricolage', value: 'bricolage' },
    { id: 'jardinage', label: '🌱 Jardinage', value: 'jardinage' },
    { id: 'soutien', label: '📚 Soutien scolaire', value: 'soutien' },
    { id: 'menage', label: '🧹 Ménage', value: 'menage' }
  ];

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nouvelle offre de service:', form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="card" style={{ 
          maxWidth: '700px', 
          margin: '4rem auto',
          textAlign: 'center',
          padding: '3rem',
          animation: 'slideUp 0.5s ease'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
            Candidature envoyée !
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
            Merci de rejoindre notre communauté de prestataires ! Nous allons examiner votre 
            profil et vous contacter très prochainement pour finaliser votre inscription.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setSubmitted(false)}
          >
            Modifier ma candidature
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Proposer mes services</h1>
        <p className="page-subtitle">
          Rejoignez notre communauté de prestataires et aidez vos voisins
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card" style={{ animation: 'slideUp 0.5s ease' }}>
          <form onSubmit={handleSubmit}>
            {/* Nom */}
            <div className="form-group">
              <label className="label">Votre nom complet *</label>
              <input 
                className="input"
                placeholder="Jean Dupont" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </div>

            {/* Compétences */}
            <div className="form-group">
              <label className="label">Vos compétences * (sélectionnez-en au moins une)</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.75rem',
                marginTop: '0.75rem'
              }}>
                {skillOptions.map(skill => (
                  <div 
                    key={skill.id}
                    onClick={() => toggleSkill(skill.value)}
                    style={{
                      padding: '0.75rem 1rem',
                      border: `2px solid ${form.skills.includes(skill.value) ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: form.skills.includes(skill.value) ? 'var(--primary)' : 'transparent',
                      color: form.skills.includes(skill.value) ? 'white' : 'var(--text)',
                      fontWeight: form.skills.includes(skill.value) ? '600' : 'normal',
                      textAlign: 'center'
                    }}
                  >
                    {skill.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Expérience */}
            <div className="form-group">
              <label className="label">Années d'expérience *</label>
              <select 
                className="input"
                value={form.experience}
                onChange={e => setForm({...form, experience: e.target.value})}
                required
              >
                <option value="">Sélectionnez...</option>
                <option value="debutant">Débutant (moins d'1 an)</option>
                <option value="1-2">1-2 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="5+">Plus de 5 ans</option>
              </select>
            </div>

            {/* Disponibilité */}
            <div className="form-group">
              <label className="label">Disponibilité *</label>
              <select 
                className="input"
                value={form.availability}
                onChange={e => setForm({...form, availability: e.target.value})}
                required
              >
                <option value="">Sélectionnez...</option>
                <option value="weekdays">En semaine uniquement</option>
                <option value="weekends">Week-ends uniquement</option>
                <option value="flexible">Flexible (toute la semaine)</option>
                <option value="evenings">Soirées uniquement</option>
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="label">Parlez-nous de vous</label>
              <textarea 
                className="input"
                placeholder="Présentez votre parcours, vos motivations, vos qualités..."
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                rows={5}
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
            </div>

            {/* Info box */}
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '2px solid var(--secondary)',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--secondary)' }}>✅ Pourquoi devenir prestataire ?</strong><br/>
                • Gagnez un revenu complémentaire<br/>
                • Aidez votre communauté locale<br/>
                • Gérez votre emploi du temps librement<br/>
                • Développez votre réseau de voisinage
              </p>
            </div>

            <button 
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
              disabled={form.skills.length === 0}
            >
              🚀 Envoyer ma candidature
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}