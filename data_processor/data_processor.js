const fs = require('fs');
const path = require('path');
const { pool } = require('../initializdb').default;

const EVENTS_DIR = '../server/events';


const processEventFile = async (fileName) => {
  try {
    const filePath = path.join(__dirname, EVENTS_DIR, fileName);
    const data = fs.readFileSync(filePath, 'utf8');
    const event = JSON.parse(data);

    const { userId, revenue } = event;


    const userExistsQuery = 'SELECT * FROM users_revenue WHERE user_id = $1';
    const userExistsResult = await pool.query(userExistsQuery, [userId]);

    if (userExistsResult.rowCount === 0) {
      const insertQuery = 'INSERT INTO users_revenue (user_id, revenue) VALUES ($1, $2)';
      await pool.query(insertQuery, [userId, revenue]);
      console.log(`Inserted new user ${userId} with revenue ${revenue}`);
    } else {
      const updateQuery = 'UPDATE users_revenue SET revenue = revenue + $1 WHERE user_id = $2';
      const updateResult = await pool.query(updateQuery, [revenue, userId]);

      if (updateResult.rowCount === 1) {
        console.log(`Updated revenue for user ${userId} with value ${revenue}`);
      } else {
        console.error(`Failed to update revenue for user ${userId}`);
      }
    }

  } catch (err) {
    console.error('Error processing event file:', err);
  }
};



module.exports = { processEventFile };

fs.readdir(EVENTS_DIR, (err, files) => {
  if (err) {
    console.error('Error reading events directory:', err);
    return;
  }

  files.forEach(file => processEventFile(file));
});
