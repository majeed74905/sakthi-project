import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import * as publicService from '../../services/publicService';
import { getProductImage } from '../../utils/productImages';
import { Shield, Truck, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await publicService.getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} backUrl="/products" />;

  return (
    <PageContainer title={product.name} subtitle={`Category: ${product.category?.name || 'Home Appliance'}`}>
      <Link to="/products" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-brand-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <Card className="p-4 bg-white border-slate-200 flex items-center justify-center min-h-[400px] overflow-hidden">
          <img
            src={getProductImage(product.name, product.category?.name, product.images)}
            alt={product.name}
            className="max-h-[350px] w-full object-cover rounded-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getProductImage(product.name, product.category?.name);
            }}
          />
        </Card>

        {/* Product Info & Specifications */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              {product.category?.name || 'Home Appliance'}
            </span>
            <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
            <p className="text-2xl font-black text-slate-900 pt-2">
              ₹{product.price?.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="border-t border-b border-slate-200 py-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Product Description</h4>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Shield className="w-5 h-5 text-brand-600" />
              <div>
                <h5 className="font-bold text-slate-900 text-xs">Certified Quality</h5>
                <p className="text-[10px] text-slate-400">Manufactured for durability</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Truck className="w-5 h-5 text-emerald-600" />
              <div>
                <h5 className="font-bold text-slate-900 text-xs">Direct Supply</h5>
                <p className="text-[10px] text-slate-400">Fast delivery across South India</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link to="/contact">
              <Button variant="brand" className="w-full py-4 font-bold text-sm">
                <Mail className="w-4 h-4 mr-2" /> Submit Product Enquiry
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default ProductDetailPage;
