const router = require('express').Router();
const FutsalSession = require('../models/FutsalSession');
const auth = require('../middleware/auth');

// Public — créer une session depuis QR code
router.post('/', async (req, res) => {
  try {
    const { terrain, responsible, players } = req.body;
    if (!terrain || !responsible?.trim()) return res.status(400).json({ error: 'Terrain et responsable requis' });
    if (!Array.isArray(players) || players.length < 10) return res.status(400).json({ error: 'Minimum 10 joueurs requis' });
    const cleanPlayers = players.map(p => ({ name: p.trim() })).filter(p => p.name);
    if (cleanPlayers.length < 10) return res.status(400).json({ error: 'Minimum 10 noms valides requis' });
    const session = await FutsalSession.create({ terrain, responsible: responsible.trim(), players: cleanPlayers });
    // Notify admin via socket (io accessible via req.app)
    req.app.get('io')?.emit('futsal:session:new', session);
    res.status(201).json({ ok: true, id: session._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Admin — lister toutes les sessions
router.get('/', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  const sessions = await FutsalSession.find().sort({ createdAt: -1 });
  res.json(sessions);
});

// Admin — marquer un joueur payé/non payé
router.patch('/:id/players/:playerIdx', auth(['ADMIN', 'BAR']), async (req, res) => {
  const session = await FutsalSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session introuvable' });
  const idx = parseInt(req.params.playerIdx);
  if (idx < 0 || idx >= session.players.length) return res.status(400).json({ error: 'Joueur introuvable' });
  session.players[idx].paid = !session.players[idx].paid;
  await session.save();
  req.app.get('io')?.emit('futsal:session:update', session);
  res.json(session);
});

// Admin — fermer/rouvrir une session
router.patch('/:id/close', auth(['ADMIN', 'BAR']), async (req, res) => {
  const session = await FutsalSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session introuvable' });
  session.closed = !session.closed;
  await session.save();
  req.app.get('io')?.emit('futsal:session:update', session);
  res.json(session);
});

// Admin — supprimer une session
router.delete('/:id', auth(['ADMIN', 'BAR']), async (req, res) => {
  await FutsalSession.findByIdAndDelete(req.params.id);
  req.app.get('io')?.emit('futsal:session:delete', { id: req.params.id });
  res.json({ ok: true });
});

module.exports = router;
