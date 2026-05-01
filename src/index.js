require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, methods: ['GET', 'POST'], credentials: true },
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/happyhour', require('./routes/happyhour'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/birthdays', require('./routes/birthdays'));
app.use('/api/futsal', require('./routes/futsal'));
app.use('/api/announcements', require('./routes/announcements'));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

io.on('connection', (socket) => {
  socket.on('admin:update', (data) => {
    socket.broadcast.emit('menu:update', data);
  });
});

// Broadcast happy hour status every minute
cron.schedule('* * * * *', () => {
  io.emit('happyhour:tick', { time: new Date() });
});

async function seedAdmin() {
  const User = require('./models/User');
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({ username: 'admin', password: 'admin123', role: 'ADMIN' });
    console.log('✅ Admin créé : admin / admin123');
  }
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ocorner')
  .then(async () => {
    console.log('✅ MongoDB connecté');
    await seedAdmin();
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => console.log(`🚀 API prête sur http://localhost:${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB erreur:', err); process.exit(1); });
