const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Inscription étudiant
router.post('/register', async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  if (!nom || !prenom || !email || !password)
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO etudiants (nom, prenom, email, password) VALUES (?,?,?,?)',
      [nom, prenom, email, hash]
    );
    res.json({ message: 'Inscription réussie' });
  } catch {
    res.status(500).json({ error: 'Email déjà utilisé' });
  }
});

// Connexion étudiant
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM etudiants WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Email introuvable' });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign(
      { id: rows[0].id, role: 'etudiant' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { nom: rows[0].nom, prenom: rows[0].prenom } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion admin
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Admin introuvable' });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign(
      { id: rows[0].id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, admin: { nom: rows[0].nom } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;