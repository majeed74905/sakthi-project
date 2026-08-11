import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export function BannersManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBanners();
      setBanners(res.data || []);
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subtitle) {
      toast.error('Title and Subtitle are required');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.createBanner({
        title,
        subtitle,
        imageUrl,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isActive: true
      });
      toast.success('Hero banner added');
      setIsModalOpen(false);
      setTitle('');
      setSubtitle('');
      setImageUrl('');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to add banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotional hero banner?')) return;
    try {
      await adminService.deleteBanner(id);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  return (
    <PageContainer title="Hero Banner Slider CMS" subtitle="Upload and manage homepage promotional slider banners">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white text-sm">Homepage Hero Sliders</h3>
        <Button variant="brand" onClick={() => setIsModalOpen(true)} className="text-xs font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add Hero Banner
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table headers={['Banner Title', 'Subtitle', 'Display Order', 'Status', 'Actions']}>
          {banners.map((b) => (
            <tr key={b.id} className="hover:bg-slate-800/50 border-b border-slate-800 text-xs text-slate-300">
              <td className="px-6 py-4 font-bold text-white">{b.title}</td>
              <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{b.subtitle}</td>
              <td className="px-6 py-4 font-mono text-slate-400">{b.displayOrder}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {b.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 bg-rose-900/50 text-rose-400 hover:bg-rose-800 rounded font-bold text-[10px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Hero Banner">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Banner Main Title *"
            placeholder="e.g. Empowering Quality Household Innovation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Subtitle / Description *"
            placeholder="e.g. Discover premium appliances designed for Indian homes"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
          />
          <Input
            label="Image URL (Optional)"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Input
            label="Display Order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />
          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Banner'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default BannersManagement;
