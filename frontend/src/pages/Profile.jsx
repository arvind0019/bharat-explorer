import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PlaceCard from '../components/PlaceCard';
import touristPlacesData from '../data/places';

export default function Profile() {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    api.get('/trips').then(r => setTrips(r.data.trips || [])).catch(() => {});
  }, []);

  const favoritePlaces = (user?.favorites || [])
    .map(id => touristPlacesData.find(p => p.id === id))
    .filter(Boolean);

  const deleteTrip = async (id) => {
    await api.delete(`/trips/${id}`);
    setTrips(prev => prev.filter(t => t._id !== id));
  };

  const tabs = [
    { id: 'favorites', label: `❤️ Favorites (${favoritePlaces.length})` },
    { id: 'trips', label: `🗓️ My Trips (${trips.length})` },
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-950 to-stone-900 py-16 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-saffron text-white flex items-center justify-center text-3xl font-bold font-display flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-white">{user?.name}</h1>
            <p className="text-stone-400 mt-1">{user?.email}</p>
            <span className={`badge mt-2 ${user?.role === 'admin' ? 'bg-saffron/20 text-saffron' : 'bg-stone-700 text-stone-300'}`}>
              {user?.role === 'admin' ? '⚙️ Administrator' : '👤 Explorer'}
            </span>
          </div>
          <button onClick={logout} className="text-stone-400 hover:text-red-400 text-sm transition-colors hidden sm:block">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            ['❤️', favoritePlaces.length, 'Saved Places'],
            ['🗓️', trips.length, 'Trip Plans'],
            ['⭐', '–', 'Reviews'],
          ].map(([emoji, num, label]) => (
            <div key={label} className="bg-white rounded-2xl border border-amber-100 p-4 text-center">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-display text-2xl font-bold text-stone-900">{num}</div>
              <div className="text-stone-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 border border-amber-100 w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id ? 'bg-saffron text-white' : 'text-stone-600 hover:bg-amber-50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Favorites */}
        {activeTab === 'favorites' && (
          favoritePlaces.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <div className="text-5xl mb-3">🤍</div>
              <p className="font-medium">No saved places yet</p>
              <Link to="/destinations" className="btn-primary mt-4 inline-block px-6 py-2.5">Explore Destinations</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoritePlaces.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          )
        )}

        {/* Trips */}
        {activeTab === 'trips' && (
          trips.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <div className="text-5xl mb-3">🗓️</div>
              <p className="font-medium">No saved trips yet</p>
              <Link to="/planner" className="btn-primary mt-4 inline-block px-6 py-2.5">Plan a Trip</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map(trip => (
                <div key={trip._id} className="bg-white rounded-2xl border border-amber-100 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-stone-900">{trip.title}</h3>
                      <p className="text-stone-500 text-sm mt-1">
                        📍 {trip.city} · {trip.days} days · ₹{trip.totalEstimatedCost?.toLocaleString() || 'N/A'}
                      </p>
                      <p className="text-stone-400 text-xs mt-1">
                        Created {new Date(trip.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button onClick={() => deleteTrip(trip._id)}
                      className="text-red-400 hover:text-red-600 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
