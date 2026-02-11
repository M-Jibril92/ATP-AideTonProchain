const User = require('./models/User');
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    await sequelize.sync();
    
    const email = 'mohamedjibrilhachfi2@gmail.com';
    const password = 'Admin123!'; // À changer après
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ L\'utilisateur existe déjà');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur admin
    const user = await User.create({
      firstName: 'Mohamed-Jibril',
      lastName: 'Hachfi',
      email,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true
    });

    console.log('✅ Compte admin créé avec succès !');
    console.log(`📧 Email: ${email}`);
    console.log(`🔐 Mot de passe temporaire: ${password}`);
    console.log(`⚠️ N'oublie pas de changer ton mot de passe après la première connexion`);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

createAdminUser();
