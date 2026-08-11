import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Mail, CheckCircle } from 'lucide-react';

export function EnquiriesManagement() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await adminService.getEnquiries({ page: 1, limit: 20 });
      setEnquiries(res.data || []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateEnquiryStatus(id, { status: newStatus });
      toast.success(`Enquiry status updated to ${newStatus}`);
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to update enquiry status');
    }
  };

  return (
    <PageContainer
      title="Public Contact Inbox"
      subtitle="Review and resolve incoming messages from website visitors and prospective associates"
    >
      {loading ? (
        <div className="p-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Table
          headers={['NAME', 'EMAIL / PHONE', 'INQUIRY MESSAGE', 'DATE SUBMITTED', 'STATUS', 'ACTIONS']}
        >
          {enquiries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                No public contact inquiries currently in inbox.
              </td>
            </tr>
          ) : (
            enquiries.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-600" />
                    <span>{e.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-900 font-medium">{e.email}</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">{e.phone || 'No phone provided'}</p>
                </td>
                <td className="px-6 py-4 text-slate-700 max-w-sm">
                  <p className="line-clamp-2 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 font-medium">
                    "{e.message}"
                  </p>
                </td>
                <td className="px-6 py-4 text-slate-500 text-[11px]">
                  {new Date(e.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                      e.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : e.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      e.status === 'RESOLVED' ? 'bg-emerald-500' : e.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />
                    {e.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {e.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(e.id, 'RESOLVED')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-xl transition shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </Table>
      )}
    </PageContainer>
  );
}

export default EnquiriesManagement;
