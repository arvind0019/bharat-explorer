import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🇮🇳</span>
            <span className="font-display text-2xl font-bold">
              <span className="text-saffron">Bharat</span> <span className="text-india-green">Explorer</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-stone-900 mt-6 mb-1">Welcome back</h1>
          <p className="text-stone-500 text-sm">Sign in to continue your India journey</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="you@example.com" required className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••" required className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-saffron font-medium hover:underline">Register free</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-stone-500 text-center">
            <strong>Demo Admin:</strong> admin@bharat.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🇮🇳</span>
            <span className="font-display text-2xl font-bold">
              <span className="text-saffron">Bharat</span> <span className="text-india-green">Explorer</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-stone-900 mt-6 mb-1">Create account</h1>
          <p className="text-stone-500 text-sm">Join thousands exploring Incredible India</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Priya Sharma" required className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="you@example.com" required className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="Min. 6 characters" required className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-60">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-saffron font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
