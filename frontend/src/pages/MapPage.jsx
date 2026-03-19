import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IndiaMap from '../components/IndiaMap';
import PlaceCard from '../components/PlaceCard';
import api from '../utils/api';

export default function MapPage() {
  const [selectedState, setSelectedState] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStateClick = async (stateName) => {
    setSelectedState(stateName);
    setLoading(true);
    try {
      const res = await api.get(`/places/state/${encodeURIComponent(stateName)}`);
      setPlaces(res.data.data || []);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-950 to-stone-900 py-16 px-4 text-center">
        <div className="text-saffron text-xs font-semibold tracking-widest uppercase mb-2">Interactive</div>
        <h1 className="font-display text-5xl font-bold text-white mb-3">Map of India</h1>
        <p className="text-stone-400 text-lg max-w-xl mx-auto">
          Click any state to discover its tourist destinations
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white rounded-3xl shadow-sm border border-amber-100 p-6">
              <h3 className="font-semibold text-stone-700 mb-4 text-center">Click a state to explore</h3>
              <IndiaMap onStateClick={handleStateClick} />
              {selectedState && (
                <div className="mt-4 p-3 bg-saffron/10 rounded-xl text-center">
                  <span className="text-saffron font-semibold">📍 {selectedState}</span>
                  <button
                    onClick={() => navigate(`/destinations?state=${encodeURIComponent(selectedState)}`)}
                    className="block w-full mt-2 btn-primary text-sm py-2"
                  >
                    View All in {selectedState.split(' ')[0]} →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Places Panel */}
          <div className="lg:col-span-3">
            {!selectedState ? (
              <div className="flex flex-col items-center justify-center h-80 text-stone-400">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-lg font-medium">Click a state on the map</p>
                <p className="text-sm mt-1">to see its top destinations</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-64 rounded-2xl bg-amber-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-stone-900">
                    Places in <span className="text-saffron">{selectedState}</span>
                  </h2>
                  <span className="text-stone-500 text-sm">{places.length} found</span>
                </div>
                {places.length === 0 ? (
                  <div className="text-center py-16 text-stone-400">
                    <div className="text-4xl mb-3">📍</div>
                    <p>No destinations found for {selectedState}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {places.map(p => <PlaceCard key={p.id} place={p} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
