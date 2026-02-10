const Service = require('./models/Service');
const sequelize = require('./config/database');

const defaultServices = [
  {
    title: 'Babysitting',
    description: 'Garde d’enfants à domicile, ponctuelle ou régulière.',
    price: 15,
    duration: '2h',
    category: 'Famille',
    icon: '🧸'
  },
  {
    title: 'Bricolage',
    description: 'Petits travaux, montage de meubles, réparations diverses.',
    price: 25,
    duration: '1h',
    category: 'Maison',
    icon: '🔨'
  },
  {
    title: 'Courses',
    description: 'Aide pour faire les courses ou livrer à domicile.',
    price: 10,
    duration: '1h',
    category: 'Vie quotidienne',
    icon: '🛒'
  },
  {
    title: 'Jardinage',
    description: 'Entretien du jardin, tonte, arrosage, plantations.',
    price: 20,
    duration: '1h',
    category: 'Extérieur',
    icon: '🌱'
  },
  {
    title: 'Soutien scolaire',
    description: 'Aide aux devoirs, cours particuliers, remise à niveau.',
    price: 18,
    duration: '1h',
    category: 'Éducation',
    icon: '📚'
  },
  {
    title: 'Aide informatique',
    description: 'Installation, dépannage, initiation à l’informatique.',
    price: 22,
    duration: '1h',
    category: 'Numérique',
    icon: '💻'
  },
  {
    title: 'Déménagement',
    description: 'Aide pour porter, transporter, organiser un déménagement.',
    price: 30,
    duration: '3h',
    category: 'Logistique',
    icon: '🚚'
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
