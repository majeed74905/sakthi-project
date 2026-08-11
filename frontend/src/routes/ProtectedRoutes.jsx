import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export function PublicOnlyRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;

  if (isAuthenticated && user) {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/member/dashboard" replace />;
  }

  return <Outlet />;
}

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function MemberRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-950 p-8 rounded-3xl border border-slate-800 text-white space-y-4">
          <h1 className="text-4xl font-black text-rose-500">403</h1>
          <h3 className="text-xl font-bold">Access Denied</h3>
          <p className="text-xs text-slate-400">
            You do not have administrative privileges to view this area.
          </p>
          <a
            href="/member/dashboard"
            className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition"
          >
            Return to Member Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
