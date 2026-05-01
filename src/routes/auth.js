const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Champs requis' });

  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
});

router.get('/me', auth(), (req, res) => res.json(req.user));

router.post('/users', auth(['ADMIN']), async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/users', auth(['ADMIN']), async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

router.delete('/users/:id', auth(['ADMIN']), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
