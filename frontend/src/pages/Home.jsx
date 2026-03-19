import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PlaceCard from '../components/PlaceCard';
import IndiaMap from '../components/IndiaMap';

const CATEGORIES = [
  { name: 'Temples', emoji: '🛕', cat: 'Temple', color: 'from-orange-400 to-amber-500' },
  { name: 'Beaches', emoji: '🏖️', cat: 'Beach', color: 'from-blue-400 to-cyan-500' },
  { name: 'Hill Stations', emoji: '🏔️', cat: 'Hill Station', color: 'from-green-400 to-emerald-500' },
  { name: 'Forts', emoji: '🏯', cat: 'Fort', color: 'from-yellow-400 to-amber-600' },
  { name: 'Wildlife', emoji: '🐯', cat: 'Wildlife Sanctuary', color: 'from-lime-400 to-green-600' },
  { name: 'Waterfalls', emoji: '💧', cat: 'Waterfall', color: 'from-sky-400 to-blue-600' },
  { name: 'Lakes', emoji: '🏞️', cat: 'Lake', color: 'from-teal-400 to-cyan-600' },
  { name: 'Monuments', emoji: '🏛️', cat: 'Historical Monument', color: 'from-amber-400 to-orange-600' },
];

export default function Home() {
  const [topPlaces, setTopPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/places?limit=8&sort=rating')
      .then(res => setTopPlaces(res.data.data || []))
      .catch(() => setTopPlaces([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/destinations?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.1) 0,rgba(255,255,255,.1) 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }} />
        {/* Saffron glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-india-green/10 rounded-full blur-3xl" />

        <div className="relative text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/30 rounded-full px-4 py-2 text-saffron text-sm font-medium mb-6">
            <span className="animate-pulse-slow">✨</span>
            AI-Powered India Travel Platform · 5000+ Destinations
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Explore{' '}
            <em className="not-italic text-saffron">Incredible</em>
            <br />India
          </h1>

          <p className="text-stone-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Discover majestic forts, pristine beaches, sacred temples, and breathtaking hill stations across all 28 states and 8 union territories.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto mb-10">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Taj Mahal, Rajasthan, beaches…"
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-500 focus:outline-none focus:border-saffron/60 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-4 whitespace-nowrap">
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/map" className="btn-primary px-8 py-3 text-base">🗺️ Explore Map</Link>
            <Link to="/planner" className="px-8 py-3 text-base bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">✈️ Plan Trip</Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[['5000+', 'Destinations'], ['36', 'States & UTs'], ['300+', 'Festivals'], ['10', 'Categories']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-saffron">{num}</div>
                <div className="text-stone-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-saffron text-xs font-semibold tracking-widest uppercase mb-2">Browse by Type</div>
            <h2 className="font-display text-4xl font-bold text-stone-900">What Are You Looking For?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.cat}
                to={`/destinations?category=${encodeURIComponent(cat.cat)}`}
                className={`relative bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-200 shadow-md group`}
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <div className="font-semibold text-sm">{cat.name}</div>
                <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INDIA MAP SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-saffron text-xs font-semibold tracking-widest uppercase mb-2">Interactive</div>
              <h2 className="font-display text-4xl font-bold text-stone-900 mb-4">Explore India State by State</h2>
              <p className="text-stone-500 text-lg leading-relaxed mb-6">
                Click on any state on the map to instantly discover tourist places, culture, and travel tips for that region.
              </p>
              <div className="space-y-3 mb-8">
                {['36 States & Union Territories', 'Instant place discovery on click', 'Hover to preview state name', 'Mobile-friendly interaction'].map(f => (
                  <div key={f} className="flex items-center gap-3 text-stone-600">
                    <span className="text-saffron font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
              <Link to="/map" className="btn-primary">Open Full Map →</Link>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-inner">
              <IndiaMap />
            </div>
          </div>
        </div>
      </section>

      {/* TOP PLACES */}
      <section className="py-20 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-saffron text-xs font-semibold tracking-widest uppercase mb-2">Must Visit</div>
              <h2 className="font-display text-4xl font-bold text-stone-900">Top Rated Destinations</h2>
            </div>
            <Link to="/destinations" className="btn-outline hidden sm:block">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="card h-72 animate-pulse bg-amber-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPlaces.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/destinations" className="btn-primary px-8 py-3">Explore All 5000+ Destinations</Link>
          </div>
        </div>
      </section>

      {/* AI PLANNER CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-saffron text-xs font-semibold tracking-widest uppercase mb-2">AI Powered</div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Plan Your Perfect Indian Journey</h2>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto mb-8">
            Tell our AI your city, budget, days, and interests. Get a personalized day-by-day itinerary instantly.
          </p>
          <div className="grid sm:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto text-sm">
            {['🏙️ Choose City', '💰 Set Budget', '📅 Pick Days', '✨ Get Plan'].map((step, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 text-white">{step}</div>
            ))}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/planner" className="btn-primary px-8 py-3 text-base">🗓️ Start Planning</Link>
            <Link to="/chatbot" className="px-8 py-3 text-base bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">🤖 Ask AI Guide</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
