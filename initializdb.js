const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finonex',
  password: 'Dor2024!',
  port: 5432,
});

const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
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

module.exports = { initializeDatabase };
