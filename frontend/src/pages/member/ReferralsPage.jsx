import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import * as memberService from '../../services/memberService';
import { Search, Users } from 'lucide-react';

export function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchReferrals() {
      setLoading(true);
      try {
        const res = await memberService.getReferrals({ page, limit: 10, search });
        setReferrals(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
        }
      } catch (err) {
        console.error('Failed to load referrals:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReferrals();
  }, [page, search]);

  return (
    <PageContainer title="Direct Referrals" subtitle="List of associate members introduced by your Distributor ID">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by User Code, Name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={Search}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : referrals.length === 0 ? (
        <EmptyState
          title="No direct referrals found"
          description="Share your referral link to introduce new associate members."
        />
      ) : (
        <div className="space-y-4">
          <Table headers={['User Code', 'Full Name', 'Contact Phone', 'Registration Date', 'Status']}>
            {referrals.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 border-b border-slate-100 text-xs text-slate-700">
                <td className="px-6 py-4 font-mono font-bold text-brand-600">{r.userCode}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{r.fullName}</td>
                <td className="px-6 py-4 text-slate-500">{r.phone}</td>
                <td className="px-6 py-4 text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-500 px-4">
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

export default ReferralsPage;
