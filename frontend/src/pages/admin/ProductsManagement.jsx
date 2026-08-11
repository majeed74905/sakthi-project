import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Package, Plus, Trash2, Edit } from 'lucide-react';

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
    <PageContainer title="Product Catalogue CMS" subtitle="Create, edit, and manage household appliances catalogue">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white text-sm">Listed Appliance Items</h3>
        <Button variant="brand" onClick={handleOpenAdd} className="text-xs font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add New Appliance
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table headers={['Product Name', 'Category', 'Price (₹)', 'Stock', 'Featured', 'Actions']}>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-slate-800/50 border-b border-slate-800 text-xs text-slate-300">
              <td className="px-6 py-4 font-bold text-white">{p.name}</td>
              <td className="px-6 py-4 text-slate-400">{p.category?.name}</td>
              <td className="px-6 py-4 font-black text-amber-400">₹{p.price?.toLocaleString('en-IN')}</td>
              <td className="px-6 py-4 font-mono text-slate-400">{p.stock}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.isFeatured ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-500'}`}>
                  {p.isFeatured ? 'YES' : 'NO'}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-1.5 bg-rose-900/50 text-rose-400 hover:bg-rose-800 rounded font-bold text-[10px]"
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
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Appliance Name *"
            placeholder="e.g. Sakthi Multi-Grind Mixer 750W"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Category *</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
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

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Description *</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
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
              className="w-4 h-4 text-brand-600 rounded"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700">
              Display as Featured Product on Homepage
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Appliance'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default ProductsManagement;
