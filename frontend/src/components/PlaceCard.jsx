import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORY_COLORS = {
  'Temple': 'bg-orange-100 text-orange-700',
  'Beach': 'bg-blue-100 text-blue-700',
  'Hill Station': 'bg-green-100 text-green-700',
  'Fort': 'bg-yellow-100 text-yellow-800',
  'Wildlife Sanctuary': 'bg-emerald-100 text-emerald-700',
  'Waterfall': 'bg-cyan-100 text-cyan-700',
  'Lake': 'bg-sky-100 text-sky-700',
  'Historical Monument': 'bg-amber-100 text-amber-800',
  'Museum': 'bg-purple-100 text-purple-700',
  'Adventure Spot': 'bg-red-100 text-red-700',
};

const CATEGORY_EMOJI = {
  'Temple': '🛕', 'Beach': '🏖️', 'Hill Station': '🏔️', 'Fort': '🏯',
  'Wildlife Sanctuary': '🐯', 'Waterfall': '💧', 'Lake': '🏞️',
  'Historical Monument': '🏛️', 'Museum': '🎨', 'Adventure Spot': '🧗',
};

export default function PlaceCard({ place }) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const fav = isFavorite(place.id);

  const handleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { alert('Please sign in to save favorites'); return; }
    await toggleFavorite(place.id);
  };

  const catColor = CATEGORY_COLORS[place.category] || 'bg-stone-100 text-stone-700';
  const catEmoji = CATEGORY_EMOJI[place.category] || '📍';

  return (
    <Link to={`/destinations/${place.id}`} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
        {place.image_url ? (
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {catEmoji}
        </div>
        {/* Favorite button */}
        <button
          onClick={handleFav}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
            fav ? 'bg-red-500 text-white' : 'bg-white/90 text-stone-400 hover:text-red-500'
          }`}
        >
          {fav ? '❤️' : '🤍'}
        </button>
        {/* Rating */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
          <span className="text-yellow-500 text-xs">⭐</span>
          <span className="text-xs font-semibold text-stone-700">{place.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-stone-900 text-base leading-tight line-clamp-1 group-hover:text-saffron transition-colors">
            {place.name}
          </h3>
        </div>
        <p className="text-xs text-stone-500 mb-2 flex items-center gap-1">
          <span>📍</span> {place.city}, {place.state}
        </p>
        <span className={`badge text-xs ${catColor} mb-2`}>{catEmoji} {place.category}</span>
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mt-1">
          {place.description}
        </p>
        <div className="mt-3 pt-3 border-t border-amber-50 flex items-center justify-between">
          <span className="text-xs text-stone-400 flex items-center gap-1">
            <span>🗓</span> {place.best_time}
          </span>
          <span className="text-saffron text-xs font-medium group-hover:underline">Explore →</span>
        </div>
      </div>
    </Link>
  );
}
