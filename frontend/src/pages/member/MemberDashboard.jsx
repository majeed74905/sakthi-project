import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as memberService from '../../services/memberService';
import toast from 'react-hot-toast';
import { Wallet, Users, Network, ArrowUpRight, Copy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function MemberDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await memberService.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load member dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const copyReferralLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      toast.success('Referral link copied to clipboard!');
    }
  };

  // Mock chart trend data computed from total earnings
  const earningsTrendData = [
    { month: 'Jan', earnings: Math.round((data?.totalEarnings || 1000) * 0.15) },
    { month: 'Feb', earnings: Math.round((data?.totalEarnings || 1000) * 0.25) },
    { month: 'Mar', earnings: Math.round((data?.totalEarnings || 1000) * 0.40) },
    { month: 'Apr', earnings: data?.totalEarnings || 1000 }
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <PageContainer title="Member Overview Dashboard" subtitle={`Welcome back, ${data?.fullName || 'Associate'} (${data?.userCode})`}>
      {/* 4 Core Financial & Team Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-amber-500 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Wallet</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹{data?.walletBalance?.toLocaleString('en-IN') || '0'}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Earnings</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹{data?.totalEarnings?.toLocaleString('en-IN') || '0'}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-brand-500 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Referrals</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{data?.directReferralsCount || 0} Associates</h3>
            </div>
            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Team Size</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{data?.totalTeamSize || 0} Downlines</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Network className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Referral Link Banner */}
      <Card className="p-6 bg-slate-900 text-white border-slate-800 shadow-xl mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Your Permanent Referral Link</span>
            <p className="text-xs font-mono text-rose-400 font-bold break-all">{data?.referralLink}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="accent" onClick={copyReferralLink} className="text-xs font-bold whitespace-nowrap">
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </Button>
            <Link to="/member/payouts">
              <Button variant="outline" className="text-xs font-bold text-white border-slate-700 hover:bg-slate-800 whitespace-nowrap">
                Request Payout
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Interactive Recharts Visualization */}
      <Card className="p-6 bg-white border-slate-200 shadow-sm mb-8 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Earnings Trend Growth</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earningsTrendData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip formatter={(val) => `₹${val}`} />
              <Bar dataKey="earnings" fill="#dc2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Referrals & Recent Ledger Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-white border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Recent Direct Referrals</h3>
            <Link to="/member/referrals" className="text-xs font-bold text-brand-600 hover:underline">
              View All
            </Link>
          </div>
          {data?.recentReferrals?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.recentReferrals.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{r.fullName}</p>
                    <p className="text-[10px] font-mono text-slate-400">{r.userCode}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No direct referrals yet.</p>
          )}
        </Card>

        <Card className="p-6 bg-white border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Recent Earnings Ledger</h3>
            <Link to="/member/earnings" className="text-xs font-bold text-brand-600 hover:underline">
              View All
            </Link>
          </div>
          {data?.recentEarnings?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.recentEarnings.map((e) => (
                <div key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{e.type}</p>
                    <p className="text-[10px] text-slate-400">{new Date(e.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <span className="font-bold text-emerald-600 text-xs">+₹{e.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No earnings recorded yet.</p>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}

export default MemberDashboard;
