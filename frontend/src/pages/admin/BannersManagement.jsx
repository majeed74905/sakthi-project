import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Plus, Trash2, Image } from 'lucide-react';

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
    <PageContainer
      title="Hero Banner Slider CMS"
      subtitle="Upload and manage homepage promotional slider banners and messaging"
    >
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Promotional Sliders</h3>
          <p className="text-xs text-slate-500 font-medium">Total active banners: {banners.length}</p>
        </div>
        <Button variant="brand" onClick={() => setIsModalOpen(true)} className="text-xs font-semibold py-2.5 px-5">
          <Plus className="w-4 h-4 mr-2" /> Add Hero Banner
        </Button>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Table
          headers={['BANNER TITLE', 'SUBTITLE', 'DISPLAY ORDER', 'STATUS', 'ACTIONS']}
        >
          {banners.map((b) => (
            <tr key={b.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
              <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-slate-600" />
                  <span>{b.title}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{b.subtitle}</td>
              <td className="px-6 py-4 font-mono font-bold text-slate-800">{b.displayOrder}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {b.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow-sm"
                  title="Delete Banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Hero Banner">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-slate-800">
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
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs font-semibold">
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={submitting} className="text-xs font-bold uppercase tracking-wider px-6">
              {submitting ? 'Saving...' : 'Save Banner'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default BannersManagement;
