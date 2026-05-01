const router = require('express').Router();
const Birthday = require('../models/Birthday');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const all = await Birthday.find({ active: true }).sort({ createdAt: -1 });
  // Retourne ceux sans date (permanents) ou dont la date = aujourd'hui
  const filtered = all.filter(b => !b.date || b.date === today);
  res.json(filtered);
});

router.get('/all', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  const all = await Birthday.find().sort({ createdAt: -1 });
  res.json(all);
});

router.post('/', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  try {
    const b = await Birthday.create(req.body);
    res.status(201).json(b);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/:id', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  const b = await Birthday.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!b) return res.status(404).json({ error: 'Introuvable' });
  res.json(b);
});

router.delete('/:id', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  await Birthday.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
