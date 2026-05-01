const router = require('express').Router();
const FutsalSlot = require('../models/FutsalSlot');
const auth = require('../middleware/auth');

// Public : slots du jour (filtrés sur les heures à venir ou en cours)
router.get('/', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const slots = await FutsalSlot.find({ date, active: true }).sort({ hour: 1 });
  res.json(slots);
});

// Admin : tous les slots d'une date
router.get('/admin', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const slots = await FutsalSlot.find({ date }).sort({ hour: 1 });
  res.json(slots);
});

router.post('/', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  try {
    const slot = await FutsalSlot.create(req.body);
    res.status(201).json(slot);
  } catch (e) {
    if (e.code === 11000) {
      // Slot existant : on le met à jour
      const { date, hour, reservations } = req.body;
      const slot = await FutsalSlot.findOneAndUpdate({ date, hour }, { reservations, active: req.body.active ?? true }, { new: true });
      return res.json(slot);
    }
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  const slot = await FutsalSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!slot) return res.status(404).json({ error: 'Introuvable' });
  res.json(slot);
});

router.delete('/:id', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  await FutsalSlot.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
