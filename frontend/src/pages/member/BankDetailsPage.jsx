import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as memberService from '../../services/memberService';
import toast from 'react-hot-toast';
import { Building, CreditCard, Lock, ShieldCheck } from 'lucide-react';

export function BankDetailsPage() {
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);

  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchBank() {
      try {
        const res = await memberService.getBankDetails();
        const b = res.data;
        if (b) {
          setBank(b);
          setAccountName(b.accountName);
          setIfscCode(b.ifscCode);
          setBankName(b.bankName);
          setBranchName(b.branchName);
        }
      } catch (err) {
        console.error('Failed to fetch bank details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBank();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountName || !accountNumber || !ifscCode || !bankName || !branchName || !transactionPassword) {
      toast.error('Please fill in all bank details and enter your Transaction Password');
      return;
    }

    setUpdating(true);
    try {
      const res = await memberService.updateBankDetails({
        accountName,
        accountNumber,
        ifscCode,
        bankName,
        branchName,
        transactionPassword
      });

      if (res.success) {
        toast.success('Bank details updated successfully!');
        setBank(res.data);
        setTransactionPassword(''); // Clear password field immediately
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bank update failed');
    } finally {
      setUpdating(false);
      setTransactionPassword('');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <PageContainer title="Bank Account Details" subtitle="Verified bank account snapshot used for withdrawal disbursements">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Bank Snapshot Box */}
        <Card className="p-6 bg-slate-900 text-white border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Building className="w-8 h-8 text-brand-400" />
            <div>
              <h3 className="text-base font-bold text-white">Current Bank Account</h3>
              <span className="text-[10px] text-slate-400">Withdrawal Destination</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Account Holder Name</p>
              <p className="font-bold text-white text-sm">{bank?.accountName || 'Not configured'}</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Account Number (Masked)</p>
              <p className="font-mono font-bold text-rose-400 text-sm tracking-wider">
                {bank?.accountNumberMasked || 'XXXXXX'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">IFSC Code</p>
                <p className="font-mono font-bold text-amber-400">{bank?.ifscCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Verification</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {bank?.isVerified ? 'VERIFIED' : 'PENDING AUDIT'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Bank Name & Branch</p>
              <p className="text-slate-300">{bank?.bankName} — {bank?.branchName}</p>
            </div>
          </div>
        </Card>

        {/* Update Form */}
        <div className="lg:col-span-2">
          <Card className="p-8 bg-white border-slate-200 space-y-6">
            <h3 className="text-base font-bold text-slate-900">Update Bank Account Details</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Account Holder Name *"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Full Account Number *"
                  type="password"
                  placeholder="Enter full account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
                <Input
                  label="IFSC Code *"
                  placeholder="e.g. SBIN0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Bank Name *"
                  placeholder="e.g. State Bank of India"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
                <Input
                  label="Branch Name *"
                  placeholder="e.g. Main Branch"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Input
                  label="Transaction Password Required to Confirm *"
                  type="password"
                  placeholder="Enter your transaction password"
                  value={transactionPassword}
                  onChange={(e) => setTransactionPassword(e.target.value)}
                  icon={Lock}
                  required
                />
              </div>

              <Button type="submit" variant="brand" disabled={updating} className="w-full py-3 font-bold text-xs">
                {updating ? 'Verifying & Updating...' : 'Save Verified Bank Details'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default BankDetailsPage;
