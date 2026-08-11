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
  X
} from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Admin Overview', path: '/admin/dashboard', icon: ShieldAlert },
    { name: 'Member Control', path: '/admin/members', icon: Users },
    { name: 'Products Catalogue', path: '/admin/products', icon: Package },
    { name: 'Payout Approval Queue', path: '/admin/payouts', icon: ArrowDownToLine },
    { name: 'Contact Inbox', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Hero Banners CMS', path: '/admin/cms/banners', icon: Image },
    { name: 'CMS Pages Editor', path: '/admin/cms/pages', icon: FileText },
    { name: 'Email Delivery Logs', path: '/admin/email-logs', icon: Mail }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="My Sakthi Marketing"
              className="h-10 w-auto object-contain bg-white p-1 rounded-xl shadow-sm"
            />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-900/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            Admin Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        <header className="h-20 bg-slate-950/90 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider hidden sm:block">
              My Sakthi Marketing — Executive Admin Control
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold rounded-full uppercase">
              {user?.userCode || 'MSM10001'}
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-700">
              A
            </div>
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
