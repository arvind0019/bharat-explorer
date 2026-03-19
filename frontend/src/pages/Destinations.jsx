import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import PlaceCard from '../components/PlaceCard';

const CATEGORIES = ['Temple','Beach','Hill Station','Fort','Wildlife Sanctuary','Waterfall','Lake','Historical Monument','Museum','Adventure Spot'];
const SORT_OPTIONS = [{ value: 'rating', label: '⭐ Top Rated' }, { value: 'name', label: '🔤 A-Z' }];

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || '',
    category: searchParams.get('category') || '',
    sort: 'rating',
  });

  useEffect(() => {
    api.get('/places/states').then(r => setStates(r.data.states || [])).catch(() => {});
  }, []);

  const fetchPlaces = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 12, ...filters });
      Object.keys(filters).forEach(k => { if (!filters[k]) params.delete(k); });
      const res = await api.get(`/places?${params}`);
      setPlaces(res.data.data || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
      setPage(pg);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchPlaces(1); }, [fetchPlaces]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', state: '', category: '', sort: 'rating' });
    setSearchParams({});
  };

  const hasFilters = filters.search || filters.state || filters.category;

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-950 to-stone-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-saffron text-xs font-semibold tracking-widest uppercase mb-2">Explore</div>
          <h1 className="font-display text-5xl font-bold text-white mb-3">Tourist Destinations</h1>
          <p className="text-stone-400 text-lg">5000+ places across every Indian state</p>

          {/* Search bar */}
          <div className="mt-8 flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
              <input
                type="text"
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchPlaces(1)}
                placeholder="Search by name, city, state…"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-500 focus:outline-none focus:border-saffron/60 text-sm"
              />
            </div>
            <button onClick={() => fetchPlaces(1)} className="btn-primary px-6">Search</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-amber-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-800">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-saffron hover:underline">Clear all</button>
                )}
              </div>

              {/* State filter */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">State / UT</label>
                <select
                  value={filters.state}
                  onChange={e => updateFilter('state', e.target.value)}
                  className="input text-sm py-2"
                >
                  <option value="">All States</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Category filter */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Category</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="cat" value="" checked={!filters.category} onChange={() => updateFilter('category', '')} className="accent-saffron" />
                    <span className="text-sm text-stone-600">All Categories</span>
                  </label>
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="cat" value={cat} checked={filters.category === cat} onChange={() => updateFilter('category', cat)} className="accent-saffron" />
                      <span className="text-sm text-stone-600">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 block">Sort By</label>
                <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="input text-sm py-2">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-stone-500 text-sm">
                {loading ? 'Loading…' : `${total.toLocaleString()} destinations found`}
                {filters.state && ` in ${filters.state}`}
                {filters.category && ` · ${filters.category}`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array(12).fill(0).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-amber-100 animate-pulse" />)}
              </div>
            ) : places.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-medium">No destinations found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary mt-4 px-6">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {places.map(p => <PlaceCard key={p.id} place={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button onClick={() => fetchPlaces(page - 1)} disabled={page === 1} className="btn-outline px-4 py-2 text-sm disabled:opacity-40">← Prev</button>
                    <span className="text-sm text-stone-500 px-4">Page {page} of {pages}</span>
                    <button onClick={() => fetchPlaces(page + 1)} disabled={page === pages} className="btn-outline px-4 py-2 text-sm disabled:opacity-40">Next →</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
