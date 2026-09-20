const express = require('express');
const cors = require('cors');
const { PORT, CLIENT_ORIGIN } = require('./config/env');
const connectDB = require('./config/db');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const doubtRoutes = require('./routes/doubts');

const app = express();
const allowedOrigins = (CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const ensureDemoAccounts = async () => {
  const demoAccounts = [
    { name: 'Student Demo', username: 'student', password: 'student123', role: 'student' },
    { name: 'Faculty Demo', username: 'faculty', password: 'faculty123', role: 'faculty' },
  ];

  for (const account of demoAccounts) {
    const existing = await User.findOne({ username: account.username.toLowerCase() });
    if (!existing) {
      await User.create({
        ...account,
        email: `${account.username}@demo.local`,
      });
    }
  }
};

connectDB().then(ensureDemoAccounts).catch((err) => console.error(err));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/doubts', doubtRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
