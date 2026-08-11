import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export function CmsPagesManagement() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [selectedSlug, setSelectedSlug] = useState('who-we-are');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCmsPages();
      const p = res.data || [];
      setPages(p);
      const activePage = p.find((item) => item.slug === selectedSlug);
      if (activePage) {
        setTitle(activePage.title);
        setContent(activePage.content);
      }
    } catch (err) {
      console.error('Failed to load CMS pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [selectedSlug]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and Content are required');
      return;
    }

    setSaving(true);
    try {
      await adminService.upsertCmsPage({
        slug: selectedSlug,
        title,
        content,
        isPublished: true
      });
      toast.success(`CMS page '${selectedSlug}' saved!`);
      fetchPages();
    } catch (err) {
      toast.error('Failed to save CMS page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer title="CMS Legal & Informational Pages" subtitle="Edit Terms & Conditions, Privacy Policy, and Who We Are text">
      <div className="flex gap-2 mb-6">
        {['who-we-are', 'terms', 'privacy'].map((slug) => (
          <button
            key={slug}
            onClick={() => setSelectedSlug(slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedSlug === slug ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {slug === 'who-we-are' ? 'Who We Are' : slug === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="p-8 bg-slate-800 border-slate-700 space-y-6 text-white">
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Page Header Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Page Content *</label>
              <textarea
                rows={12}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-rose-500 outline-none leading-relaxed"
                placeholder="Enter CMS page content text..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="brand" disabled={saving} className="font-bold text-xs">
              {saving ? 'Publishing...' : 'Publish Content Updates'}
            </Button>
          </form>
        </Card>
      )}
    </PageContainer>
  );
}

export default CmsPagesManagement;
