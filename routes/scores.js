const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// ✅ Show the form to submit score
router.get('/submit-score', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('submit_score', { user: req.session.user });
});


// This handles the actual submission (POST)
router.post('/submit-score', (req, res) => {
  if (!req.session.user) {
    return res.status(403).send('Unauthorized');
  }

  const { score, level } = req.body;
  const user_id = req.session.user.id;

  db.query(
    'INSERT INTO scores (user_id, score, level) VALUES (?, ?, ?)',
    [user_id, score, level],
    (err) => {
      if (err) return res.status(500).send('Score submission failed.');
      res.redirect('/leaderboard');
    }
  );
});



// ✅ Leaderboard (Top Scores)
router.get('/leaderboard', (req, res) => {
  db.query(
    `
    SELECT u.id as user_id, u.name, s.score, s.level, s.played_at 
    FROM scores s 
    JOIN users u ON s.user_id = u.id 
    ORDER BY s.score DESC
    `,
    (err, results) => {
      if (err) {
        console.error('❌ Failed to load leaderboard:', err);
        return res.status(500).send('Failed to load leaderboard.');
      }
      res.render('leaderboard', { scores: results });
    }
  );
});

router.get('/my-profile', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect(`/user/${req.session.user.id}`);
});

// ✅ View all sessions by one user
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  // Get user info + their scores
  const userQuery = 'SELECT id, name FROM users WHERE id = ?';
  const scoresQuery = 'SELECT score, level, played_at FROM scores WHERE user_id = ? ORDER BY played_at DESC';

  db.query(userQuery, [userId], (err, userResult) => {
    if (err || userResult.length === 0) {
      console.error('❌ Failed to get user info:', err);
      return res.status(404).send('User not found');
    }

    db.query(scoresQuery, [userId], (err2, scoreResults) => {
      if (err2) {
        console.error('❌ Failed to get scores:', err2);
        return res.status(500).send('Could not load scores');
      }

      res.render('user_profile', {
        user: userResult[0], // { id, name }
        sessions: scoreResults
      });
    });
  });
});



module.exports = router;
