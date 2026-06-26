const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});
(async () => {
  try {
    const res = await pool.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name IN ('cba_torneos', 'cba_usuarios', 'cba_equipos', 'cba_partidas', 'cba_torneo_equipo', 'cba_roles') ORDER BY table_name, ordinal_position");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
