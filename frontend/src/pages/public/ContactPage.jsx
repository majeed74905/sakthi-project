import React, { useState } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import * as publicService from '../../services/publicService';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

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
          <Card className="p-6 space-y-4 bg-slate-900 text-white border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white">Corporate Head Office</h3>
            <div className="space-y-4 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">My Sakthi Marketing</p>
                  <p className="text-slate-400 leading-relaxed">
                    Main Road, Coimbatore, Tamil Nadu, India - 641001
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Helpline</p>
                  <p className="text-slate-400">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Email Enquiries</p>
                  <p className="text-slate-400">info@mysakthimarketing.in</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8 bg-white border-slate-200">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-black text-slate-900">Enquiry Received!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Thank you for reaching out. Our associate support team will get back to you within 24 business hours.
                </p>
                <Button variant="brand" onClick={() => setSubmitted(false)} className="mt-4">
                  Send Another Message
                </Button>
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="Type your query or enquiry message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" variant="brand" disabled={submitting} className="w-full py-3 font-bold text-xs">
                  {submitting ? 'Submitting...' : 'Send Message'} <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default ContactPage;
