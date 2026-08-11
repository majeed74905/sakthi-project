import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import * as memberService from '../../services/memberService';
import toast from 'react-hot-toast';
import { Wallet, ArrowUpRight, Lock, Building } from 'lucide-react';

export function PayoutsPage() {
  const [dashboard, setDashboard] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [dRes, pRes, bRes] = await Promise.all([
          memberService.getDashboard(),
          memberService.getPayouts({ page: 1, limit: 10 }),
          memberService.getBankDetails()
        ]);
        setDashboard(dRes.data);
        setPayouts(pRes.data || []);
        setBank(bRes.data);
      } catch (err) {
        console.error('Failed to load payouts data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid payout amount');
      return;
    }

    if (numAmount > (dashboard?.walletBalance || 0)) {
      toast.error(`Requested amount ₹${numAmount} exceeds your available balance of ₹${dashboard?.walletBalance}`);
      return;
    }

    if (!transactionPassword) {
      toast.error('Transaction Password is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await memberService.submitPayoutRequest({
        amount: numAmount,
        transactionPassword
      });

      if (res.success) {
        toast.success('Payout request submitted successfully!');
        setIsModalOpen(false);
        setAmount('');
        setTransactionPassword('');
        // Reload list & dashboard
        const [dRes, pRes] = await Promise.all([
          memberService.getDashboard(),
          memberService.getPayouts({ page: 1, limit: 10 })
        ]);
        setDashboard(dRes.data);
        setPayouts(pRes.data || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payout request failed');
    } finally {
      setSubmitting(false);
      setTransactionPassword(''); // Clear password immediately
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <PageContainer title="Payout Requests Workflow" subtitle="Request bank account withdrawals from your wallet balance">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 text-white border-slate-800 p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase">Available Wallet Balance</p>
          <h3 className="text-3xl font-black text-emerald-400 mt-1">₹{dashboard?.walletBalance?.toLocaleString('en-IN') || '0'}</h3>
          <Button
            variant="accent"
            onClick={() => setIsModalOpen(true)}
            disabled={!dashboard?.walletBalance || dashboard.walletBalance <= 0}
            className="w-full mt-4 font-bold text-xs"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" /> Request Payout
          </Button>
        </Card>

        <Card className="bg-white border-slate-200 p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase">Pending Review Amount</p>
          <h3 className="text-3xl font-black text-amber-500 mt-1">₹{dashboard?.pendingPayouts?.toLocaleString('en-IN') || '0'}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Under administrative review</p>
        </Card>

        <Card className="bg-white border-slate-200 p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Paid Volume</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">₹{dashboard?.totalPaidPayouts?.toLocaleString('en-IN') || '0'}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Disbursed to bank account</p>
        </Card>
      </div>

      {/* Payout History Table */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Payout Requests History</h3>
        {payouts.length === 0 ? (
          <EmptyState
            title="No payout requests submitted"
            description="When your wallet has an available balance, you can submit bank withdrawal requests here."
          />
        ) : (
          <Table headers={['Request ID', 'Amount', 'Target Bank Account', 'Requested Date', 'Status']}>
            {payouts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 border-b border-slate-100 text-xs text-slate-700">
                <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{p.id.slice(0, 8)}...</td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{p.amount?.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                  {p.bankSnapshot?.bankName} ({p.bankSnapshot?.accountNumberMasked})
                </td>
                <td className="px-6 py-4 text-slate-400">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : p.status === 'APPROVED'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {/* Payout Submission Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Payout Request">
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Destination Bank Account</span>
            <p className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-600" />
              {bank?.bankName || 'Bank'} — {bank?.accountNumberMasked || 'Masked Account'}
            </p>
            <p className="text-[10px] text-slate-500">IFSC: {bank?.ifscCode}</p>
          </div>

          <Input
            label="Payout Amount (₹) *"
            type="number"
            placeholder={`Max available: ₹${dashboard?.walletBalance}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Input
            label="Transaction Password *"
            type="password"
            placeholder="Enter your transaction password"
            value={transactionPassword}
            onChange={(e) => setTransactionPassword(e.target.value)}
            icon={Lock}
            required
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default PayoutsPage;
