import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import * as publicService from '../../services/publicService';
import { getProductImage } from '../../utils/productImages';
import { Search, Filter, ArrowRight } from 'lucide-react';

const FALLBACK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Sakthi Multi-Grind Mixer 750W',
    category: { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
    shortDescription: 'Heavy duty 750-watt copper motor mixer grinder with 4 stainless steel jars.',
    description: 'The Sakthi Multi-Grind 750W features stainless steel leak-proof jars, high-grade motor overload protector, and ergonomic shockproof ABS body.',
    price: 4999,
    images: [{ imageUrl: '/images/products/mixer.jpg', isPrimary: true }]
  },
  {
    id: 'prod-2',
    name: 'Sakthi Vision 43-Inch Ultra HD Smart LED TV',
    category: { name: 'Home Entertainment', slug: 'home-entertainment' },
    shortDescription: '4K Ultra HD Smart LED TV with Dolby Audio and dual-band Wi-Fi.',
    description: 'Experience immersive visuals with Sakthi Vision 43-inch 4K Smart TV. Powered by Android OS, Google Assistant, 20W speakers, and bezel-less display.',
    price: 24999,
    images: [{ imageUrl: '/images/products/tv.jpg', isPrimary: true }]
  },
  {
    id: 'prod-3',
    name: 'Sakthi Aqua Pure RO+UV Water Purifier',
    category: { name: 'Home Utilities', slug: 'home-utilities' },
    shortDescription: 'Advanced 7-stage RO+UV+UF water purification system with mineralizer.',
    description: 'Ensures 100% pure drinking water with 8-litre storage capacity, smart LED indicator, and automated auto-flush technology.',
    price: 11999,
    images: [{ imageUrl: '/images/products/water-purifier.jpg', isPrimary: true }]
  },
  {
    id: 'prod-4',
    name: 'Sakthi Chef Wet Grinder 2L',
    category: { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
    shortDescription: '2-Litre tabletop wet grinder with sturdy granite stones.',
    description: 'Designed for fast and uniform batter grinding with low noise motor, stainless steel drum, and easy-clean stones.',
    price: 5499,
    images: [{ imageUrl: '/images/products/wet-grinder.jpg', isPrimary: true }]
  },
  {
    id: 'prod-5',
    name: 'Sakthi Anodized 5L Pressure Cooker',
    category: { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
    shortDescription: 'Hard anodized induction bottom safety pressure cooker.',
    description: 'Corrosion-resistant hard anodized body, precision weight valve, and gasket release safety system.',
    price: 2299,
    images: [{ imageUrl: '/images/products/cooker.jpg', isPrimary: true }]
  }
];

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await publicService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await publicService.getProducts({
          page,
          limit: 8,
          search,
          category: selectedCategory
        });
        const items = res?.data || [];
        if (items.length > 0) {
          setProducts(items);
        } else if (!search && !selectedCategory) {
          setProducts(FALLBACK_PRODUCTS);
        } else {
          setProducts([]);
        }

        if (res?.meta) {
          setTotalPages(res.meta.totalPages || 1);
        } else if (res?.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to load products, using default catalogue:', err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [page, search, selectedCategory]);

  return (
    <PageContainer title="Household Product Catalogue" subtitle="High-performance home and kitchen appliances">
      {/* Search & Category Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search appliances..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={Search}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => { setSelectedCategory(''); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              selectedCategory === '' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedCategory(c.slug); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                selectedCategory === c.slug ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <EmptyState
          title="No appliances found"
          description="No products match your current search or category filter."
          action={
            <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory(''); }}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Card key={p.id} className="overflow-hidden hover:shadow-xl transition group flex flex-col justify-between bg-white border-slate-200">
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
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {p.category?.name || 'Appliance'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.shortDescription || p.description}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <span className="text-base font-black text-slate-900">₹{Number(p.price)?.toLocaleString('en-IN')}</span>
                  <Link to={`/products/${p.id}`}>
                    <Button variant="ghost" className="text-xs font-bold text-brand-600 hover:bg-brand-50">
                      View Details <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-xs"
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-500 px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}

export default ProductsPage;
