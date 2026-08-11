import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';
import { Search, Download, Users, ShieldCheck, UserX, CheckCircle } from 'lucide-react';

export function MembersManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getMembers({ page, limit: 10, search, status });
      setMembers(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, search, status]);

  const handleStatusChange = async (userId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this member's status to ${newStatus}?`)) return;
    try {
      const res = await adminService.updateUserStatus(userId, newStatus);
      if (res.success) {
        toast.success(`Member status updated to ${newStatus}`);
        fetchMembers();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      { label: 'User Code', accessor: (m) => m.userCode },
      { label: 'Full Name', accessor: (m) => m.fullName },
      { label: 'Email', accessor: (m) => m.email },
      { label: 'Phone', accessor: (m) => m.phone },
      { label: 'Role', accessor: (m) => m.role },
      { label: 'Sponsor Code', accessor: (m) => m.sponsor?.userCode || 'Root' },
      { label: 'Status', accessor: (m) => m.status },
      { label: 'Joined Date', accessor: (m) => new Date(m.createdAt).toLocaleDateString('en-IN') }
    ];
    exportToCsv('sakthi_members_export', headers, members);
    toast.success('Members list exported to CSV!');
  };

  return (
    <PageContainer title="Associate Member Governance" subtitle="Audit distributor accounts, downline sponsor relationships, and manage account statuses">
      {/* Top Filter & Action Bar */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full md:w-96">
            <Input
              variant="dark"
              placeholder="Search User Code, Name, Email, Mobile..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={Search}
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All Status', value: '' },
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'PENDING', value: 'PENDING' },
              { label: 'SUSPENDED', value: 'SUSPENDED' }
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => { setStatus(s.value); setPage(1); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  status === s.value
                    ? 'bg-rose-600 text-white shadow-rose-900/40 border border-rose-500/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}

            <Button
              variant="outline"
              onClick={handleExportCsv}
              className="text-xs font-bold text-slate-200 border-slate-700 bg-slate-950 hover:bg-slate-800 hover:text-white transition py-2"
            >
              <Download className="w-4 h-4 mr-2 text-rose-400" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      {loading ? (
        <div className="p-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6">
          <Table
            variant="dark"
            headers={['USER CODE', 'FULL NAME', 'EMAIL / PHONE', 'ROLE', 'SPONSOR CODE', 'STATUS', 'ACTIONS']}
          >
            {members.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No associate members found matching your filter criteria.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/60 transition-colors border-b border-slate-800/60 text-xs">
                  <td className="px-6 py-4 font-mono font-bold text-rose-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-rose-500/70" />
                      <span>{m.userCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-sm">{m.fullName}</td>
                  <td className="px-6 py-4">
                    <p className="text-slate-200 font-medium">{m.email}</p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{m.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                      m.role === 'ADMIN' || m.role === 'SUPER_ADMIN'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-amber-400">
                    {m.sponsor?.userCode ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {m.sponsor.userCode}
                      </span>
                    ) : (
                      <span className="text-slate-400">Direct / Root</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        m.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : m.status === 'SUSPENDED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        m.status === 'ACTIVE' ? 'bg-emerald-400' : m.status === 'SUSPENDED' ? 'bg-rose-400' : 'bg-amber-400'
                      }`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {m.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleStatusChange(m.id, 'ACTIVE')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl transition shadow-md shadow-emerald-950/50"
                          title="Activate Account"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Activate
                        </button>
                      )}
                      {m.status !== 'SUSPENDED' && (
                        <button
                          onClick={() => handleStatusChange(m.id, 'SUSPENDED')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-[11px] rounded-xl transition shadow-md shadow-rose-950/50"
                          title="Suspend Account"
                        >
                          <UserX className="w-3.5 h-3.5" /> Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 bg-slate-900/90 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 font-mono">
                Showing Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-xs font-bold text-slate-300 border-slate-700 bg-slate-950 hover:bg-slate-800 py-1.5"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="text-xs font-bold text-slate-300 border-slate-700 bg-slate-950 hover:bg-slate-800 py-1.5"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}

export default MembersManagement;
