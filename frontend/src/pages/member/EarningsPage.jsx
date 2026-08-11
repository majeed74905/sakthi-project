import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import * as memberService from '../../services/memberService';

export function EarningsPage() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchEarnings() {
      setLoading(true);
      try {
        const res = await memberService.getEarnings({ page, limit: 10 });
        setEarnings(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
        }
      } catch (err) {
        console.error('Failed to load earnings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, [page]);

  return (
    <PageContainer title="Commission Earnings Ledger" subtitle="Authoritative database transactions log for your referral rewards">
      {loading ? (
        <LoadingSpinner />
      ) : earnings.length === 0 ? (
        <EmptyState
          title="No earnings recorded yet"
          description="Your commission earnings will appear here as team referrals qualify."
        />
      ) : (
        <div className="space-y-4">
          <Table headers={['Transaction ID', 'Reward Type', 'Source Member', 'Amount', 'Date', 'Status']}>
            {earnings.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50 border-b border-slate-100 text-xs text-slate-700">
                <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{e.id.slice(0, 8)}...</td>
                <td className="px-6 py-4 font-bold text-slate-900">{e.type}</td>
                <td className="px-6 py-4 font-medium text-slate-600">
                  {e.sourceUser ? `${e.sourceUser.fullName} (${e.sourceUser.userCode})` : 'System Milestone'}
                </td>
                <td className="px-6 py-4 font-black text-emerald-600">+₹{e.amount?.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-slate-400">{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {e.status}
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

export default EarningsPage;
