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
import { Download, ArrowDownToLine, CheckCircle2, XCircle, CreditCard, Building2 } from 'lucide-react';

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
    <PageContainer title="Financial Disbursal & Payout Governance" subtitle="Audit requested wallet withdrawals, review destination bank details, and log bank transaction reference codes">
      {/* Action & Status Filter Header */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleExportCsv}
          className="text-xs font-bold text-slate-200 border-slate-700 bg-slate-950 hover:bg-slate-800 transition py-2"
        >
          <Download className="w-4 h-4 mr-2 text-rose-400" /> Export CSV Queue
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'All Requests', value: '' },
            { label: 'PENDING', value: 'PENDING' },
            { label: 'APPROVED', value: 'APPROVED' },
            { label: 'PAID', value: 'PAID' },
            { label: 'REJECTED', value: 'REJECTED' }
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatus(s.value); setPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                status === s.value
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 border border-rose-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Table
          variant="dark"
          headers={['MEMBER (USER CODE)', 'REQUESTED AMOUNT', 'DESTINATION BANK (MASKED)', 'REQUESTED DATE', 'STATUS', 'ACTIONS']}
        >
          {payouts.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                No payout withdrawal requests found matching your filter criteria.
              </td>
            </tr>
          ) : (
            payouts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/60 transition-colors border-b border-slate-800/60 text-xs">
                <td className="px-6 py-4 font-bold text-white text-sm">
                  <div>
                    <span className="text-white block">{p.user?.fullName}</span>
                    <span className="font-mono text-rose-400 text-xs font-bold">{p.user?.userCode}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-black text-amber-400 text-base">
                  ₹{p.amount?.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 font-mono text-slate-300 text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-bold text-white">{p.bankSnapshot?.bankName || 'N/A'}</p>
                      <p className="text-[11px] text-slate-400">{p.bankSnapshot?.accountNumberMasked} (IFSC: {p.bankSnapshot?.ifscCode})</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                  {new Date(p.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      p.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : p.status === 'APPROVED'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : p.status === 'REJECTED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      p.status === 'PAID' ? 'bg-emerald-400' : p.status === 'APPROVED' ? 'bg-sky-400' : p.status === 'REJECTED' ? 'bg-rose-400' : 'bg-amber-400'
                    }`} />
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {p.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleOpenReview(p, 'APPROVED')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl transition shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleOpenReview(p, 'REJECTED')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-xl transition shadow-md"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}
                    {p.status === 'APPROVED' && (
                      <button
                        onClick={() => handleOpenReview(p, 'PAID')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] rounded-xl transition shadow-md"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Mark Paid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
      )}

      {/* Review Modal */}
      <Modal isOpen={!!selectedPayout} onClose={() => setSelectedPayout(null)} title={`Process Payout Request (${targetStatus})`}>
        <form onSubmit={handleProcessSubmit} className="space-y-4 text-slate-200">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
            <p className="text-slate-300"><strong className="text-white">Member:</strong> {selectedPayout?.user?.fullName} ({selectedPayout?.user?.userCode})</p>
            <p className="text-amber-400 font-bold"><strong className="text-white">Amount:</strong> ₹{selectedPayout?.amount?.toLocaleString('en-IN')}</p>
            <p className="text-slate-300"><strong className="text-white">Destination Bank:</strong> {selectedPayout?.bankSnapshot?.bankName}</p>
            <p className="text-slate-400"><strong className="text-white">Masked Account:</strong> {selectedPayout?.bankSnapshot?.accountNumberMasked} (IFSC: {selectedPayout?.bankSnapshot?.ifscCode})</p>
          </div>

          {targetStatus === 'PAID' && (
            <Input
              variant="dark"
              label="Bank Transaction Reference (IMPS/NEFT/UTR Ref) *"
              placeholder="e.g. UTR998877665544"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              required
            />
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Admin Audit Notes</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="Enter audit rationale for approval/rejection..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setSelectedPayout(null)} className="text-xs font-bold border-slate-700 bg-slate-900 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={processing} className="text-xs font-bold uppercase tracking-wider px-6">
              {processing ? 'Processing...' : `Confirm ${targetStatus}`}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default PayoutsManagement;
