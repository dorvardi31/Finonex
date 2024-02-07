require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initializeDatabase = async () => {
  try {
    console.log('Attempting to connect to the database...');
    const client = await pool.connect();
    console.log('Connected to the database.');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users_revenue (
        user_id VARCHAR(255) PRIMARY KEY,
        revenue NUMERIC
      );
    `);
    client.release();
    console.log('Database initialized.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = { initializeDatabase, pool };
