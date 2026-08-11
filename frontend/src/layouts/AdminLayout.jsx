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
  Activity,
  Layers
} from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { section: 'MANAGEMENT', items: [
      { name: 'Dashboard Overview', path: '/admin/dashboard', icon: ShieldAlert },
      { name: 'Member Control', path: '/admin/members', icon: Users },
      { name: 'Payout Approvals', path: '/admin/payouts', icon: ArrowDownToLine, badge: 'Live' }
    ]},
    { section: 'CATALOGUE & CMS', items: [
      { name: 'Products Catalogue', path: '/admin/products', icon: Package },
      { name: 'Contact Inbox', path: '/admin/enquiries', icon: MessageSquare },
      { name: 'Hero Banners CMS', path: '/admin/cms/banners', icon: Image },
      { name: 'CMS Pages Editor', path: '/admin/cms/pages', icon: FileText }
    ]},
    { section: 'SYSTEM AUDIT', items: [
      { name: 'Email Delivery Logs', path: '/admin/email-logs', icon: Mail, badge: 'Phase 10' }
    ]}
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex font-sans antialiased">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0D121F] text-slate-300 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col border-r border-slate-800/80 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-[#0D121F]">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="p-1 bg-white rounded-lg shadow-sm">
              <img
                src={logoImg}
                alt="My Sakthi Marketing"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Enterprise Admin</span>
              <span className="text-[10px] text-slate-400">Governance Portal</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realtime Status Indicator */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-[#0A0E17]">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px]">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Engine Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto custom-scrollbar">
          {navigation.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {group.section}
              </h4>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-slate-800 text-white font-semibold border-l-2 border-indigo-500 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0A0E17] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'Super Administrator'}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user?.userCode || 'MSM10001'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-900/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090D16]">
        <header className="h-16 bg-[#0D121F]/90 border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-slate-200">Admin</span>
              <span>/</span>
              <span className="text-white font-semibold uppercase tracking-wider">
                {location.pathname.split('/').pop().replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Railway Engine Live</span>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold rounded-full">
              {user?.userCode || 'MSM10001'}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
