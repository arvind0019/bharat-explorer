import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user, isFavorite, toggleFavorite } = useAuth();

  useEffect(() => {
    Promise.all([
      api.get(`/places/${id}`),
      api.get(`/reviews/${id}`).catch(() => ({ data: { reviews: [] } }))
    ]).then(([pRes, rRes]) => {
      setPlace(pRes.data.data);
      setReviews(rRes.data.reviews || []);
    }).catch(() => setPlace(null))
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/reviews', { placeId: parseInt(id), placeName: place?.name, rating, comment });
      setReviews(prev => [res.data.review, ...prev]);
      setComment('');
      setRating(5);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="text-saffron text-xl animate-pulse">Loading...</div>
    </div>
  );

  if (!place) return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">📍</div>
      <h2 className="font-display text-2xl text-stone-700">Place not found</h2>
      <Link to="/destinations" className="btn-primary">Back to Destinations</Link>
    </div>
  );

  const fav = isFavorite(place.id);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero */}
      <div className="relative h-80 sm:h-96 bg-gradient-to-br from-stone-800 to-stone-900 overflow-hidden">
        {place.image_url && (
          <img src={place.image_url} alt={place.name}
            className="absolute inset-0 w-full h-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <Link to="/destinations" className="text-white/70 text-sm hover:text-white mb-4 inline-flex items-center gap-1">
            ← Back to Destinations
          </Link>
          <span className="badge bg-saffron/80 text-white text-xs mb-3 w-fit">{place.category}</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">{place.name}</h1>
          <p className="text-white/70 mt-2 flex items-center gap-2">
            <span>📍</span> {place.city}, {place.state}
            <span className="ml-4">⭐ {place.rating}</span>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-amber-100 p-6 mb-6">
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">About this Place</h2>
              <p className="text-stone-600 leading-relaxed text-base">{place.description}</p>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl border border-amber-100 p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-4">📍 Location</h2>
              <div className="h-48 bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl flex items-center justify-center border border-blue-100">
                <div className="text-center text-stone-500">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="font-medium">{place.city}, {place.state}</p>
                  <p className="text-xs mt-1">Lat: {place.latitude} · Lng: {place.longitude}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-saffron text-sm hover:underline mt-2 inline-block"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-amber-100 p-6">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-4">
                Reviews ({reviews.length})
              </h2>

              {user ? (
                <form onSubmit={submitReview} className="mb-6 p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-stone-700">Your Rating:</span>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setRating(n)}
                        className={`text-xl transition-transform hover:scale-125 ${n <= rating ? 'text-yellow-400' : 'text-stone-300'}`}>
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share your experience…"
                    rows={3}
                    className="input resize-none mb-3"
                  />
                  {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary text-sm px-5 py-2 disabled:opacity-50">
                    {submitting ? 'Submitting…' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-amber-50 rounded-xl text-center">
                  <p className="text-stone-500 text-sm"><Link to="/login" className="text-saffron font-medium">Sign in</Link> to write a review</p>
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-stone-400 text-center py-6">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="border-b border-amber-50 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-semibold">
                          {r.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-800">{r.user?.name}</p>
                          <div className="flex gap-0.5">
                            {Array(5).fill(0).map((_,i) => (
                              <span key={i} className={`text-xs ${i < r.rating ? 'text-yellow-400' : 'text-stone-200'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-stone-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-amber-100 p-5">
              <button
                onClick={() => toggleFavorite(place.id)}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-colors mb-3 ${
                  fav ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'btn-primary'
                }`}
              >
                {fav ? '❤️ Saved to Favorites' : '🤍 Save to Favorites'}
              </button>
              <Link to={`/planner?city=${encodeURIComponent(place.city)}`} className="btn-outline w-full text-center text-sm py-2.5 block">
                ✈️ Plan a Trip Here
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 p-5 space-y-4">
              <h3 className="font-semibold text-stone-800">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-saffron mt-0.5">📍</span>
                  <div>
                    <div className="font-medium text-stone-700">Location</div>
                    <div className="text-stone-500">{place.city}, {place.state}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-saffron mt-0.5">🗓</span>
                  <div>
                    <div className="font-medium text-stone-700">Best Time</div>
                    <div className="text-stone-500">{place.best_time}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-saffron mt-0.5">🏷️</span>
                  <div>
                    <div className="font-medium text-stone-700">Category</div>
                    <div className="text-stone-500">{place.category}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-saffron mt-0.5">⭐</span>
                  <div>
                    <div className="font-medium text-stone-700">Rating</div>
                    <div className="text-stone-500">{place.rating} / 5.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
