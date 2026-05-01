const router = require('express').Router();
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const filter = req.query.all === '1' ? {} : { active: true };
  const items = await Announcement.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post('/', auth(['ADMIN']), async (req, res) => {
  try {
    const item = await Announcement.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', auth(['ADMIN']), async (req, res) => {
  const item = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ error: 'Annonce introuvable' });
  res.json(item);
});

router.delete('/:id', auth(['ADMIN']), async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
