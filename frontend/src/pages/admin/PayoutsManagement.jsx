import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';

export function PayoutsManagement() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Review Modal State
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [targetStatus, setTargetStatus] = useState('APPROVED');
  const [transactionRef, setTransactionRef] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPayouts({ page, limit: 10, status });
      setPayouts(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch admin payouts queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [page, status]);

  const handleOpenReview = (payout, nextStatus) => {
    setSelectedPayout(payout);
    setTargetStatus(nextStatus);
    setTransactionRef('');
    setAdminNotes('');
  };

  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPayout) return;

    setProcessing(true);
    try {
      const res = await adminService.processPayout(selectedPayout.id, {
        status: targetStatus,
        transactionRef,
        adminNotes
      });

      if (res.success) {
        toast.success(`Payout marked as ${targetStatus}`);
        setSelectedPayout(null);
        fetchPayouts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payout transition failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      { label: 'Request ID', accessor: (p) => p.id },
      { label: 'Member Name', accessor: (p) => p.user?.fullName },
      { label: 'User Code', accessor: (p) => p.user?.userCode },
      { label: 'Amount (₹)', accessor: (p) => p.amount },
      { label: 'Bank Name', accessor: (p) => p.bankSnapshot?.bankName },
      { label: 'Masked Account', accessor: (p) => p.bankSnapshot?.accountNumberMasked },
      { label: 'IFSC Code', accessor: (p) => p.bankSnapshot?.ifscCode },
      { label: 'Status', accessor: (p) => p.status },
      { label: 'Transaction Ref', accessor: (p) => p.transactionRef || 'N/A' },
      { label: 'Requested Date', accessor: (p) => new Date(p.createdAt).toLocaleDateString('en-IN') }
    ];
    exportToCsv('sakthi_payouts_export', headers, payouts);
    toast.success('Payout queue exported to CSV!');
  };

  return (
    <PageContainer title="Payout Approval Queue" subtitle="Audit requested wallet withdrawals and process bank transfers">
      <div className="flex justify-between items-center gap-2 mb-6">
        <Button variant="outline" onClick={handleExportCsv} className="text-xs font-bold text-slate-300 border-slate-700">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>

        <div className="flex gap-2">
          {['', 'PENDING', 'APPROVED', 'PAID', 'REJECTED'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                status === s ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s || 'All Requests'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table headers={['Member (User Code)', 'Requested Amount', 'Destination Bank (Masked)', 'Requested Date', 'Status', 'Actions']}>
          {payouts.map((p) => (
            <tr key={p.id} className="hover:bg-slate-800/50 transition border-b border-slate-800 text-xs text-slate-300">
              <td className="px-6 py-4 font-bold text-white">
                {p.user?.fullName} <span className="font-mono text-rose-400 font-bold">({p.user?.userCode})</span>
              </td>
              <td className="px-6 py-4 font-black text-amber-400">₹{p.amount?.toLocaleString('en-IN')}</td>
              <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                {p.bankSnapshot?.bankName} ({p.bankSnapshot?.accountNumberMasked})
              </td>
              <td className="px-6 py-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    p.status === 'PAID'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : p.status === 'APPROVED'
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : p.status === 'REJECTED'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                {p.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleOpenReview(p, 'APPROVED')}
                      className="px-2.5 py-1 bg-emerald-900/60 text-emerald-400 hover:bg-emerald-800 rounded font-bold text-[10px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleOpenReview(p, 'REJECTED')}
                      className="px-2.5 py-1 bg-rose-900/60 text-rose-400 hover:bg-rose-800 rounded font-bold text-[10px]"
                    >
                      Reject
                    </button>
                  </>
                )}
                {p.status === 'APPROVED' && (
                  <button
                    onClick={() => handleOpenReview(p, 'PAID')}
                    className="px-2.5 py-1 bg-blue-900/60 text-blue-400 hover:bg-blue-800 rounded font-bold text-[10px]"
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Review Modal */}
      <Modal isOpen={!!selectedPayout} onClose={() => setSelectedPayout(null)} title={`Process Payout Request (${targetStatus})`}>
        <form onSubmit={handleProcessSubmit} className="space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
            <p><strong>Member:</strong> {selectedPayout?.user?.fullName} ({selectedPayout?.user?.userCode})</p>
            <p><strong>Amount:</strong> ₹{selectedPayout?.amount?.toLocaleString('en-IN')}</p>
            <p><strong>Bank:</strong> {selectedPayout?.bankSnapshot?.bankName} — Account: {selectedPayout?.bankSnapshot?.accountNumberMasked} (IFSC: {selectedPayout?.bankSnapshot?.ifscCode})</p>
          </div>

          {targetStatus === 'PAID' && (
            <Input
              label="Bank Transaction Reference (IMPS/NEFT Ref) *"
              placeholder="e.g. IMPS99887766"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              required
            />
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Admin Audit Notes</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Enter audit rationale for approval/rejection..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setSelectedPayout(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={processing}>
              {processing ? 'Processing...' : `Confirm ${targetStatus}`}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default PayoutsManagement;
