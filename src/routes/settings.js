const router = require('express').Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

router.get('/:key', async (req, res) => {
  const s = await Settings.findOne({ key: req.params.key });
  res.json({ value: s ? s.value : null });
});

router.put('/:key', auth(['ADMIN']), async (req, res) => {
  const { value } = req.body;
  const s = await Settings.findOneAndUpdate(
    { key: req.params.key },
    { value },
    { upsert: true, new: true }
  );
  res.json(s);
});

module.exports = router;
