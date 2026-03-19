import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const SIDEBAR_LINKS = [
  { id: 'overview', label: 'Overview', emoji: '📊' },
  { id: 'places', label: 'Destinations', emoji: '📍' },
  { id: 'users', label: 'Users', emoji: '👥' },
  { id: 'add', label: 'Add Place', emoji: '➕' },
];

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

function StatCard({ emoji, value, label, color }) {
  return (
    <div className={`bg-white rounded-2xl border border-amber-100 p-5`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 ${color}`}>{emoji}</div>
      <div className="font-display text-3xl font-bold text-stone-900">{value?.toLocaleString()}</div>
      <div className="text-stone-500 text-sm mt-0.5">{label}</div>
    </div>
  );
}

const SAMPLE_PLACES = [
  { id: 89, name: 'Taj Mahal', state: 'Uttar Pradesh', city: 'Agra', category: 'Historical Monument', rating: 4.9, best_time: 'Oct–Mar' },
  { id: 71, name: 'Amber Fort', state: 'Rajasthan', city: 'Jaipur', category: 'Fort', rating: 4.7, best_time: 'Oct–Mar' },
  { id: 43, name: 'Alleppey Backwaters', state: 'Kerala', city: 'Alleppey', category: 'Lake', rating: 4.7, best_time: 'Sep–Mar' },
  { id: 68, name: 'Golden Temple', state: 'Punjab', city: 'Amritsar', category: 'Temple', rating: 4.9, best_time: 'Oct–Mar' },
  { id: 19, name: 'Calangute Beach', state: 'Goa', city: 'Goa', category: 'Beach', rating: 4.3, best_time: 'Nov–Feb' },
  { id: 10, name: 'Kaziranga NP', state: 'Assam', city: 'Golaghat', category: 'Wildlife Sanctuary', rating: 4.8, best_time: 'Nov–Apr' },
  { id: 32, name: 'Shimla', state: 'Himachal Pradesh', city: 'Shimla', category: 'Hill Station', rating: 4.5, best_time: 'Mar–Jun' },
  { id: 20, name: 'Dudhsagar Falls', state: 'Goa', city: 'Sonaulim', category: 'Waterfall', rating: 4.7, best_time: 'Jun–Sep' },
];

const EMPTY_FORM = { name: '', state: '', city: '', category: 'Temple', description: '', best_time: '', rating: 4.0, image_url: '', latitude: '', longitude: '' };

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({ totalDestinations: 5284, totalUsers: 0, totalReviews: 0, totalTrips: 0 });
  const [users, setUsers] = useState([]);
  const [topStates, setTopStates] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [places, setPlaces] = useState(SAMPLE_PLACES);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.stats)).catch(() => {});
    api.get('/admin/users').then(r => setUsers(r.data.users || [])).catch(() => {});
    api.get('/places/stats').then(r => {
      setTopStates(r.data.topStates || []);
      setTopCategories(r.data.topCategories || []);
    }).catch(() => {});
  }, []);

  const filteredPlaces = places.filter(p =>
    !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPlace = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveMsg('');
    try {
      await api.post('/places', form);
      setSaveMsg('✅ Place added successfully!');
      setForm(EMPTY_FORM);
    } catch (err) {
      setSaveMsg('❌ ' + (err.response?.data?.message || 'Failed to add place'));
    } finally { setSaving(false); }
  };

  const handleDeletePlace = (id) => {
    setPlaces(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-amber-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gradient-to-b from-stone-950 to-stone-900 flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🇮🇳</span>
            <span className="font-display font-bold text-white text-sm">Admin Panel</span>
          </Link>
        </div>
        <nav className="p-3 flex-1">
          {SIDEBAR_LINKS.map(l => (
            <button key={l.id} onClick={() => setActiveSection(l.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${
                activeSection === l.id
                  ? 'bg-saffron text-white'
                  : 'text-stone-400 hover:bg-white/10 hover:text-white'
              }`}>
              <span>{l.emoji}</span> {l.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="text-stone-500 text-xs hover:text-white transition-colors">← Back to Site</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-amber-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-display text-xl font-bold text-stone-900">
            {SIDEBAR_LINKS.find(l => l.id === activeSection)?.label}
          </h1>
          <div className="flex items-center gap-3 text-sm text-stone-500">
            <span>⚙️ Admin</span>
          </div>
        </div>

        <div className="p-8">
          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard emoji="📍" value={stats.totalDestinations} label="Total Destinations" color="bg-saffron/10" />
                <StatCard emoji="👥" value={stats.totalUsers || users.length} label="Registered Users" color="bg-blue-50" />
                <StatCard emoji="⭐" value={stats.totalReviews} label="Total Reviews" color="bg-yellow-50" />
                <StatCard emoji="🗓️" value={stats.totalTrips} label="Trip Plans Created" color="bg-green-50" />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top States */}
                <div className="bg-white rounded-2xl border border-amber-100 p-6">
                  <h2 className="font-display text-lg font-bold text-stone-900 mb-4">📊 Top States by Destinations</h2>
                  <div className="space-y-3">
                    {(topStates.length ? topStates : [
                      { state: 'Uttar Pradesh', count: 138 },
                      { state: 'Rajasthan', count: 138 },
                      { state: 'Tamil Nadu', count: 138 },
                      { state: 'Karnataka', count: 138 },
                      { state: 'Maharashtra', count: 138 },
                    ]).slice(0, 8).map((s, i) => (
                      <div key={s.state} className="flex items-center gap-3">
                        <span className="text-stone-400 text-xs w-4">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-stone-700">{s.state}</span>
                            <span className="text-stone-500">{s.count}</span>
                          </div>
                          <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                            <div className="h-full bg-saffron rounded-full" style={{ width: `${Math.min((s.count / 150) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-2xl border border-amber-100 p-6">
                  <h2 className="font-display text-lg font-bold text-stone-900 mb-4">🏷️ Destinations by Category</h2>
                  <div className="space-y-2">
                    {(topCategories.length ? topCategories : [
                      { category: 'Temple', count: 520 },
                      { category: 'Historical Monument', count: 480 },
                      { category: 'Wildlife Sanctuary', count: 460 },
                      { category: 'Hill Station', count: 440 },
                      { category: 'Beach', count: 420 },
                      { category: 'Fort', count: 400 },
                      { category: 'Lake', count: 380 },
                      { category: 'Waterfall', count: 360 },
                      { category: 'Museum', count: 340 },
                      { category: 'Adventure Spot', count: 320 },
                    ]).map(c => (
                      <div key={c.category} className="flex items-center justify-between">
                        <span className={`badge text-xs ${CATEGORY_COLORS[c.category] || 'bg-stone-100 text-stone-600'}`}>{c.category}</span>
                        <span className="text-stone-500 text-sm font-medium">{c.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLACES */}
          {activeSection === 'places' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search destinations…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input max-w-xs text-sm"
                />
                <button onClick={() => setActiveSection('add')} className="btn-primary text-sm px-5 py-2.5">
                  + Add New Place
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-50 border-b border-amber-100">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">Name</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden sm:table-cell">State</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden lg:table-cell">Rating</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlaces.map((p, i) => (
                      <tr key={p.id} className={`border-b border-amber-50 hover:bg-amber-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-stone-50/30'}`}>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-stone-900 text-sm">{p.name}</div>
                          <div className="text-stone-400 text-xs mt-0.5">{p.city}</div>
                        </td>
                        <td className="px-5 py-3.5 text-stone-600 text-sm hidden sm:table-cell">{p.state}</td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className={`badge text-xs ${CATEGORY_COLORS[p.category] || 'bg-stone-100 text-stone-600'}`}>{p.category}</span>
                        </td>
                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          <span className="text-yellow-500">⭐</span> <span className="text-sm text-stone-700">{p.rating}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <Link to={`/destinations/${p.id}`} className="text-xs text-saffron hover:underline">View</Link>
                            <button onClick={() => handleDeletePlace(p.id)}
                              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPlaces.length === 0 && (
                  <div className="text-center py-10 text-stone-400">No destinations found</div>
                )}
              </div>
            </div>
          )}

          {/* USERS */}
          {activeSection === 'users' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-50 border-b border-amber-100">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">User</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">Role</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-10 text-stone-400">No users found. Start the backend and create accounts.</td></tr>
                    ) : users.map(u => (
                      <tr key={u._id} className="border-b border-amber-50 hover:bg-amber-50/50">
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-semibold">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-stone-900 text-sm">{u.name}</span>
                        </td>
                        <td className="px-5 py-3.5 text-stone-500 text-sm hidden sm:table-cell">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className={`badge text-xs ${u.role === 'admin' ? 'bg-saffron/20 text-saffron' : 'bg-stone-100 text-stone-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-stone-400 text-xs hidden md:table-cell">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADD PLACE */}
          {activeSection === 'add' && (
            <div className="animate-fade-in max-w-2xl">
              <form onSubmit={handleAddPlace} className="bg-white rounded-2xl border border-amber-100 p-6 space-y-4">
                <h2 className="font-display text-xl font-bold text-stone-900 mb-2">Add New Destination</h2>

                {saveMsg && (
                  <div className={`px-4 py-3 rounded-xl text-sm ${saveMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {saveMsg}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Place Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Amber Fort" required className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">State *</label>
                    <input type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} placeholder="e.g. Rajasthan" required className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">City *</label>
                    <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="e.g. Jaipur" required className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Category *</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
                      {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Rating (1–5)</label>
                    <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: parseFloat(e.target.value)})} className="input" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Description *</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe this destination…" rows={3} required className="input resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Best Time to Visit</label>
                    <input type="text" value={form.best_time} onChange={e => setForm({...form, best_time: e.target.value})} placeholder="e.g. October to March" className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Image URL</label>
                    <input type="url" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://…" className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Latitude</label>
                    <input type="number" step="any" value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} placeholder="e.g. 26.9855" className="input" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Longitude</label>
                    <input type="number" step="any" value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} placeholder="e.g. 75.8513" className="input" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary px-8 py-3 disabled:opacity-60">
                    {saving ? 'Saving…' : '+ Add Destination'}
                  </button>
                  <button type="button" onClick={() => setForm(EMPTY_FORM)} className="btn-outline px-6 py-3">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
