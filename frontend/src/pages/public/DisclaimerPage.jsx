import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';

export function DisclaimerPage() {
  return (
    <PageContainer title="Official Disclaimer" subtitle="Regulatory compliance & financial transparency statement">
      <Card className="p-8 sm:p-12 space-y-6 bg-white border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Associate Program Disclaimer</h2>
        <div className="text-xs text-slate-600 leading-relaxed space-y-4">
          <p>
            My Sakthi Marketing operates a direct product marketing program. All associate compensation is derived strictly from genuine product distribution and associate referrals.
          </p>
          <p>
            <strong>No Financial Guarantees:</strong> My Sakthi Marketing does NOT promise or guarantee fixed returns, passive income, or risk-free financial profits. Member earnings depend entirely on individual referral performance and team coordination.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}

export default DisclaimerPage;
