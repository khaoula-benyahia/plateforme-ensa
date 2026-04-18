const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'plateforme_ensa',
  waitForConnections: true,
  connectionLimit: 10,
});

// Test de connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur MySQL:', err.message);
  } else {
    console.log('✅ MySQL connecté !');
    connection.release();
  }
});

module.exports = pool.promise();