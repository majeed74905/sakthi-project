import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';

export function RefundPolicyPage() {
  return (
    <PageContainer title="Refund Policy" subtitle="Appliance return and refund parameters">
      <Card className="p-8 sm:p-12 space-y-6 bg-white border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Appliance Return & Refund Terms</h2>
        <div className="text-xs text-slate-600 leading-relaxed space-y-4">
          <p>
            My Sakthi Marketing guarantees product quality. If an appliance is delivered with a manufacturing defect or transit damage:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Defective products must be reported to helpline support within 7 days of delivery.</li>
            <li>Returned items must include original packaging, manuals, and accessories.</li>
            <li>Approved returns will receive replacement units or refund initiation as per terms.</li>
          </ul>
        </div>
      </Card>
    </PageContainer>
  );
}

export default RefundPolicyPage;
