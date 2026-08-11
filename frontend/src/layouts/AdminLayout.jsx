import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/logo.png';
import {
  ShieldAlert,
  Users,
  Package,
  ArrowDownToLine,
  MessageSquare,
  Image,
  FileText,
  Mail,
  LogOut,
  Menu,
  X,
  Sparkles,
  Activity
} from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Admin Overview', path: '/admin/dashboard', icon: ShieldAlert, badge: null },
    { name: 'Member Control', path: '/admin/members', icon: Users, badge: null },
    { name: 'Products Catalogue', path: '/admin/products', icon: Package, badge: null },
    { name: 'Payout Approval Queue', path: '/admin/payouts', icon: ArrowDownToLine, badge: 'Live' },
    { name: 'Contact Inbox', path: '/admin/enquiries', icon: MessageSquare, badge: null },
    { name: 'Hero Banners CMS', path: '/admin/cms/banners', icon: Image, badge: null },
    { name: 'CMS Pages Editor', path: '/admin/cms/pages', icon: FileText, badge: null },
    { name: 'Email Delivery Logs', path: '/admin/email-logs', icon: Mail, badge: 'Phase 10' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/95 text-slate-300 transform transition-transform duration-300 ease-out lg:static lg:translate-x-0 flex flex-col border-r border-slate-800/80 backdrop-blur-xl shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/90">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="p-1.5 bg-white rounded-xl shadow-md border border-slate-700/50 group-hover:scale-105 transition-transform">
              <img
                src={logoImg}
                alt="My Sakthi Marketing"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-black text-white uppercase tracking-wider block">Executive Admin</span>
              <span className="text-[10px] text-slate-400 font-mono">My Sakthi Platform</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYSTEM OPERATIONAL
            </div>
            <span className="font-mono text-[10px] text-slate-500">REALTIME</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold shadow-lg shadow-rose-900/40 border border-rose-500/30'
                    : 'text-slate-400 hover:bg-slate-900/90 hover:text-slate-100 hover:border hover:border-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-rose-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-md">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Super Administrator'}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{user?.userCode || 'MSM10001'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Executive Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <header className="h-20 bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider hidden sm:block">
                My Sakthi Marketing <span className="text-rose-500">—</span> Executive Command Center
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">Realtime Administrator Governance & Financial Audit System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Railway Engine Live</span>
            </div>
            <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
              {user?.userCode || 'MSM10001'}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
