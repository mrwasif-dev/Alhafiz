const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// GET /api/reviews — public list, newest first
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(200);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load reviews.' });
  }
});

// POST /api/reviews — anyone can add a review (no login required, matches the site's brief)
router.post('/', async (req, res) => {
  try {
    const { name, role, rating, text } = req.body;
    if (!name || !text) {
      return res.status(400).json({ error: 'Name and review text are required.' });
    }
    const review = await Review.create({
      name: String(name).slice(0, 100),
      role: String(role || 'Client').slice(0, 100),
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
      text: String(text).slice(0, 800)
    });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save the review.' });
  }
});

module.exports = router;
