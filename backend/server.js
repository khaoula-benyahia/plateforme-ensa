const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/demandes', require('./routes/demandes'));
app.use('/api/admin', require('./routes/admin'));

app.get('/setup-admin', async (req, res) => {
  const bcrypt = require('bcryptjs');
  const db = require('./db');
  const hash = await bcrypt.hash('admin123', 10);
  await db.query(
    "INSERT IGNORE INTO admins (nom, email, password) VALUES (?,?,?)",
    ['Administrateur ENSA', 'admin@ensa.ma', hash]
  );
  res.json({ message: 'Admin créé ! Email: admin@ensa.ma / Pass: admin123' });
});

app.listen(process.env.PORT || 8080, () => {
  console.log('✅ Serveur démarré sur le port 5000');
});
process.on('uncaughtException', (err) => {
    console.error('Erreur non capturée :', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesse rejetée sans `.catch()` :', reason);
});