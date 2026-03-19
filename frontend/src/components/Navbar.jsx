import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/map', label: 'India Map' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/planner', label: 'Trip Planner' },
    { to: '/chatbot', label: 'AI Guide' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-amber-50/95 backdrop-blur-md border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🇮🇳</span>
            <span className="font-display font-bold text-xl">
              <span className="text-saffron">Bharat</span>{' '}
              <span className="text-india-green">Explorer</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(l.to)
                    ? 'bg-saffron text-white'
                    : 'text-stone-600 hover:bg-saffron/10 hover:text-saffron'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-saffron/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-stone-700">{user.name?.split(' ')[0]}</span>
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-amber-100 w-48 py-2 z-50">
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50">👤 My Profile</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropOpen(false)} className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50">⚙️ Admin Panel</Link>
                    )}
                    <hr className="my-1 border-amber-100" />
                    <button onClick={() => { logout(); setDropOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">🚪 Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm px-4 py-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Register</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg text-stone-600" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive(l.to) ? 'bg-saffron text-white' : 'text-stone-600 hover:bg-amber-50'}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-stone-600 hover:bg-amber-50 rounded-lg">Profile</Link>
              <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-outline text-center text-sm py-2">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary text-center text-sm py-2">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
