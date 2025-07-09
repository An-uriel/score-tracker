const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'phpmyadmin.romangry.fr',
  user: 'fp_2_7',
  password: 'PNPhStud3nt_2_7',
  database: 'fp_2_7',
});

connection.connect((err) => {
  if (err) {
    console.error('DB error:', err);
  } else {
    console.log('✅ Connected to the database.');
  }
});

module.exports = connection;