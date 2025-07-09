const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// ✅ Show registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// ✅ Handle registration
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err) => {
      if (err) {
        console.error('❌ Registration error:', err);
        return res.status(500).send('Registration failed.');
      }
      res.redirect('/login');
    }
  );
});

// ✅ Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// ✅ Handle login + redirect to homepage
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send('Login failed. Incorrect email or password.');
    }

    // Save user to session
    req.session.user = {
      id: results[0].id,
      name: results[0].name
    };

    // ✅ Redirect to homepage after login
    res.redirect('/');
  });
});

// ✅ Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
