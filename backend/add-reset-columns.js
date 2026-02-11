const sequelize = require('./config/database');

async function ensureResetColumns() {
  try {
    await sequelize.authenticate();

    const [columns] = await sequelize.query("PRAGMA table_info('Users');");
    const columnNames = new Set(columns.map((col) => col.name));

    if (!columnNames.has('resetToken')) {
      await sequelize.query("ALTER TABLE Users ADD COLUMN resetToken VARCHAR(255);");
      console.log('✅ Colonne resetToken ajoutée');
    } else {
      console.log('ℹ️ Colonne resetToken déjà présente');
    }

    if (!columnNames.has('resetTokenExpires')) {
      await sequelize.query("ALTER TABLE Users ADD COLUMN resetTokenExpires DATETIME;");
      console.log('✅ Colonne resetTokenExpires ajoutée');
    } else {
      console.log('ℹ️ Colonne resetTokenExpires déjà présente');
    }
  } catch (error) {
    console.error('❌ Erreur migration resetToken:', error);
  } finally {
    await sequelize.close();
  }
}

ensureResetColumns();
