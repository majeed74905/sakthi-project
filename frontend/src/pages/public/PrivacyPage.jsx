import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as publicService from '../../services/publicService';

export function PrivacyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrivacy() {
      try {
        const res = await publicService.getCmsPage('privacy');
        setData(res.data);
      } catch (err) {
        console.error('Privacy page error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrivacy();
  }, []);

  return (
    <PageContainer title="Privacy Policy" subtitle="How we handle and safeguard member personal data">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="p-8 sm:p-12 space-y-6 bg-white border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">{data?.title || 'Privacy Policy'}</h2>
          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {data?.content || `
              1. Information Collection: We collect essential identity data including full name, email, 10-digit mobile number, and bank details for processing referral compensation.
              2. Data Protection & Masking: Sensitive information such as bank account numbers are masked in administrative displays and never exposed in public logs.
              3. Data Usage: Your contact and identity details are strictly used for account management, transaction verification, and official communications.
            `}
          </div>
        </Card>
      )}
    </PageContainer>
  );
}

export default PrivacyPage;
