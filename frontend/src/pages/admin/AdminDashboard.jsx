import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import { Users, ShieldAlert, ArrowDownToLine, Package, Mail, CheckCircle2 } from 'lucide-react';

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
    <PageContainer title="Executive System Control" subtitle="Real-time administrative metrics and platform statistics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-800 text-white border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Total User Accounts</p>
              <h3 className="text-2xl font-black text-white mt-1">{stats?.totalUsers || 0} Accounts</h3>
            </div>
            <Users className="w-8 h-8 text-rose-500" />
          </div>
        </Card>

        <Card className="bg-slate-800 text-white border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Active Associate Members</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats?.activeMembers || 0} Members</h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>

        <Card className="bg-slate-800 text-white border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Pending Payout Requests</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{stats?.pendingPayoutsCount || 0} Requests</h3>
            </div>
            <ArrowDownToLine className="w-8 h-8 text-amber-400" />
          </div>
        </Card>

        <Card className="bg-slate-800 text-white border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">New Public Enquiries</p>
              <h3 className="text-2xl font-black text-blue-400 mt-1">{stats?.pendingEnquiriesCount || 0} New Messages</h3>
            </div>
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-slate-800 border-slate-700 text-white space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Financial Disbursal Volume</h3>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Total Paid Volume To Date</span>
            <h4 className="text-3xl font-black text-emerald-400">
              ₹{stats?.totalPaidVolume?.toLocaleString('en-IN') || '0'}
            </h4>
          </div>
        </Card>

        <Card className="p-6 bg-slate-800 border-slate-700 text-white space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Product Inventory Status</h3>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Active Products Listed</span>
            <h4 className="text-3xl font-black text-brand-400">{stats?.totalProducts || 0} Items</h4>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

export default AdminDashboard;
