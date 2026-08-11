import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { UserCheck, Key, Share2, Award, Wallet, ArrowRight } from 'lucide-react';
import referralHeroImg from '../../assets/images/referral-hero.jpg';

export function ReferAndEarnPage() {
  return (
    <PageContainer title="Refer & Earn Associate Program" subtitle="Factual breakdown of our associate referral structure">
      <div className="space-y-12">
        {/* Intro Hero Banner Card with Background Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <img
            src={referralHeroImg}
            alt="Associate Program Network"
            className="w-full h-80 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 flex items-center p-8 sm:p-12">
            <div className="max-w-xl space-y-4">
              <span className="inline-block px-3 py-1 bg-brand-500/30 text-brand-300 font-bold text-xs rounded-full border border-brand-500/40 backdrop-blur-md">
                Transparent Reward Model
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Build Your Associate Network
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed">
                Introduce household appliances to family and friends. Earn direct referral commissions logged transparently in your member wallet.
              </p>
              <div className="pt-2">
                <Link to="/register">
                  <Button variant="brand" className="px-8 py-3.5 font-bold text-xs uppercase shadow-lg">
                    Join As Associate <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Step Visual Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base">Register with Sponsor</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete onboarding registration using a verified active Sponsor ID.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base">Obtain Distributor Code</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive your permanent Distributor User Code (e.g. MSM10008) and custom link.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base">Share Catalogue</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Share Sakthi household products with potential customers and associates.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black flex items-center justify-center text-sm">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-base">Track Team Growth</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monitor your direct referrals and downline network tree in the member portal.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black flex items-center justify-center text-sm">
              5
            </div>
            <h4 className="font-bold text-slate-900 text-base">Commission Ledger</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Applicable referral rewards are credited directly to your DB ledger.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black flex items-center justify-center text-sm">
              6
            </div>
            <h4 className="font-bold text-slate-900 text-base">Request Bank Payout</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit withdrawal requests directly to your verified bank account.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default ReferAndEarnPage;
