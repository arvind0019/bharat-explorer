const express = require('express');
const touristPlaces = require('../data/touristPlaces');
const { Place } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/places  - Get all places with filters
router.get('/', async (req, res) => {
  try {
    let { state, category, search, page = 1, limit = 20, sort = 'rating' } = req.query;
    page = parseInt(page); limit = parseInt(limit);

    let filtered = [...touristPlaces];

    if (state) filtered = filtered.filter(p => p.state.toLowerCase() === state.toLowerCase());
    if (category) filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.state.toLowerCase().includes(s) ||
        p.city.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)
      );
    }

    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    res.json({ success: true, total, page, pages: Math.ceil(total / limit), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/places/states - Get list of all states
router.get('/states', (req, res) => {
  const states = [...new Set(touristPlaces.map(p => p.state))].sort();
  res.json({ success: true, states });
});

// GET /api/places/categories - Get list of all categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(touristPlaces.map(p => p.category))].sort();
  res.json({ success: true, categories });
});

// GET /api/places/stats - Stats for admin
router.get('/stats', async (req, res) => {
  const totalPlaces = touristPlaces.length;
  const stateCount = {};
  const categoryCount = {};
  touristPlaces.forEach(p => {
    stateCount[p.state] = (stateCount[p.state] || 0) + 1;
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  const topStates = Object.entries(stateCount)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([state, count]) => ({ state, count }));
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  res.json({ success: true, totalPlaces, topStates, topCategories });
});

// GET /api/places/state/:stateName - Places by state (for map click)
router.get('/state/:stateName', (req, res) => {
  const { stateName } = req.params;
  const places = touristPlaces
    .filter(p => p.state.toLowerCase() === stateName.toLowerCase())
    .slice(0, 50);
  res.json({ success: true, state: stateName, total: places.length, data: places });
});

// GET /api/places/:id - Get single place
router.get('/:id', (req, res) => {
  const place = touristPlaces.find(p => p.id === parseInt(req.params.id));
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
  res.json({ success: true, data: place });
});

// POST /api/places - Admin: Add new place
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const place = await Place.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, data: place });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/places/:id - Admin: Edit custom place
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/places/:id - Admin: Delete custom place
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Place deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
