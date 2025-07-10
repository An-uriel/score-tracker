const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// ✅ Session Setup
app.use(session({
  secret: 'secret-key', // Change this in real apps
  resave: false,
  saveUninitialized: false
}));

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// ✅ Make session user available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// ✅ Home route (renders homepage index.ejs)
app.get('/', (req, res) => {
  res.render('index');
});

// ✅ Route handlers
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/scores'));

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ App running at http://localhost:${port}`);
});
