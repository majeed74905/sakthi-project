import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as publicService from '../../services/publicService';

export function TermsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTerms() {
      try {
        const res = await publicService.getCmsPage('terms');
        setData(res.data);
      } catch (err) {
        console.error('Terms page error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTerms();
  }, []);

  return (
    <PageContainer title="Terms & Conditions" subtitle="Legal operating terms and member agreement">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="p-8 sm:p-12 space-y-6 bg-white border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">{data?.title || 'Terms & Conditions'}</h2>
          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {data?.content || `
              1. Acceptance of Terms: By registering as an Associate Member of My Sakthi Marketing, you agree to comply with all terms herein.
              2. Associate Identity: Members operate as independent referral associates, not employees of the company.
              3. Bank Details & Payouts: Members are responsible for providing accurate, verified bank account information for reward payouts.
              4. Code of Conduct: Unethical promotion, misrepresentation, or false financial guarantees will result in immediate account suspension.
            `}
          </div>
        </Card>
      )}
    </PageContainer>
  );
}

export default TermsPage;
