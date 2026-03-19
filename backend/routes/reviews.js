const express = require('express');
const { Review } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews/:placeId
router.get('/:placeId', async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { placeId, placeName, rating, comment } = req.body;
    const review = await Review.create({ user: req.user._id, placeId, placeName, rating, comment });
    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
