const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const EVENTS_DIR = path.join(__dirname, 'events');

if (!fs.existsSync(EVENTS_DIR)) {
  fs.mkdirSync(EVENTS_DIR);
}

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finonex',
  password: 'Dor2024!',
  port: 5432,
});
module.exports = { app, pool };

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

initializeDatabase();

const isAuthenticated = (req) => {
  return req.headers.authorization === 'secret';
};

const saveEventToFile = (event, fileName) => {
  const filePath = path.join(EVENTS_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(event));
};

app.post('/liveEvent', async (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).send('Unauthorized');
  }

  const event = req.body;
  const fileName = `${Date.now()}.json`;

  saveEventToFile(event, fileName);

  const { processEventFile } = require('../data_processor/data_processor');
  processEventFile(fileName);

  res.status(200).send('Event saved');
});

app.get('/userEvents/:userid', async (req, res) => {
  const userId = req.params.userid;

  try {
    const result = await pool.query('SELECT * FROM users_revenue WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
