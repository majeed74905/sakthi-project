import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { FileText, Save } from 'lucide-react';

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
    <PageContainer
      variant="dark"
      title="CMS Content & Legal Governance"
      subtitle="Manage static content pages for Who We Are, Terms & Conditions, and Privacy Policy"
    >
      {/* Slug Selection Pills */}
      <div className="p-4 bg-[#0D121F] rounded-2xl border border-slate-800/80 shadow-xl mb-6 flex flex-wrap gap-3">
        {[
          { slug: 'who-we-are', label: 'Who We Are' },
          { slug: 'terms', label: 'Terms & Conditions' },
          { slug: 'privacy', label: 'Privacy Policy' }
        ].map((item) => (
          <button
            key={item.slug}
            onClick={() => setSelectedSlug(item.slug)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              selectedSlug === item.slug
                ? 'bg-indigo-600 text-white border border-indigo-500'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            {item.label}
          </button>

        ))}
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Card variant="dark" className="p-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-5 text-slate-200">
            <Input
              variant="dark"
              label="Page Header Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Page Body Content (Markdown / HTML) *</label>
              <textarea
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed font-mono"
                placeholder="Enter CMS page content text..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="brand" disabled={saving} className="text-xs font-bold uppercase tracking-wider py-3 px-6">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Publishing...' : 'Publish Content Updates'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </PageContainer>
  );
}

export default CmsPagesManagement;
