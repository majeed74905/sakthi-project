import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import * as authService from '../../services/authService';
import toast from 'react-hot-toast';
import { UserCheck, CheckCircle2, AlertCircle, Lock, Building, ShieldCheck, ArrowRight } from 'lucide-react';

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Form State
  const [sponsorId, setSponsorId] = useState(searchParams.get('sponsor') || searchParams.get('ref') || '');
  const [sponsorInfo, setSponsorInfo] = useState(null);
  const [verifyingSponsor, setVerifyingSponsor] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const [loginPassword, setLoginPassword] = useState('');
  const [confirmLoginPassword, setConfirmLoginPassword] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [confirmTransactionPassword, setConfirmTransactionPassword] = useState('');

  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    branchName: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  // Auto verify sponsor when sponsorId changes
  useEffect(() => {
    if (!sponsorId.trim()) {
      setSponsorInfo(null);
      return;
    }
    const timer = setTimeout(async () => {
      setVerifyingSponsor(true);
      try {
        const res = await authService.verifySponsor(sponsorId.trim());
        setSponsorInfo(res.data);
      } catch (err) {
        setSponsorInfo({ valid: false });
      } finally {
        setVerifyingSponsor(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [sponsorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sponsorInfo || !sponsorInfo.valid) {
      toast.error('A valid active Sponsor ID is required for registration');
      return;
    }

    if (!fullName || !email || !mobile) {
      toast.error('Please complete all account information fields');
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
      toast.error('Mobile number must be exactly 10 digits');
      return;
    }

    if (loginPassword.length < 6 || transactionPassword.length < 6) {
      toast.error('Both Login and Transaction passwords must be at least 6 characters');
      return;
    }

    if (loginPassword !== confirmLoginPassword) {
      toast.error('Login passwords do not match');
      return;
    }

    if (transactionPassword !== confirmTransactionPassword) {
      toast.error('Transaction passwords do not match');
      return;
    }

    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.ifsc || !bankDetails.bankName || !bankDetails.branchName) {
      toast.error('Please complete all bank details fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        sponsorId: sponsorId.trim(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        loginPassword,
        transactionPassword,
        bankDetails: {
          accountName: bankDetails.accountName.trim(),
          accountNumber: bankDetails.accountNumber.trim(),
          ifsc: bankDetails.ifsc.trim().toUpperCase(),
          bankName: bankDetails.bankName.trim(),
          branchName: bankDetails.branchName.trim()
        }
      };

      const res = await authService.registerUser(payload);
      if (res.success) {
        toast.success('Registration successful!');
        setRegistrationSuccess(res.data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Registration Successful!</h2>
          <p className="text-xs text-slate-500 mt-1">Welcome to My Sakthi Marketing Associate Platform</p>
        </div>

        <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-2 shadow-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Your Permanent Distributor User ID</span>
          <h3 className="text-3xl font-black text-rose-400 font-mono tracking-wider">{registrationSuccess.userCode}</h3>
          <p className="text-[11px] text-slate-300 pt-1">Please record this ID safely. You will use it to log in to your associate portal.</p>
        </div>

        <Button variant="brand" onClick={() => navigate('/login')} className="w-full py-3.5 font-bold text-xs uppercase shadow-lg">
          Continue To Login <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Registration Header */}
      <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-full border border-brand-200">
            Associate Onboarding
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Direct Associate Registration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete the 4-step associate verification to receive your Distributor ID.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Already an associate?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Sponsor Verification Section */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-brand-600" /> Step 1: Sponsor Verification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <Input
              label="Sponsor User Code *"
              placeholder="e.g. MSM10001"
              value={sponsorId}
              onChange={(e) => setSponsorId(e.target.value)}
              required
            />
            <div className="pt-7">
              {verifyingSponsor ? (
                <p className="text-xs text-slate-400 font-medium">Verifying sponsor code...</p>
              ) : sponsorInfo ? (
                sponsorInfo.valid ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-semibold shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Sponsor Verified: <strong className="text-slate-900">{sponsorInfo.sponsorName}</strong> ({sponsorInfo.userCode})
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2 font-semibold shadow-sm">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    Invalid Sponsor ID. A valid active sponsor is required.
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>

        {/* 2. Personal Information Section */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" /> Step 2: Personal Information
          </h3>
          <Input
            label="Full Name *"
            placeholder="Enter your official full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mobile Number (10 Digits) *"
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 3. Dual Passwords Section */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-600" /> Step 3: Dual Passwords Setup
            </h3>
            <p className="text-[11px] text-slate-500">
              Create a <strong>Login Password</strong> for portal access and a separate <strong>Transaction Password</strong> for wallet withdrawals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Login Password *"
              type="password"
              placeholder="Min 6 characters"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm Login Password *"
              type="password"
              placeholder="Re-enter login password"
              value={confirmLoginPassword}
              onChange={(e) => setConfirmLoginPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Transaction Password *"
              type="password"
              placeholder="Min 6 characters"
              value={transactionPassword}
              onChange={(e) => setTransactionPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm Transaction Password *"
              type="password"
              placeholder="Re-enter transaction password"
              value={confirmTransactionPassword}
              onChange={(e) => setConfirmTransactionPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 4. Bank Account Section */}
        <div className="space-y-4 pb-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-600" /> Step 4: Bank Account Details
          </h3>
          <Input
            label="Account Holder Name *"
            placeholder="As printed on bank passbook"
            value={bankDetails.accountName}
            onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Account Number *"
              placeholder="Enter bank account number"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              required
            />
            <Input
              label="IFSC Code *"
              placeholder="e.g. SBIN0001234"
              value={bankDetails.ifsc}
              onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bank Name *"
              placeholder="e.g. State Bank of India"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              required
            />
            <Input
              label="Branch Name *"
              placeholder="e.g. Main Branch"
              value={bankDetails.branchName}
              onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="brand"
          disabled={submitting}
          className="w-full py-4 font-bold text-xs uppercase tracking-widest shadow-xl"
        >
          {submitting ? 'Creating Associate Account...' : 'Complete Associate Registration'}
        </Button>
      </form>
    </div>
  );
}

export default RegisterPage;
