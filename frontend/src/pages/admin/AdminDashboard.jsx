import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import { Users, ShieldAlert, ArrowDownToLine, Package, Mail, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

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
    <PageContainer
      title="Executive Command Dashboard"
      subtitle="Real-time administrative metrics, financial disbursal volume, and system governance"
    >
      {/* Realtime KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="relative overflow-hidden border-l-4 border-slate-900">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered Accounts</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</h3>
              <p className="text-xs text-slate-500 font-medium">Verified System Users</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-800 border border-slate-200">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Associate Members</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats?.activeMembers || 0}</h3>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Active Marketing Tree
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Payout Requests</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats?.pendingPayoutsCount || 0}</h3>
              <p className="text-xs text-amber-700 font-semibold">Awaiting Review</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
              <ArrowDownToLine className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-sky-500">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Contact Inquiries</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats?.pendingEnquiriesCount || 0}</h3>
              <p className="text-xs text-sky-700 font-semibold">Unresolved Messages</p>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl text-sky-600 border border-sky-200">
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Financial Disbursal Volume
            </h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              AUDITED LEDGER
            </span>
          </div>

          <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white space-y-1 shadow-md">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Paid Payouts Disbursed</span>
            <h4 className="text-4xl font-extrabold text-emerald-400 tracking-tight">
              ₹{stats?.totalPaidVolume?.toLocaleString('en-IN') || '0'}
            </h4>
            <p className="text-xs text-slate-300 pt-1">
              Verified financial dispatches logged directly into system transaction records.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/payouts"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-rose-600 transition"
            >
              Go to Payout Approval Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-rose-600" />
              Product Catalogue Status
            </h3>
            <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
              CATALOGUE DISPATCH
            </span>
          </div>

          <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-1 shadow-md">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Products Listed</span>
            <h4 className="text-4xl font-extrabold text-white tracking-tight">{stats?.totalProducts || 0} Products</h4>
            <p className="text-xs text-slate-300 pt-1">
              Active merchandise items displayed on public store and associate portal.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-rose-600 transition"
            >
              Manage Product Catalogue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Access Control Grid */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Executive Management Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/members"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white hover:shadow-md transition text-center space-y-2 group"
          >
            <Users className="w-6 h-6 mx-auto text-slate-800 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Member Control</span>
          </Link>
          <Link
            to="/admin/payouts"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white hover:shadow-md transition text-center space-y-2 group"
          >
            <ArrowDownToLine className="w-6 h-6 mx-auto text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Payout Approvals</span>
          </Link>
          <Link
            to="/admin/products"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white hover:shadow-md transition text-center space-y-2 group"
          >
            <Package className="w-6 h-6 mx-auto text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Products</span>
          </Link>
          <Link
            to="/admin/email-logs"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white hover:shadow-md transition text-center space-y-2 group"
          >
            <Mail className="w-6 h-6 mx-auto text-sky-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-900 block">Email Logs</span>
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}

export default AdminDashboard;
