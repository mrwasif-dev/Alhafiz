require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve the website itself (public/index.html, public/about.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Any unknown, non-API route falls back to the homepage
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
