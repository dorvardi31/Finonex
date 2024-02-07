const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finonex',
  password: 'Dor2024!',
  port: 5432,
});

const queryEventId = async (eventId) => {
  try {
    const result = await pool.query('SELECT * FROM users_revenue WHERE user_id = $1', [eventId]);
    return result.rows; 
  } catch (err) {
    console.error(err);
    throw err; 
  }
};

module.exports = { queryEventId, pool };
