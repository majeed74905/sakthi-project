import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/images/logo.png';

export function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Who We Are', path: '/who-we-are' },
    { name: 'Products', path: '/products' },
    { name: 'Refer & Earn', path: '/refer-and-earn' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoImg}
              alt="My Sakthi Marketing"
              className="h-12 w-auto object-contain transition group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-bold transition hover:text-brand-600 ${
                    active ? 'text-brand-600 font-black' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/member/dashboard'}>
                  <Button variant="brand" className="text-xs font-bold py-2.5">
                    Dashboard ({user?.userCode})
                  </Button>
                </Link>
                <Button variant="outline" onClick={logout} className="text-xs py-2.5 text-slate-600">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-xs font-bold text-slate-700 hover:text-brand-600">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="brand" className="text-xs font-bold py-2.5 shadow-md shadow-brand-600/20">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-brand-600 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-700 py-2 border-b border-slate-100"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              {isAuthenticated ? (
                <Link to="/member/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="brand" className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="brand" className="w-full">Join Now</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0B132B] text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="My Sakthi Marketing"
                className="h-10 w-auto object-contain bg-white p-1 rounded-lg"
              />
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Supplying high-performance household appliances backed by transparent associate member marketing and dedicated customer service.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/who-we-are" className="hover:text-white transition">Who We Are</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link to="/refer-and-earn" className="hover:text-white transition">Refer & Earn</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Legal & Terms</h4>
            <ul className="space-y-2">
              <li><Link to="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition">Disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Head Office</h4>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-white">My Sakthi Marketing</strong><br />
              No.2, venus Nagar 5th Street, Kolathur, Chennai - 600099.<br />
              Phone: +91 78456 01441<br />
              Email: info@mysakthimarketing.in<br />
              Web: www.mysakthimarketing.in
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800/80 text-center py-6 text-slate-500">
          © {new Date().getFullYear()} My Sakthi Marketing. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
