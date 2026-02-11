const Service = require('./models/Service');
const sequelize = require('./config/database');

const defaultServices = [
  {
    title: 'Babysitting',
    description: 'Garde d’enfants à domicile, ponctuelle ou régulière.',
    price: 10,
    duration: '2h',
    category: 'Famille',
    icon: '🧸'
  },
  {
    title: 'Bricolage',
    description: 'Petits travaux, montage de meubles, réparations diverses.',
    price: 12,
    duration: '1h',
    category: 'Maison',
    icon: '🔨'
  },
  {
    title: 'Courses',
    description: 'Aide pour faire les courses ou livrer à domicile.',
    price: 6,
    duration: '1h',
    category: 'Vie quotidienne',
    icon: '🛒'
  },
  {
    title: 'Jardinage',
    description: 'Entretien du jardin, tonte, arrosage, plantations.',
    price: 10,
    duration: '1h',
    category: 'Extérieur',
    icon: '🌱'
  },
  {
    title: 'Soutien scolaire',
    description: 'Aide aux devoirs, cours particuliers, remise à niveau.',
    price: 9,
    duration: '1h',
    category: 'Éducation',
    icon: '📚'
  },
  {
    title: 'Aide informatique',
    description: 'Installation, dépannage, initiation à l’informatique.',
    price: 11,
    duration: '1h',
    category: 'Numérique',
    icon: '💻'
  },
  {
    title: 'Déménagement',
    description: 'Aide pour porter, transporter, organiser un déménagement.',
    price: 14,
    duration: '3h',
    category: 'Logistique',
    icon: '🚚'
  },
  {
    title: 'Promenade de chien',
    description: 'Sortie et promenade de chien, courte ou longue.',
    price: 6,
    duration: '45m',
    category: 'Animaux',
    icon: '🐶'
  },
  {
    title: 'Aide au ménage léger',
    description: 'Rangement, dépoussiérage, vaisselle, sans matériel pro.',
    price: 8,
    duration: '1h',
    category: 'Maison',
    icon: '🧽'
  },
  {
    title: 'Garde d’animaux',
    description: 'Passage à domicile pour nourrir et surveiller un animal.',
    price: 7,
    duration: '30m',
    category: 'Animaux',
    icon: '🐾'
  },
  {
    title: 'Aide à l’organisation',
    description: 'Tri, rangement, organisation d’un espace.',
    price: 8,
    duration: '1h',
    category: 'Maison',
    icon: '📦'
  },
  {
    title: 'Accompagnement courses',
    description: 'Accompagner une personne pour ses courses en ville.',
    price: 6,
    duration: '1h',
    category: 'Vie quotidienne',
    icon: '🧺'
  },
  {
    title: 'Petits transports',
    description: 'Porter un colis léger, dépôt au point relais.',
    price: 5,
    duration: '30m',
    category: 'Logistique',
    icon: '📦'
  },
  {
    title: 'Montage simple',
    description: 'Montage de petites étagères ou meubles légers.',
    price: 10,
    duration: '1h',
    category: 'Maison',
    icon: '🪛'
  },
  {
    title: 'Aide aux papiers',
    description: 'Tri et aide basique pour formulaires non sensibles.',
    price: 7,
    duration: '45m',
    category: 'Administratif',
    icon: '📝'
  },
  {
    title: 'Initiation smartphone',
    description: 'Aide pour réglages, applis, usages de base.',
    price: 7,
    duration: '45m',
    category: 'Numérique',
    icon: '📱'
  },
  {
    title: 'Accompagnement médical',
    description: 'Accompagner à un rendez-vous médical ou chez le docteur.',
    price: 12,
    duration: '2h',
    category: 'Santé',
    icon: '🏥'
  },
  {
    title: 'Rendez-vous médicaux',
    description: 'Aide pour prendre rendez-vous, préparation dossiers médicaux.',
    price: 8,
    duration: '1h',
    category: 'Santé',
    icon: '📋'
  },
  {
    title: 'Aide aux personnes âgées',
    description: 'Compagnie, aide quotidienne, sorties adaptées.',
    price: 9,
    duration: '2h',
    category: 'Aide sociale',
    icon: '👴'
  },
  {
    title: 'Aide administrative',
    description: 'Aide pour remplir formulaires, démarches en ligne.',
    price: 8,
    duration: '1h',
    category: 'Administratif',
    icon: '📑'
  },
  {
    title: 'Nettoyage intérieur',
    description: 'Nettoyage complet d\'une pièce ou d\'un logement.',
    price: 14,
    duration: '2h',
    category: 'Maison',
    icon: '🧹'
  },
  {
    title: 'Repassage',
    description: 'Repassage de vêtements, draps ou linge de maison.',
    price: 8,
    duration: '1h',
    category: 'Maison',
    icon: '👔'
  },
  {
    title: 'Création réseau sociaux',
    description: 'Aide pour créer profil, poster contenus, gérer présence en ligne.',
    price: 15,
    duration: '1h',
    category: 'Numérique',
    icon: '📲'
  },
  {
    title: 'Aide à la candidature',
    description: 'Aide pour CV, lettre de motivation, préparation entretien.',
    price: 10,
    duration: '1h',
    category: 'Emploi',
    icon: '💼'
  },
  {
    title: 'Soutien aux devoirs étudiants',
    description: 'Aide pour projets, coursework, dissertations universitaires.',
    price: 12,
    duration: '1h30',
    category: 'Éducation',
    icon: '🎓'
  },
  {
    title: 'Aide déménagement léger',
    description: 'Aide pour petit déménagement, cartons, tri partiel.',
    price: 9,
    duration: '2h',
    category: 'Logistique',
    icon: '📦'
  }
];

async function restoreDefaultServices() {
  await sequelize.sync();
  await Service.destroy({ where: {} }); // Vide la table
  for (const s of defaultServices) {
    await Service.create(s);
  }
  console.log('Services par défaut restaurés.');
}

restoreDefaultServices();
