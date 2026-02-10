const User = require('./models/User');
const sequelize = require('./config/database');

async function setAdmin(email) {
  await sequelize.sync();
  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log('Utilisateur non trouvé');
    return;
  }
  user.role = 'ADMIN';
  await user.save();
  console.log('Utilisateur', email, 'est maintenant ADMIN');
}

// Remplace par l'email de ton compte à promouvoir
setAdmin('mohamedjibrilhachfi2@gmail.com');
