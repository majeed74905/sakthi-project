import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { LogIn, User, Lock, ShieldCheck, Zap, Award } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error('Please enter User Code/Email and Password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(identifier.trim(), password.trim());
      toast.success('Login successful!');
      if (res.data.user.role === 'ADMIN' || res.data.user.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Left Column: Branding & Demo Info (Desktop Highlight) */}
      <div className="lg:col-span-5 space-y-6 lg:border-r lg:border-slate-100 lg:pr-8">
        <div>
          <span className="px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-full border border-brand-200">
            Secure Portal Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Member & Admin Sign In
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Access your direct associate marketing dashboard, transparent reward ledger, and network growth tools.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Role-Based Access</h4>
              <p className="text-[11px] text-slate-500">Automated routing for Admin & Associate Members</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Real-Time Wallet</h4>
              <p className="text-[11px] text-slate-500">Instant commission breakdown and payout tracking</p>
            </div>
          </div>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 text-xs space-y-2">
          <span className="font-mono text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Development Credentials
          </span>
          <div className="space-y-1.5 font-mono text-[11px] pt-1 leading-relaxed">
            <p><strong className="text-white">Admin:</strong> admin@mysakthimarketing.in / AdminSecurePassword123!</p>
            <p><strong className="text-white">Member:</strong> MSM10002 / DemoPassword123!</p>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="lg:col-span-7 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="User Code / Email / Mobile *"
            placeholder="e.g. MSM10002 or email@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            icon={User}
            required
          />

          <Input
            label="Login Password *"
            type="password"
            placeholder="Enter your account login password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <Link to="/forgot-password" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="brand"
            disabled={submitting}
            className="w-full py-3.5 font-bold text-xs uppercase tracking-wider shadow-lg"
          >
            {submitting ? 'Authenticating...' : 'Sign In To Portal'} <LogIn className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
          Don't have an associate account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
            Register As Associate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
