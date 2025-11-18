require('dotenv').config();
const app = require('./app');
const { pool } = require('./db');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await pool.query('SELECT 1');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (e) {
    console.error('DB connection failed:', e);
    process.exit(1);
  }
})();
