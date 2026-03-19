import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇮🇳</span>
              <span className="font-display font-bold text-xl text-white">Bharat Explorer</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover the beauty of Incredible India. Explore 5000+ destinations, plan perfect trips with AI, and experience the rich culture of Bharat.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/map" className="hover:text-saffron transition-colors">India Map</Link></li>
              <li><Link to="/destinations" className="hover:text-saffron transition-colors">Destinations</Link></li>
              <li><Link to="/planner" className="hover:text-saffron transition-colors">Trip Planner</Link></li>
              <li><Link to="/chatbot" className="hover:text-saffron transition-colors">AI Travel Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-saffron transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-saffron transition-colors">Sign In</Link></li>
              <li><Link to="/profile" className="hover:text-saffron transition-colors">My Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-8 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} Bharat Explorer. Built with ❤️ for Incredible India.
        </div>
      </div>
    </footer>
  );
}
