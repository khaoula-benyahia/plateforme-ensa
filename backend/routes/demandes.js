const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/verifyToken');

router.post('/', auth, async (req, res) => {
  const { type_demande, description } = req.body;
  await db.query(
    'INSERT INTO demandes (etudiant_id, type_demande, description) VALUES (?,?,?)',
    [req.user.id, type_demande, description]
  );
  res.json({ message: 'Demande soumise avec succès' });
});

router.get('/mes-demandes', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM demandes WHERE etudiant_id = ? ORDER BY date_soumission DESC',
    [req.user.id]
  );
  res.json(rows);
});

module.exports = router;