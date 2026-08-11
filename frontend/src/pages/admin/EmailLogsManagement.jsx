import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Table from '../../components/common/Table';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Mail, RefreshCw, Send, CheckCircle2, AlertCircle, Clock, Search, ShieldCheck } from 'lucide-react';

export function EmailLogsManagement() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [emailType, setEmailType] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals & Actions
  const [selectedLog, setSelectedLog] = useState(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState(null);

  const fetchEmailLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getEmailLogs({ page, limit: 10, status, emailType, search });
      setLogs(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setStats(res.pagination.stats || {});
      }
    } catch (err) {
      console.error('Failed to fetch email logs:', err);
      toast.error('Failed to load email delivery logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchSmtpStatus = async () => {
    try {
      const res = await adminService.getEmailStatus();
      setSmtpStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch SMTP diagnostics:', err);
    }
  };

  useEffect(() => {
    fetchEmailLogs();
    fetchSmtpStatus();
  }, [page, status, emailType, search]);

  const handleRetrySingle = async (logId) => {
    try {
      toast.loading('Retrying email delivery...', { id: 'retry-email' });
      const res = await adminService.retryEmail(logId);
      if (res.success && res.data?.success) {
        toast.success('Email resent successfully!', { id: 'retry-email' });
      } else {
        toast.error(`Retry failed: ${res.data?.error || 'SMTP delivery rejected'}`, { id: 'retry-email' });
      }
      fetchEmailLogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email retry failed', { id: 'retry-email' });
    }
  };

  const handleRetryAllFailed = async () => {
    if (!window.confirm('Are you sure you want to retry delivery for all failed emails?')) return;
    try {
      toast.loading('Processing bulk email retry...', { id: 'bulk-retry' });
      const res = await adminService.retryFailedEmails();
      toast.success(`Processed bulk retry for ${res.data?.processedCount || 0} failed email(s)`, { id: 'bulk-retry' });
      fetchEmailLogs();
    } catch (err) {
      toast.error('Bulk email retry failed', { id: 'bulk-retry' });
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testRecipient) return;

    setTestSending(true);
    try {
      const res = await adminService.sendTestEmail(testRecipient);
      if (res.success && res.data?.success) {
        toast.success(`Test email dispatched to ${testRecipient}`);
        setTestModalOpen(false);
        setTestRecipient('');
        fetchEmailLogs();
      } else {
        toast.error(`Test email failed: ${res.data?.error || 'SMTP error'}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch test email');
    } finally {
      setTestSending(false);
    }
  };

  return (
    <PageContainer title="Email Delivery & Failure Audit (Phase 10)" subtitle="Audit Nodemailer transactional logs, monitor SMTP connection health, and resend failed emails">
      {/* SMTP Connection Diagnostic Banner */}
      {smtpStatus && (
        <div className={`p-5 mb-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between border shadow-xl backdrop-blur-md gap-4 text-xs font-semibold ${
          smtpStatus.connection === 'healthy'
            ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
            : 'bg-amber-950/60 border-amber-800/80 text-amber-300'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">SMTP Connection Status: <span className="uppercase font-mono text-emerald-400">{smtpStatus.connection}</span></p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Host: {smtpStatus.host}:{smtpStatus.port} — Provider: {smtpStatus.provider}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setTestModalOpen(true)} className="text-xs font-bold border-emerald-700 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 py-2">
            <Send className="w-3.5 h-3.5 mr-1.5" /> Test SMTP Setup
          </Button>
        </div>
      )}

      {/* 5 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card variant="dark" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Emails</p>
              <h3 className="text-2xl font-black text-white mt-1">{stats.totalEmails || 0}</h3>
            </div>
            <Mail className="w-6 h-6 text-slate-400" />
          </div>
        </Card>

        <Card variant="dark" className="p-4 border-emerald-900/60 bg-emerald-950/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Sent Successfully</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats.sentCount || 0}</h3>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </Card>

        <Card variant="dark" className="p-4 border-rose-900/60 bg-rose-950/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Failed Delivery</p>
              <h3 className="text-2xl font-black text-rose-400 mt-1">{stats.failedCount || 0}</h3>
            </div>
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
        </Card>

        <Card variant="dark" className="p-4 border-amber-900/60 bg-amber-950/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{stats.pendingCount || 0}</h3>
            </div>
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </Card>

        <Card variant="dark" className="p-4 border-sky-900/60 bg-sky-950/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Retrying</p>
              <h3 className="text-2xl font-black text-sky-400 mt-1">{stats.retryingCount || 0}</h3>
            </div>
            <RefreshCw className="w-6 h-6 text-sky-400" />
          </div>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <Input
            variant="dark"
            placeholder="Search Recipient, Subject, Code..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={Search}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {[
              { label: 'All Status', value: '' },
              { label: 'SENT', value: 'SENT' },
              { label: 'FAILED', value: 'FAILED' },
              { label: 'PENDING', value: 'PENDING' },
              { label: 'RETRYING', value: 'RETRYING' }
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => { setStatus(s.value); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  status === s.value
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 border border-rose-500/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {stats.failedCount > 0 && (
            <Button variant="accent" onClick={handleRetryAllFailed} className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white py-1.5 px-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry All Failed ({stats.failedCount})
            </Button>
          )}
        </div>
      </div>

      {/* Email Logs Table */}
      {loading ? (
        <div className="p-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6">
          <Table
            variant="dark"
            headers={['RECIPIENT', 'SUBJECT', 'EMAIL TYPE', 'STATUS', 'ATTEMPTS', 'LAST ATTEMPT', 'ACTIONS']}
          >
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No email delivery logs matching your filter criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/60 transition-colors border-b border-slate-800/60 text-xs">
                  <td className="px-6 py-4 font-mono font-bold text-white text-xs">{log.recipient}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{log.subject}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                      {log.emailType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        log.status === 'SENT'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.status === 'FAILED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : log.status === 'RETRYING'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'SENT' ? 'bg-emerald-400' : log.status === 'FAILED' ? 'bg-rose-400' : log.status === 'RETRYING' ? 'bg-sky-400' : 'bg-amber-400'
                      }`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-300 font-mono">{log.attemptCount}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                    {log.lastAttemptAt ? new Date(log.lastAttemptAt).toLocaleString('en-IN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl font-bold text-[11px] transition border border-slate-700"
                      >
                        Details
                      </button>
                      {log.status === 'FAILED' && (
                        <button
                          onClick={() => handleRetrySingle(log.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-[11px] transition shadow-md"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Retry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 bg-slate-900/90 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 font-mono">
                Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-xs font-bold text-slate-300 border-slate-700 bg-slate-950 hover:bg-slate-800 py-1.5"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="text-xs font-bold text-slate-300 border-slate-700 bg-slate-950 hover:bg-slate-800 py-1.5"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Log Details Modal */}
      <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Email Delivery Audit Details">
        <div className="space-y-4 text-xs text-slate-200">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 font-mono">
            <p><strong className="text-white">Log ID:</strong> {selectedLog?.id}</p>
            <p><strong className="text-white">Recipient:</strong> {selectedLog?.recipient}</p>
            <p><strong className="text-white">Subject:</strong> {selectedLog?.subject}</p>
            <p><strong className="text-white">Email Type:</strong> {selectedLog?.emailType}</p>
            <p><strong className="text-white">Delivery Status:</strong> {selectedLog?.status}</p>
            <p><strong className="text-white">Attempts:</strong> {selectedLog?.attemptCount}</p>
            <p><strong className="text-white">Sent At:</strong> {selectedLog?.sentAt ? new Date(selectedLog.sentAt).toLocaleString('en-IN') : 'N/A'}</p>
          </div>

          {selectedLog?.status === 'FAILED' && (
            <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-2xl space-y-2 text-rose-300">
              <p className="font-bold uppercase text-[10px] tracking-wider text-rose-400">Sanitized Failure Diagnostics</p>
              <p><strong className="text-white">Error Code:</strong> {selectedLog.errorCode || 'UNKNOWN_ERROR'}</p>
              <p className="text-xs font-mono break-all"><strong className="text-white">Error Message:</strong> {selectedLog.errorMessage || 'SMTP connection rejected'}</p>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedLog(null)} className="text-xs font-bold border-slate-700 bg-slate-900 text-slate-300">
              Close
            </Button>
            {selectedLog?.status === 'FAILED' && (
              <Button
                variant="accent"
                onClick={() => {
                  const id = selectedLog.id;
                  setSelectedLog(null);
                  handleRetrySingle(id);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider px-5"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry Delivery Now
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Test SMTP Setup Modal */}
      <Modal isOpen={testModalOpen} onClose={() => setTestModalOpen(false)} title="Test Nodemailer SMTP Setup">
        <form onSubmit={handleSendTestEmail} className="space-y-4 text-slate-200">
          <p className="text-xs text-slate-400">
            Dispatch a test email to verify your SMTP server parameters (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`).
          </p>
          <Input
            variant="dark"
            label="Recipient Email Address *"
            type="email"
            placeholder="e.g. admin@mysakthimarketing.in"
            value={testRecipient}
            onChange={(e) => setTestRecipient(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setTestModalOpen(false)} className="text-xs font-bold border-slate-700 bg-slate-900 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={testSending} className="text-xs font-bold uppercase tracking-wider px-6">
              {testSending ? 'Dispatching...' : 'Send Test Email'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default EmailLogsManagement;
