import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as publicService from '../../services/publicService';
import { Target, Eye, ShieldCheck, Award } from 'lucide-react';
import aboutHeroImg from '../../assets/images/about-hero.jpg';

export function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await publicService.getCmsPage('who-we-are');
        setPageData(res.data);
      } catch (err) {
        console.error('Failed to load about page:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  return (
    <PageContainer title="Who We Are" subtitle="About My Sakthi Marketing — Corporate Identity & Mission">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-12">
          {/* Corporate Identity Card with Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-2 bg-white">
            <div className="p-8 sm:p-12 space-y-6 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-full border border-brand-200 w-fit">
                Corporate Identity
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {pageData?.title || 'Who We Are — About My Sakthi Marketing'}
              </h2>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {pageData?.content || (
                  <p>
                    My Sakthi Marketing is a premier direct associate marketing company headquartered in South India, dedicated to supplying high-performance household electronics and kitchen appliances.
                  </p>
                )}
              </div>
            </div>
            <div className="h-72 lg:h-auto relative overflow-hidden">
              <img
                src={aboutHeroImg}
                alt="My Sakthi Corporate Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 space-y-4 bg-white border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Corporate Mission</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                To deliver durable, energy-efficient household appliances to families while fostering transparent associate economic opportunities rooted in ethics and quality.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-white border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                To become South India's most trusted household appliance direct marketing brand known for product reliability, customer support, and associate member integrity.
              </p>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default AboutPage;
