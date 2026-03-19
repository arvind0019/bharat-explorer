const express = require('express');
const { User, Review, Trip } = require('../models');
const touristPlaces = require('../data/touristPlaces');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalReviews, totalTrips] = await Promise.all([
      User.countDocuments(),
      Review.countDocuments(),
      Trip.countDocuments()
    ]);
    res.json({
      success: true,
      stats: {
        totalDestinations: touristPlaces.length,
        totalUsers,
        totalReviews,
        totalTrips,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
