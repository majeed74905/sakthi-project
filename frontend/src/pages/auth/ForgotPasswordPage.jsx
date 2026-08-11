import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import * as authService from '../../services/authService';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setSubmitting(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Password reset link requested!');
    } catch (err) {
      toast.error('Failed to request password reset');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <Link to="/login" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Forgot Password</h1>
        <p className="text-xs text-slate-500">Request password reset instructions</p>
      </div>

      <Card className="p-8 bg-white border-slate-200 shadow-xl space-y-6">
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an account with that email exists, password reset instructions have been sent to your email address.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full">
              Try Another Email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Email Address *"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <Button type="submit" variant="brand" disabled={submitting} className="w-full py-3 font-bold text-xs uppercase">
              {submitting ? 'Sending Instructions...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
