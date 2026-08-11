import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import logoImg from '../assets/images/logo.png';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Subtle Radial Decorator */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header Logo Bar */}
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10 text-center mb-8">
        <Link to="/" className="inline-block group bg-white/95 p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-200 transition transform hover:scale-105">
          <img
            src={logoImg}
            alt="My Sakthi Marketing"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>
        <p className="mt-3 text-xs text-slate-400 font-semibold uppercase tracking-widest">
          Direct Associate & Member Portal
        </p>
      </div>

      {/* Main Auth Content Area with Top-Right Close Button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl lg:max-w-4xl relative z-10">
        <div className="bg-white shadow-2xl rounded-3xl border border-slate-100 p-6 sm:p-10 lg:p-12 relative">
          {/* User-Friendly Close (X) Button */}
          <Link
            to="/"
            title="Close & Return to Website"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition shadow-sm group z-20"
          >
            <X className="w-5 h-5 transition group-hover:rotate-90" />
          </Link>

          <Outlet />
        </div>
      </div>

      {/* Footer Navigation Back Link */}
      <div className="mt-8 text-center text-xs text-slate-400 relative z-10 font-medium">
        <Link to="/" className="hover:text-sky-400 transition inline-flex items-center justify-center gap-1">
          <span>←</span> Back to Homepage
        </Link>
      </div>
    </div>
  );
}

export default AuthLayout;
