import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';
import { Search, Download, Users, UserX, CheckCircle } from 'lucide-react';

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
    <PageContainer
      title="Associate Member Governance"
      subtitle="Audit distributor accounts, downline sponsor relationships, and manage account statuses"
    >
      {/* Top Filter & Action Bar */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full md:w-96">
            <Input
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
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  status === s.value
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}

            <Button
              variant="outline"
              onClick={handleExportCsv}
              className="text-xs font-semibold text-slate-700 border-slate-300 bg-white hover:bg-slate-50 transition py-2"
            >
              <Download className="w-4 h-4 mr-2 text-slate-600" /> Export CSV
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
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
                  <td className="px-6 py-4">
                    <span className="font-mono text-slate-900 font-bold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                      {m.userCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">{m.fullName}</td>
                  <td className="px-6 py-4">
                    <p className="text-slate-800 font-medium">{m.email}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{m.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                      m.role === 'ADMIN' || m.role === 'SUPER_ADMIN'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-amber-700">
                    {m.sponsor?.userCode ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                        {m.sponsor.userCode}
                      </span>
                    ) : (
                      <span className="text-slate-400">Direct / Root</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                        m.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : m.status === 'SUSPENDED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        m.status === 'ACTIVE' ? 'bg-emerald-500' : m.status === 'SUSPENDED' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {m.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleStatusChange(m.id, 'ACTIVE')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-xl transition shadow-sm"
                          title="Activate Account"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Activate
                        </button>
                      )}
                      {m.status !== 'SUSPENDED' && (
                        <button
                          onClick={() => handleStatusChange(m.id, 'SUSPENDED')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] rounded-xl transition shadow-sm"
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
            <div className="flex justify-between items-center px-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">
                Page <span className="text-slate-900 font-bold">{page}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-xs font-semibold text-slate-700 border-slate-300 bg-white hover:bg-slate-50 py-1.5"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="text-xs font-semibold text-slate-700 border-slate-300 bg-white hover:bg-slate-50 py-1.5"
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
