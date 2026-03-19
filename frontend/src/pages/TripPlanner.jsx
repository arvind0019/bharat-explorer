import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const INTERESTS = [
  { id: 'temples', label: 'Temples', emoji: '🛕' },
  { id: 'mountains', label: 'Mountains', emoji: '🏔️' },
  { id: 'beaches', label: 'Beaches', emoji: '🏖️' },
  { id: 'food', label: 'Food', emoji: '🍛' },
  { id: 'wildlife', label: 'Wildlife', emoji: '🐯' },
  { id: 'history', label: 'History', emoji: '🏛️' },
  { id: 'lakes', label: 'Lakes', emoji: '🏞️' },
  { id: 'adventure', label: 'Adventure', emoji: '🧗' },
];

const TIME_LABELS = { morning: '☀️ Morning', afternoon: '🌤️ Afternoon', evening: '🌆 Evening' };

export default function TripPlanner() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    city: params.get('city') || '',
    days: 3,
    budget: 'medium',
    interests: [],
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  const toggleInterest = (id) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const generate = async (e) => {
    e.preventDefault();
    if (!form.city) { setError('Please enter a city or state'); return; }
    setLoading(true);
    setError('');
    setPlan(null);
    try {
      const res = await api.post('/planner/generate', form);
      setPlan(res.data.plan);
      setSaved(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async () => {
    if (!user) return;
    try {
      await api.post('/trips', {
        title: `${form.days}-Day ${plan.city} Trip`,
        city: plan.city, days: plan.days,
        budget: plan.budgetLevel,
        interests: form.interests,
        itinerary: plan.itinerary,
        totalEstimatedCost: plan.totalEstimatedCost,
      });
      setSaved(true);
    } catch { }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-950 to-stone-900 py-16 px-4 text-center">
        <div className="text-saffron text-xs font-semibold tracking-widest uppercase mb-2">AI Powered</div>
        <h1 className="font-display text-5xl font-bold text-white mb-3">Trip Planner</h1>
        <p className="text-stone-400 text-lg max-w-xl mx-auto">Get a personalised day-by-day Indian itinerary in seconds</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={generate} className="bg-white rounded-2xl border border-amber-100 p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-5">Your Trip Details</h2>

              <div className="mb-4">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Starting City / State *</label>
                <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                  placeholder="e.g. Jaipur, Kerala, Mumbai…"
                  className="input" />
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">
                  Number of Days: <span className="text-saffron">{form.days}</span>
                </label>
                <input type="range" min="1" max="14" value={form.days}
                  onChange={e => setForm({...form, days: parseInt(e.target.value)})}
                  className="w-full accent-saffron" />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>1 day</span><span>7 days</span><span>14 days</span>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Budget Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['low','🎒 Budget'],['medium','🏨 Mid-range'],['high','✨ Premium'],['luxury','💎 Luxury']].map(([val,label]) => (
                    <button key={val} type="button"
                      onClick={() => setForm({...form, budget: val})}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        form.budget === val ? 'bg-saffron text-white border-saffron' : 'bg-white border-amber-200 text-stone-600 hover:border-saffron'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Your Interests</label>
                <div className="grid grid-cols-2 gap-2">
                  {INTERESTS.map(i => (
                    <button key={i.id} type="button"
                      onClick={() => toggleInterest(i.id)}
                      className={`py-2 px-3 rounded-xl text-sm border flex items-center gap-2 transition-all ${
                        form.interests.includes(i.id) ? 'bg-saffron/10 border-saffron text-saffron' : 'border-amber-200 text-stone-600 hover:border-saffron'
                      }`}>
                      <span>{i.emoji}</span>{i.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
                {loading ? '✨ Generating your plan…' : '✨ Generate Itinerary'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {!plan && !loading ? (
              <div className="flex flex-col items-center justify-center h-80 text-stone-400">
                <div className="text-6xl mb-4">🗓️</div>
                <p className="text-lg font-medium">Your itinerary will appear here</p>
                <p className="text-sm mt-1">Fill in your details and click Generate</p>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center h-80 text-stone-500">
                <div className="text-5xl mb-4 animate-bounce">✨</div>
                <p className="text-lg font-medium">Creating your perfect itinerary…</p>
                <p className="text-sm text-stone-400 mt-1">Analysing 5000+ destinations</p>
              </div>
            ) : plan && (
              <div className="animate-slide-up">
                {/* Summary card */}
                <div className="bg-gradient-to-br from-saffron to-saffron-dark text-white rounded-2xl p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold">{plan.days}-Day {plan.city} Journey</h2>
                      <p className="text-white/70 text-sm mt-1 capitalize">{plan.budgetLevel} budget</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{plan.totalEstimatedCost?.toLocaleString()}</div>
                      <div className="text-white/70 text-xs mt-1">Estimated total</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {Object.entries(plan.accommodation || {}).map(([k, v]) => (
                      <div key={k} className="bg-white/15 rounded-xl p-2.5 text-center">
                        <div className="font-semibold text-sm">{v}</div>
                        <div className="text-white/60 text-xs capitalize">{k}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div className="space-y-4">
                  {plan.itinerary?.map((day) => (
                    <div key={day.day} className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
                      <div className="bg-amber-50 px-5 py-3 flex items-center justify-between">
                        <div>
                          <span className="text-saffron font-bold text-sm">Day {day.day}</span>
                          <h3 className="font-display text-lg font-bold text-stone-900">{day.theme}</h3>
                        </div>
                        <span className="text-stone-500 text-sm">₹{day.estimatedCost?.toLocaleString()}</span>
                      </div>
                      <div className="p-5 space-y-3">
                        {day.places?.map((place, i) => (
                          <div key={i} className="flex gap-3 p-3 rounded-xl bg-amber-50/60">
                            <span className="text-sm font-medium text-saffron min-w-fit">{TIME_LABELS[place.time] || '📍'}</span>
                            <div className="flex-1">
                              <p className="font-medium text-stone-800 text-sm">{place.name}</p>
                              <p className="text-xs text-stone-500 mt-0.5">{place.description}</p>
                            </div>
                            <span className="text-yellow-500 text-xs">⭐ {place.rating}</span>
                          </div>
                        ))}
                        {day.tips && (
                          <p className="text-xs text-stone-500 bg-amber-50 rounded-lg p-2.5 flex items-center gap-1.5">
                            <span>💡</span> {day.tips}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Travel Tips */}
                {plan.travelTips && (
                  <div className="mt-6 bg-white rounded-2xl border border-amber-100 p-5">
                    <h3 className="font-display text-lg font-bold text-stone-900 mb-3">💡 Travel Tips</h3>
                    <ul className="space-y-2">
                      {plan.travelTips.map((tip, i) => (
                        <li key={i} className="text-sm text-stone-600 flex gap-2">
                          <span className="text-saffron font-bold mt-0.5">→</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Save button */}
                <div className="mt-6 flex gap-3">
                  {user ? (
                    <button onClick={saveTrip} disabled={saved}
                      className={`btn-primary flex-1 py-3 ${saved ? 'bg-green-600 border-green-600' : ''}`}>
                      {saved ? '✅ Saved to Profile' : '💾 Save Trip Plan'}
                    </button>
                  ) : (
                    <Link to="/login" className="btn-outline flex-1 text-center py-3">
                      Sign in to Save Plan
                    </Link>
                  )}
                  <button onClick={() => generate({ preventDefault: () => {} })} className="btn-outline px-5 py-3">
                    🔄 Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
