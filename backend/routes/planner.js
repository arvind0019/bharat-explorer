const express = require('express');
const touristPlaces = require('../data/touristPlaces');
const { Trip } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/planner/generate
router.post('/generate', async (req, res) => {
  try {
    const { city, days, budget, interests = [] } = req.body;
    if (!city || !days) {
      return res.status(400).json({ success: false, message: 'City and days are required' });
    }

    const numDays = Math.min(parseInt(days) || 3, 14);
    const budgetLevel = budget || 'medium';

    // Step 1: Find places by city or state
    const cityNorm = city.toLowerCase();
    let relevantPlaces = touristPlaces.filter(p =>
      p.city.toLowerCase().includes(cityNorm) ||
      p.state.toLowerCase().includes(cityNorm) ||
      cityNorm.includes(p.state.toLowerCase())
    );

    if (relevantPlaces.length < 10) {
      relevantPlaces = touristPlaces
        .filter(p => p.rating >= 4.0)
        .slice(0, 50);
    }

    // Step 2: Sort by interest relevance
    const interestMap = {
      temples: ['Temple'],
      mountains: ['Hill Station', 'Adventure Spot'],
      beaches: ['Beach'],
      food: ['Museum', 'Adventure Spot'],
      wildlife: ['Wildlife Sanctuary'],
      history: ['Historical Monument', 'Fort', 'Museum'],
      lakes: ['Lake', 'Waterfall'],
    };

    let preferredCategories = [];
    interests.forEach(interest => {
      if (interestMap[interest.toLowerCase()]) {
        preferredCategories.push(...interestMap[interest.toLowerCase()]);
      }
    });

    if (preferredCategories.length > 0) {
      relevantPlaces.sort((a, b) => {
        const aMatch = preferredCategories.includes(a.category) ? 1 : 0;
        const bMatch = preferredCategories.includes(b.category) ? 1 : 0;
        return bMatch - aMatch || b.rating - a.rating;
      });
    } else {
      relevantPlaces.sort((a, b) => b.rating - a.rating);
    }

    // Step 3: Budget estimation
    const budgetPerDay = {
      low: 1500,
      medium: 3500,
      high: 7000,
      luxury: 15000
    };
    const dailyCost = budgetPerDay[budgetLevel] || 3500;

    // Step 4: Build day-by-day itinerary (3 places per day)
    const placesPerDay = 3;
    const itinerary = [];
    const usedIds = new Set();

    for (let d = 0; d < numDays; d++) {
      const dayPlaces = [];
      for (let i = 0; i < relevantPlaces.length && dayPlaces.length < placesPerDay; i++) {
        const p = relevantPlaces[i + d * placesPerDay];
        if (p && !usedIds.has(p.id)) {
          dayPlaces.push(p);
          usedIds.add(p.id);
        }
      }

      const fallbackPlaces = relevantPlaces.filter(p => !usedIds.has(p.id)).slice(0, placesPerDay);
      const finalPlaces = [...dayPlaces, ...fallbackPlaces].slice(0, placesPerDay);
      finalPlaces.forEach(p => usedIds.add(p.id));

      const timeSlots = ['morning', 'afternoon', 'evening'];
      const dayPlan = {
        day: d + 1,
        theme: d === 0 ? 'Arrival & Exploration' : d === numDays - 1 ? 'Final Day & Departure' : `Day ${d + 1} Exploration`,
        places: finalPlaces.map((p, i) => ({
          time: timeSlots[i] || 'afternoon',
          name: p ? p.name : 'Local Market',
          category: p ? p.category : 'Adventure Spot',
          description: p ? p.description.slice(0, 100) + '...' : 'Explore local culture',
          rating: p ? p.rating : 4.0,
        })),
        tips: [
          'Start early to avoid crowds',
          'Try local street food for lunch',
          'Carry water and sunscreen'
        ][d % 3],
        estimatedCost: dailyCost,
      };
      itinerary.push(dayPlan);
    }

    const response = {
      city,
      days: numDays,
      budgetLevel,
      totalEstimatedCost: dailyCost * numDays,
      currency: 'INR',
      itinerary,
      travelTips: [
        `Best time to visit ${city}: October to March for most destinations`,
        'Book accommodations in advance during peak season',
        'Download offline maps for navigation',
        'Carry a first aid kit for remote destinations',
        'Respect local customs and dress codes at religious sites'
      ],
      accommodation: {
        budget: `₹${Math.round(dailyCost * 0.3).toLocaleString()}/night`,
        food: `₹${Math.round(dailyCost * 0.25).toLocaleString()}/day`,
        transport: `₹${Math.round(dailyCost * 0.2).toLocaleString()}/day`,
        activities: `₹${Math.round(dailyCost * 0.25).toLocaleString()}/day`
      }
    };

    res.json({ success: true, plan: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/planner/save - Save a trip plan
router.post('/save', protect, async (req, res) => {
  try {
    const trip = await Trip.create({ user: req.user._id, ...req.body });
    res.status(201).json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/planner/my-trips - Get user's saved trips
router.get('/my-trips', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
