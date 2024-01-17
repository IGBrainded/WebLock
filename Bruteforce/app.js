const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/bruteforce', (req, res) => {
  const { username, password } = req.body;

  // Dummy credentials for demonstration purposes
  const correctUsername = 'admin';
  const correctPassword = 'password123';

  // Check if the provided credentials match the correct ones
  if (username === correctUsername && password === correctPassword) {
    res.send('Login successful!');
  } else {
    res.send('Login failed. Incorrect username or password.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
