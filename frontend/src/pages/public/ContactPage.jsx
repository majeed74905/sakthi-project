import React, { useState } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import * as publicService from '../../services/publicService';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Globe, Send, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await publicService.submitEnquiry(formData);
      if (res.success) {
        toast.success('Your enquiry has been submitted!');
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer title="Contact Us" subtitle="Get in touch with My Sakthi Marketing support team">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Contact Info */}
        <div className="space-y-6">
          <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-sm rounded-3xl">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h3>
              <p className="text-sm font-bold text-slate-800 mt-3">My Sakthi Marketing</p>
            </div>

            <div className="space-y-5 text-sm text-slate-700 font-medium">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-slate-800 flex-shrink-0 mt-0.5" />
                <span className="text-slate-800 leading-relaxed font-medium">
                  No.2, venus Nagar 5th Street, Kolathur, Chennai - 600099.
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <Phone className="w-5 h-5 text-slate-800 flex-shrink-0" />
                <a href="tel:+917845601441" className="text-slate-800 font-medium hover:text-slate-900 transition">
                  +91 78456 01441
                </a>
              </div>

              <div className="flex items-start gap-3.5">
                <Globe className="w-5 h-5 text-slate-800 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a href="mailto:info@mysakthimarketing.in" className="text-slate-800 font-medium hover:text-slate-900 block transition">
                    info@mysakthimarketing.in
                  </a>
                  <a href="https://www.mysakthimarketing.in" target="_blank" rel="noopener noreferrer" className="text-slate-800 font-medium hover:text-slate-900 block transition">
                    www.mysakthimarketing.in
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8 sm:p-10 bg-white border border-slate-200 shadow-sm rounded-3xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-black text-slate-900">Enquiry Received!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Thank you for reaching out. Our associate support team will get back to you within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-3 bg-[#0B132B] hover:bg-[#162244] text-white font-semibold text-xs rounded-xl transition shadow-md"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Send Us a Direct Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />

                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Contact Phone Number"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message / Query *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition"
                    placeholder="Type your query or enquiry message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-[#0B132B] hover:bg-[#162244] text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default ContactPage;
