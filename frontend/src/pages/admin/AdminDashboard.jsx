import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import { Users, ShieldAlert, ArrowDownToLine, Package, Mail, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await adminService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <PageContainer title="Executive Command Dashboard" subtitle="Real-time administrative metrics, financial disbursal volume, and system governance">
      {/* Realtime KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card variant="dark" className="relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registered Accounts</p>
              <h3 className="text-3xl font-black text-white">{stats?.totalUsers || 0}</h3>
              <p className="text-[10px] text-slate-500 font-mono">Verified System Users</p>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 shadow-inner group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
          </div>
        </Card>

        <Card variant="dark" className="relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Associate Members</p>
              <h3 className="text-3xl font-black text-emerald-400">{stats?.activeMembers || 0}</h3>
              <p className="text-[10px] text-emerald-500/80 font-mono">● Active Marketing Tree</p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>
        </Card>

        <Card variant="dark" className="relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Payout Requests</p>
              <h3 className="text-3xl font-black text-amber-400">{stats?.pendingPayoutsCount || 0}</h3>
              <p className="text-[10px] text-amber-500/80 font-mono">Awaiting Review</p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
              <ArrowDownToLine className="w-7 h-7" />
            </div>
          </div>
        </Card>

        <Card variant="dark" className="relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">New Contact Inquiries</p>
              <h3 className="text-3xl font-black text-sky-400">{stats?.pendingEnquiriesCount || 0}</h3>
              <p className="text-[10px] text-sky-500/80 font-mono">Unresolved Messages</p>
            </div>
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400 shadow-inner group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card variant="dark" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Financial Disbursal Volume
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
              AUDITED LEDGER
            </span>
          </div>

          <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1 shadow-inner">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Total Paid Payouts Disbursed</span>
            <h4 className="text-4xl font-black text-emerald-400 tracking-tight">
              ₹{stats?.totalPaidVolume?.toLocaleString('en-IN') || '0'}
            </h4>
            <p className="text-[11px] text-slate-400 pt-1">
              Verified financial dispatches logged directly into system transaction records.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/payouts"
              className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
            >
              Go to Payout Approval Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card variant="dark" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-rose-400" />
              Product Catalogue Status
            </h3>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">
              CATALOGUE DISPATCH
            </span>
          </div>

          <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1 shadow-inner">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Active Products Listed</span>
            <h4 className="text-4xl font-black text-rose-400 tracking-tight">{stats?.totalProducts || 0} Products</h4>
            <p className="text-[11px] text-slate-400 pt-1">
              Active merchandise items displayed on public store and associate portal.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
            >
              Manage Product Catalogue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Access Control Grid */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Executive Management Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/members"
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition text-center space-y-2 group"
          >
            <Users className="w-5 h-5 mx-auto text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 block">Member Control</span>
          </Link>
          <Link
            to="/admin/payouts"
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition text-center space-y-2 group"
          >
            <ArrowDownToLine className="w-5 h-5 mx-auto text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 block">Payout Approvals</span>
          </Link>
          <Link
            to="/admin/products"
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition text-center space-y-2 group"
          >
            <Package className="w-5 h-5 mx-auto text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 block">Products</span>
          </Link>
          <Link
            to="/admin/email-logs"
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition text-center space-y-2 group"
          >
            <Mail className="w-5 h-5 mx-auto text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200 block">Email Logs</span>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default AdminDashboard;
