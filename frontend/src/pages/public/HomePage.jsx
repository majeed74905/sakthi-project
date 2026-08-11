import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, TrendingUp, ArrowRight, Star, ChevronRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as publicService from '../../services/publicService';
import { getProductImage } from '../../utils/productImages';

import banner1 from '../../assets/images/hero-banner-1.png';
import banner2 from '../../assets/images/hero-banner-2.png';
import banner3 from '../../assets/images/hero-banner-3.png';
import banner4 from '../../assets/images/hero-banner-4.png';

const clientOriginalHeroSlides = [
  {
    id: 'hero-1',
    imageUrl: banner1,
    title: 'Welcome to',
    subtitle: 'My Sakthi Marketing'
  },
  {
    id: 'hero-2',
    imageUrl: banner2,
    title: 'Welcome to',
    subtitle: 'My Sakthi Marketing'
  },
  {
    id: 'hero-3',
    imageUrl: banner3,
    title: 'Welcome to',
    subtitle: 'My Sakthi Marketing'
  },
  {
    id: 'hero-4',
    imageUrl: banner4,
    title: 'Welcome to',
    subtitle: 'My Sakthi Marketing'
  }
];

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, tRes, fRes] = await Promise.all([
          publicService.getProducts({ featured: true, limit: 4 }),
          publicService.getTestimonials(),
          publicService.getFaqs()
        ]);
        setProducts(pRes.data || []);
        setTestimonials(tRes.data || []);
        setFaqs(fRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Banner slider timer - cycles through all 4 client original hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % clientOriginalHeroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* Exact Original Client Hero Carousel Section */}
      <section className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-200 bg-slate-900 min-h-[380px] sm:min-h-[500px]">
        {loading ? (
          <div className="py-32 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="relative w-full h-[380px] sm:h-[500px] overflow-hidden select-none">
            {/* Original Banner Image (contains baked-in title card, active dot indicator, and arrow controls) */}
            <img
              key={clientOriginalHeroSlides[activeBanner].id}
              src={clientOriginalHeroSlides[activeBanner].imageUrl}
              alt="My Sakthi Marketing Hero Banner"
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out cursor-pointer"
              onClick={() => setActiveBanner((prev) => (prev + 1) % clientOriginalHeroSlides.length)}
            />

            {/* Transparent Left Navigation Hotspot (Over Left Arrow) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveBanner((prev) => (prev === 0 ? clientOriginalHeroSlides.length - 1 : prev - 1));
              }}
              className="absolute left-0 top-0 bottom-0 w-1/4 cursor-pointer z-10"
              title="Previous Slide"
            />

            {/* Transparent Right Navigation Hotspot (Over Right Arrow) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveBanner((prev) => (prev + 1) % clientOriginalHeroSlides.length);
              }}
              className="absolute right-0 top-0 bottom-0 w-1/4 cursor-pointer z-10"
              title="Next Slide"
            />
          </div>
        )}
      </section>

      {/* Trust & Value Proposition */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Certified Products</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rigorous quality inspection ensuring long-lasting performance and energy efficiency.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Transparent Business</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Clear associate referral compensation models backed by automated DB ledger logs.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Strong Associate Network</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Thousands of direct associate members building reliable product distribution channels.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-white border-slate-200 hover:shadow-lg transition">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Nationwide Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dedicated customer support helpline and warranty resolution across South India.
          </p>
        </Card>
      </section>

      {/* Featured Products */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Product Highlights</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Featured Household Appliances</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center">
            View All Catalogue <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Card key={p.id} className="overflow-hidden hover:shadow-xl transition group flex flex-col justify-between">
              <div>
                <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={getProductImage(p.name, p.category?.name, p.images)}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getProductImage(p.name, p.category?.name);
                    }}
                  />
                  {p.isFeatured && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shadow z-10">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {p.category?.name || 'Home Appliance'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.shortDescription || p.description}</p>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <span className="text-base font-black text-slate-900">₹{p.price?.toLocaleString('en-IN')}</span>
                <Link to={`/products/${p.id}`}>
                  <Button variant="ghost" className="text-xs font-bold text-brand-600 hover:bg-brand-50">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How Refer & Earn Works */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-16 space-y-12 border border-slate-800 shadow-xl">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Associate Program</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">How The Associate System Works</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A simple 4-step factual workflow designed for transparent team coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-xs">1</span>
            <h4 className="font-bold text-white text-base">Register Account</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign up using a verified Sponsor ID and complete member onboarding.
            </p>
          </div>

          <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-xs">2</span>
            <h4 className="font-bold text-white text-base">Get Distributor ID</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive your unique MSM Distributor Code (e.g. MSM10008) and referral link.
            </p>
          </div>

          <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-xs">3</span>
            <h4 className="font-bold text-white text-base">Introduce Associates</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Share products and introduce new members to build your associate network.
            </p>
          </div>

          <div className="space-y-3 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-xs">4</span>
            <h4 className="font-bold text-white text-base">Track & Withdraw</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor transparent earnings in your member wallet and request bank payouts.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/refer-and-earn">
            <Button variant="accent" className="px-8 py-3 font-bold text-xs uppercase tracking-wider">
              Read Complete Program Terms
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Slider */}
      {testimonials.length > 0 && (
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Member Testimonials</span>
            <h2 className="text-3xl font-black text-slate-900">What Our Associates Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.id} className="p-6 space-y-4 bg-white border-slate-200">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{t.message}"</p>
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-slate-900 text-xs">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{t.designation || 'Associate Member'}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      {faqs.length > 0 && (
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Help Center</span>
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <Card key={f.id} className="p-6 bg-white border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f.question}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed pl-6">{f.answer}</p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
