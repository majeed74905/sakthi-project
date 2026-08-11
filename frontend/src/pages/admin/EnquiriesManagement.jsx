import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, MessageSquare } from 'lucide-react';

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
    <PageContainer title="Public Contact Inbox" subtitle="Review and resolve incoming messages from website visitors and prospective associates">
      {loading ? (
        <div className="p-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Table
          variant="dark"
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
              <tr key={e.id} className="hover:bg-slate-800/60 transition-colors border-b border-slate-800/60 text-xs">
                <td className="px-6 py-4 font-bold text-white text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>{e.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-200 font-medium">{e.email}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{e.phone || 'No phone provided'}</p>
                </td>
                <td className="px-6 py-4 text-slate-300 max-w-sm">
                  <p className="line-clamp-2 text-xs leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-mono text-[11px]">
                    "{e.message}"
                  </p>
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                  {new Date(e.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      e.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : e.status === 'IN_PROGRESS'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      e.status === 'RESOLVED' ? 'bg-emerald-400' : e.status === 'IN_PROGRESS' ? 'bg-sky-400' : 'bg-amber-400'
                    }`} />
                    {e.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {e.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(e.id, 'RESOLVED')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl transition shadow-md"
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
