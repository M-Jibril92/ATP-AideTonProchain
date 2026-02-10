const Service = require('./models/Service');
const sequelize = require('./config/database');

async function addTestService() {
  await sequelize.sync();
  const service = await Service.create({
    title: 'Test Service',
    description: 'Service de test pour commandes',
    price: 50,
    duration: '1h',
    category: 'Test',
    icon: '🧪'
  });
  console.log('Service ajouté :', service.id, service.title);
}

addTestService();
