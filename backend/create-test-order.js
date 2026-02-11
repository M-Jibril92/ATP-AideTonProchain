const sequelize = require('./config/database');
const User = require('./models/User');
const Payment = require('./models/Payment');
const bcrypt = require('bcryptjs');

async function createTestOrder() {
  try {
    // Chercher l'utilisateur kyubi92601 (devrait exister)
    let testUser = await User.findOne({ where: { email: 'kyubi92601@gmail.com' } });
    
    if (!testUser) {
      // Si n'existe pas, créer un nouveau
      testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'kyubi92601@gmail.com',
        password: await bcrypt.hash('Test123456', 12),
        role: 'CLIENT',
        emailVerified: true
      });
    }

    console.log(`✅ Utilisateur trouvé/créé: ${testUser.email} (ID: ${testUser.id})`);

    // Créer une commande de test (Aide au ménage)
    const payment = await Payment.create({
      userId: testUser.id,
      serviceId: 1, // Babysitting
      amount: 30,
      quantity: 1,
      paymentMethod: 'CASH',
      status: 'PENDING',
      description: JSON.stringify({
        title: 'Aide au ménage',
        address: {
          rue: '454',
          ville: '22131',
          batiment: '3515351',
          quartier: ''
        },
        items: [
          {
            id: 1,
            title: 'Aide au ménage',
            description: 'Service de nettoyage professionnel',
            category: 'Ménage',
            price: 30,
            duration: '2h',
            icon: '🧹',
            qty: 1
          }
        ]
      }),
      transactionId: `ORDER-${Date.now()}-TEST`
    });

    console.log(`✅ Commande créée: ID ${payment.id} pour ${testUser.email}`);
    console.log('   Montant: 30€');
    console.log('   Service: Aide au ménage');
    console.log('   Statut: PENDING');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createTestOrder();
