const express = require('express');
const { Trip } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/trips
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/trips
router.post('/', protect, async (req, res) => {
  try {
    const trip = await Trip.create({ user: req.user._id, ...req.body });
    res.status(201).json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
