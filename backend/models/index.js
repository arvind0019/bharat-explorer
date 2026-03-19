const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── USER MODEL ───
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: Number }], // place IDs
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── REVIEW MODEL ───
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  placeId: { type: Number, required: true },
  placeName: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});

// ─── TRIP MODEL ───
const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  city: { type: String, required: true },
  days: { type: Number, required: true },
  budget: { type: String, required: true },
  interests: [{ type: String }],
  itinerary: [{
    day: Number,
    date: String,
    morning: String,
    afternoon: String,
    evening: String,
    places: [{ type: String }],
    estimatedCost: Number
  }],
  totalEstimatedCost: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

// ─── CUSTOM PLACE MODEL (for admin-added places) ───
const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  best_time: { type: String },
  rating: { type: Number, default: 4.0 },
  image_url: { type: String, default: '' },
  latitude: { type: Number },
  longitude: { type: Number },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isCustom: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);
const Trip = mongoose.model('Trip', tripSchema);
const Place = mongoose.model('Place', placeSchema);

module.exports = { User, Review, Trip, Place };
