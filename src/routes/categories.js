const router = require('express').Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const filter = req.query.all === '1' ? {} : { visible: true };
  const cats = await Category.find(filter).populate('parent', 'name icon').sort({ order: 1, name: 1 });
  res.json(cats);
});

router.post('/', auth(['ADMIN']), async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', auth(['ADMIN']), async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('parent', 'name icon');
  if (!cat) return res.status(404).json({ error: 'Catégorie introuvable' });
  res.json(cat);
});

router.delete('/:id', auth(['ADMIN']), async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
