import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';
import { Search, Download } from 'lucide-react';

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
    <PageContainer title="Associate Member Management" subtitle="Audit accounts, sponsor relationships, and toggle member status">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search User Code, Name, Email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={Search}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {['', 'ACTIVE', 'PENDING', 'SUSPENDED'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  status === s ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {s || 'All Status'}
              </button>
            ))}
          </div>

          <Button variant="outline" onClick={handleExportCsv} className="text-xs font-bold text-slate-300 border-slate-700">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          <Table headers={['User Code', 'Full Name', 'Email / Phone', 'Role', 'Sponsor Code', 'Status', 'Actions']}>
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/50 transition border-b border-slate-800 text-xs text-slate-300">
                <td className="px-6 py-4 font-mono font-bold text-rose-400">{m.userCode}</td>
                <td className="px-6 py-4 font-bold text-white">{m.fullName}</td>
                <td className="px-6 py-4 text-slate-400">
                  <p>{m.email}</p>
                  <p className="text-[10px] text-slate-500">{m.phone}</p>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-400">{m.role}</td>
                <td className="px-6 py-4 font-mono text-amber-400">{m.sponsor?.userCode || 'Root'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      m.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : m.status === 'SUSPENDED'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {m.status !== 'ACTIVE' && (
                    <button
                      onClick={() => handleStatusChange(m.id, 'ACTIVE')}
                      className="p-1.5 bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800 rounded font-bold text-[10px]"
                      title="Activate"
                    >
                      Activate
                    </button>
                  )}
                  {m.status !== 'SUSPENDED' && (
                    <button
                      onClick={() => handleStatusChange(m.id, 'SUSPENDED')}
                      className="p-1.5 bg-rose-900/50 text-rose-400 hover:bg-rose-800 rounded font-bold text-[10px]"
                      title="Suspend"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-400 px-4">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}

export default MembersManagement;
