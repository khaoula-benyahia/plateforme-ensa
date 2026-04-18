const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/verifyToken');

router.get('/demandes', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès refusé' });
  const [rows] = await db.query(`
    SELECT d.*, e.nom, e.prenom, e.email
    FROM demandes d JOIN etudiants e ON d.etudiant_id = e.id
    ORDER BY d.date_soumission DESC
  `);
  res.json(rows);
});

router.get('/stats', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès refusé' });
  const [[t]] = await db.query('SELECT COUNT(*) as n FROM demandes');
  const [[a]] = await db.query("SELECT COUNT(*) as n FROM demandes WHERE statut='en_attente'");
  const [[v]] = await db.query("SELECT COUNT(*) as n FROM demandes WHERE statut='validee'");
  const [[r]] = await db.query("SELECT COUNT(*) as n FROM demandes WHERE statut='rejetee'");
  res.json({ total: t.n, attente: a.n, validees: v.n, rejetees: r.n });
});

router.put('/demandes/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès refusé' });
  const { statut, commentaire_admin } = req.body;
  await db.query(
    'UPDATE demandes SET statut=?, commentaire_admin=?, date_traitement=NOW() WHERE id=?',
    [statut, commentaire_admin, req.params.id]
  );
  res.json({ message: 'Mise à jour réussie' });
});

module.exports = router;