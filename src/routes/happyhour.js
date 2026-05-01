const router = require('express').Router();
const HappyHour = require('../models/HappyHour');
const auth = require('../middleware/auth');

router.get('/', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  const hhs = await HappyHour.find().populate('discounts.product');
  res.json(hhs);
});

router.post('/', auth(['ADMIN']), async (req, res) => {
  try {
    const hh = await HappyHour.create(req.body);
    res.status(201).json(hh);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', auth(['ADMIN']), async (req, res) => {
  const hh = await HappyHour.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('discounts.product');
  if (!hh) return res.status(404).json({ error: 'Happy Hour introuvable' });
  res.json(hh);
});

router.delete('/:id', auth(['ADMIN']), async (req, res) => {
  await HappyHour.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
