const router = require('express').Router();
const Product = require('../models/Product');
const HappyHour = require('../models/HappyHour');
const auth = require('../middleware/auth');

function isHappyHourActive(hh) {
  const now = new Date();
  const day = now.getDay();
  if (hh.days.length && !hh.days.includes(day)) return false;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = hh.startHour * 60 + hh.startMinute;
  const end = hh.endHour * 60 + hh.endMinute;
  return currentMinutes >= start && currentMinutes < end;
}

router.get('/', async (req, res) => {
  const filter = req.query.all === '1' ? {} : { visible: true };
  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });

  const happyHours = await HappyHour.find({ active: true }).populate('discounts.product');
  const activeHH = happyHours.filter(isHappyHourActive);

  const discountMap = {};
  for (const hh of activeHH) {
    for (const d of hh.discounts) {
      if (d.product) discountMap[d.product._id.toString()] = d.happyPrice;
    }
  }

  const result = products.map(p => {
    const obj = p.toObject();
    const hprice = discountMap[p._id.toString()];
    if (hprice !== undefined) {
      obj.happyPrice = hprice;
      obj.isHappyHour = true;
    }
    return obj;
  });

  res.json(result);
});

router.post('/', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category');
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(product);
});

router.patch('/:id/toggle', auth(['ADMIN', 'CUISINE', 'BAR']), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  product.visible = !product.visible;
  await product.save();
  res.json({ id: product._id, visible: product.visible });
});

router.delete('/:id', auth(['ADMIN']), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
