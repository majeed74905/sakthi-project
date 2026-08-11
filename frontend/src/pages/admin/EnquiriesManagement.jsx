import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

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
    <PageContainer title="Contact Enquiry Inbox" subtitle="Public website contact submissions inbox">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table headers={['Name', 'Email / Phone', 'Message', 'Date Submitted', 'Status', 'Actions']}>
          {enquiries.map((e) => (
            <tr key={e.id} className="hover:bg-slate-800/50 border-b border-slate-800 text-xs text-slate-300">
              <td className="px-6 py-4 font-bold text-white">{e.name}</td>
              <td className="px-6 py-4 text-slate-400">
                <p>{e.email}</p>
                <p className="text-[10px] text-slate-500">{e.phone}</p>
              </td>
              <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{e.message}</td>
              <td className="px-6 py-4 text-slate-500">{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    e.status === 'RESOLVED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : e.status === 'IN_PROGRESS'
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {e.status}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                {e.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleStatusChange(e.id, 'RESOLVED')}
                    className="px-2 py-1 bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800 rounded font-bold text-[10px]"
                  >
                    Mark Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </PageContainer>
  );
}

export default EnquiriesManagement;
