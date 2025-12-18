const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// ====== MIDDLEWARES ======
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.text());

// ====== CONFIG ======
const PORT = process.env.PORT || 8000;
const DB_PATH = process.env.DB_PATH || './database.db';

// ====== DATABASE ======
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

// ====== TABLES ======
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
  )
`);

// ====== FUNCTIONS ======
async function insertRandomUsers() {
  try {
    const urls = [1, 2, 3].map(() => axios.get('https://randomuser.me/api/'));
    const results = await Promise.all(urls);
    const users = results.map(r => r.data.results[0]);

    users.forEach(u => {
      const fullName = `${u.name.first} ${u.name.last}`;
      const password = u.login.password;

      db.run(
        `INSERT INTO users (name, password) VALUES (?, ?)`,
        [fullName, password],
        (err) => {
          if (err) console.error(err.message);
        }
      );
    });

    console.log('Inserted 3 users into database.');
  } catch (err) {
    console.error('Error inserting users:', err.message);
  }
}

// ====== ROUTES ======
app.get('/populate', async (req, res) => {
  await insertRandomUsers();
  res.send('Inserted 3 users into database.');
});

app.get('/users', (req, res) => {
  db.all('SELECT id FROM users', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Database error');
    }
    res.json(rows);
  });
});

app.post('/comment', (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  db.run(
    `INSERT INTO comments (content) VALUES (?)`,
    [content],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

app.get('/comments', (req, res) => {
  db.all('SELECT * FROM comments ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Database error');
    }
    res.json(rows);
  });
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
