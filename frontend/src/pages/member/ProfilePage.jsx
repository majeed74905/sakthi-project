import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as memberService from '../../services/memberService';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Shield, Lock } from 'lucide-react';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [updating, setUpdating] = useState(false);

  // Password Change Sub-Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordType, setPasswordType] = useState('LOGIN');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await memberService.getProfile();
        const p = res.data;
        setProfile(p);
        setFullName(p.fullName);
        setEmail(p.email);
        setPhone(p.phone);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await memberService.updateProfile({ fullName, email, phone });
      if (res.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter both current and new passwords');
      return;
    }
    setChangingPassword(true);
    try {
      const res = await memberService.changePassword({
        currentPassword,
        newPassword,
        type: passwordType
      });
      if (res.success) {
        toast.success(`${passwordType === 'TRANSACTION' ? 'Transaction' : 'Login'} password changed!`);
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <PageContainer title="My Profile & Security" subtitle="Manage your personal details and account passwords">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fixed Non-Editable Identity Card */}
        <Card className="p-6 bg-slate-900 text-white border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-brand-600 text-white font-black text-2xl rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              {profile?.fullName?.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-white">{profile?.fullName}</h3>
            <span className="inline-block font-mono font-bold text-xs bg-slate-800 text-rose-400 px-3 py-1 rounded-full border border-slate-700">
              {profile?.userCode}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Account Role:</span>
              <span className="font-bold text-white">{profile?.role}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Account Status:</span>
              <span className="font-bold text-emerald-400">{profile?.status}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Sponsor Code:</span>
              <span className="font-mono font-bold text-amber-400">{profile?.sponsor?.userCode || 'Root'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Joined Date:</span>
              <span className="text-slate-300">{new Date(profile?.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </Card>

        {/* Editable Personal Details & Password Change */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 bg-white border-slate-200">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 mb-4">Edit Personal Information</h3>
              <Input
                label="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={User}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />
                <Input
                  label="Mobile Phone Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={Phone}
                  required
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="brand" disabled={updating} className="font-bold text-xs">
                  {updating ? 'Saving...' : 'Update Information'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Card */}
          <Card className="p-8 bg-white border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Change Account Passwords</h3>

            <div className="flex gap-4 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setPasswordType('LOGIN')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  passwordType === 'LOGIN' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Login Password
              </button>
              <button
                type="button"
                onClick={() => setPasswordType('TRANSACTION')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  passwordType === 'TRANSACTION' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Transaction Password
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
              <Input
                label={`Current ${passwordType === 'TRANSACTION' ? 'Transaction' : 'Login'} Password *`}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                icon={Lock}
                required
              />
              <Input
                label={`New ${passwordType === 'TRANSACTION' ? 'Transaction' : 'Login'} Password *`}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={Lock}
                required
              />
              <Button type="submit" variant="outline" disabled={changingPassword} className="font-bold text-xs">
                {changingPassword ? 'Updating Password...' : `Update ${passwordType} Password`}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default ProfilePage;
