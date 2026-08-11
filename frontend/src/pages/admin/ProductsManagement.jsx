import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Package, Plus, Trash2 } from 'lucide-react';

export function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        adminService.getProducts({ limit: 50 }),
        adminService.getCategories()
      ]);
      setProducts(pRes.data || []);
      setCategories(cRes.data || []);
      if (cRes.data && cRes.data.length > 0 && !categoryId) {
        setCategoryId(cRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load products/categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setStock('10');
    setDescription('');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !categoryId || !description) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        categoryId,
        price: parseFloat(price),
        stock: parseInt(stock, 10) || 0,
        description,
        isFeatured
      };

      if (editingId) {
        await adminService.updateProduct(editingId, payload);
        toast.success('Product updated successfully!');
      } else {
        await adminService.createProduct(payload);
        toast.success('Product created successfully!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, prodName) => {
    if (!window.confirm(`Are you sure you want to delete '${prodName}'?`)) return;
    try {
      await adminService.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <PageContainer
      title="Product Catalogue Governance"
      subtitle="Manage household appliance inventory items, categories, pricing, and homepage features"
    >
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Appliance Inventory List</h3>
          <p className="text-xs text-slate-500 font-medium">Total active products: {products.length}</p>
        </div>
        <Button variant="brand" onClick={handleOpenAdd} className="text-xs font-semibold py-2.5 px-5">
          <Plus className="w-4 h-4 mr-2" /> Add New Appliance
        </Button>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Table
          headers={['PRODUCT NAME', 'CATEGORY', 'PRICE (₹)', 'STOCK COUNT', 'FEATURED', 'ACTIONS']}
        >
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
              <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-700">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-900 block font-bold">{p.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">ID: {p.id.slice(-8)}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-slate-700">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                  {p.category?.name || 'Uncategorized'}
                </span>
              </td>
              <td className="px-6 py-4 font-extrabold text-slate-900 text-base">
                ₹{p.price?.toLocaleString('en-IN')}
              </td>
              <td className="px-6 py-4 font-mono font-bold text-slate-700">
                {p.stock} units
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  p.isFeatured
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {p.isFeatured ? 'FEATURED' : 'STANDARD'}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow-sm"
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Product' : 'Add New Appliance'}>
        <form onSubmit={handleFormSubmit} className="space-y-4 text-slate-800">
          <Input
            label="Appliance Name *"
            placeholder="e.g. Sakthi Multi-Grind Mixer 750W"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category *</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹) *"
              type="number"
              placeholder="e.g. 4999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Stock Count"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description *</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="Enter appliance specifications & features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-slate-900 rounded border-slate-300"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700">
              Display as Featured Product on Homepage
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs font-semibold">
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={submitting} className="text-xs font-bold uppercase tracking-wider px-6">
              {submitting ? 'Saving...' : 'Save Appliance'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default ProductsManagement;
