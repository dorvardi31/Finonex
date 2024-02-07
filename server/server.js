const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { pool } = require('../initializdb');
const { initializeDatabase } = require('../initializdb');
const app = express();
require('dotenv').config();
app.use(bodyParser.json());


const EVENTS_DIR = path.join(__dirname, 'events');

if (!fs.existsSync(EVENTS_DIR)) {
  fs.mkdirSync(EVENTS_DIR);
}


module.exports = { app };

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
  const { queryEventId } = require('../client');
  try {
    const revenueData = await queryEventId(userId);
    res.status(200).json(revenueData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
  
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
