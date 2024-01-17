const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Create and connect to the SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// SQL injection vulnerable login endpoint
app.route('/sql-injection')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, 'SQLi', 'SQLi.html'));
  })
  .post((req, res) => {
    const { username, password } = req.body;

    // WARNING: This is vulnerable to SQL injection for educational purposes.
    // Use parameterized queries or prepared statements in production.
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

    console.log('SQL Query:', query); // Log the generated SQL query for debugging

    db.all(query, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      console.log('Query Result:', rows); // Log the query result for debugging

      if (rows.length > 0) {
        res.send('Login successful!');
      } else {
        res.send('Login failed. Incorrect username or password.');
      }
    });
  });


// Route to check existing users in the database
app.get('/check-users', (req, res) => {
  const query = 'SELECT * FROM users';

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ users: rows });
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to WebLock!');
});

// Create the 'users' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    age INTEGER
  )
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err.message);
  } else {
    console.log('Users table created successfully.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
