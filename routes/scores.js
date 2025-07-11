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

// ✅ Submit score (allows multiple entries)
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
      if (err) return res.status(500).send('Failed to submit score.');
      res.redirect('/leaderboard');
    }
  );
});

// ✅ Leaderboard showing each user's highest score per difficulty
router.get('/leaderboard', (req, res) => {
  const query = `
    SELECT u.id AS user_id, u.name, s.level, MAX(s.score) AS score
    FROM scores s
    JOIN users u ON s.user_id = u.id
    GROUP BY s.level, s.user_id
    ORDER BY s.level, score DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Failed to load leaderboard:', err);
      return res.status(500).send('Failed to load leaderboard.');
    }

    const grouped = {
      easy: [],
      medium: [],
      hard: []
    };

    results.forEach(score => {
      if (score.level === 'easy') grouped.easy.push(score);
      else if (score.level === 'medium') grouped.medium.push(score);
      else if (score.level === 'hard') grouped.hard.push(score);
    });

    res.render('leaderboard', {
      easyScores: grouped.easy,
      mediumScores: grouped.medium,
      hardScores: grouped.hard
    });
  });
});

// ✅ Show user profile
router.get('/my-profile', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect(`/user/${req.session.user.id}`);
});

// ✅ View all sessions for one user
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  const userQuery = 'SELECT id, name FROM users WHERE id = ?';
  const scoresQuery = 'SELECT id, score, level, played_at FROM scores WHERE user_id = ? ORDER BY played_at DESC';

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
        user: userResult[0],
        sessions: scoreResults
      });
    });
  });
});

// ✅ Delete score from user profile
router.post('/delete-score/:scoreId', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const scoreId = req.params.scoreId;
  const userId = req.session.user.id;

  db.query('SELECT user_id FROM scores WHERE id = ?', [scoreId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).send('Score not found');
    }

    if (result[0].user_id !== userId) {
      return res.status(403).send('Unauthorized to delete this score');
    }

    db.query('DELETE FROM scores WHERE id = ?', [scoreId], (err2) => {
      if (err2) {
        return res.status(500).send('Failed to delete score');
      }
      res.redirect(`/user/${userId}`);
    });
  });
});

module.exports = router;
