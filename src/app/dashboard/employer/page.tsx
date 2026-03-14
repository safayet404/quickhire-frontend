'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, TrendingUp, Clock, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Job, EmployerStats } from '@/types';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import PostJobModal from '@/components/employer/PostJobModal';
import ApplicantsModal from '@/components/employer/ApplicantsModal';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function EmployerDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [applicantsJob, setApplicantsJob] = useState<Job | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!authLoading && user?.role !== 'employer') { router.push('/'); return; }
    if (user && token) fetchAll();
  }, [user, token, authLoading]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes] = await Promise.all([
        axios.get(`${API}/employer/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/employer/jobs`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data.data);
      setJobs(jobsRes.data.data);
    } catch {
      toast.error('Failed to load dashboard data.');
    } finally { setLoading(false); }
  };

  const handleToggle = async (job: Job) => {
    setTogglingId(job.id);
    try {
      const res = await axios.patch(`${API}/employer/jobs/${job.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_active: res.data.is_active } : j));
      setStats(prev => prev ? {
        ...prev,
        activeJobs: res.data.is_active ? prev.activeJobs + 1 : prev.activeJobs - 1,
      } : prev);
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update job status.');
    } finally { setTogglingId(null); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this job? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API}/employer/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setJobs(prev => prev.filter(j => j.id !== id));
      if (stats) setStats({ ...stats, totalJobs: stats.totalJobs - 1 });
      toast.success('Job deleted successfully.');
    } catch {
      toast.error('Failed to delete job.');
    } finally { setDeletingId(null); }
  };

  const onJobSaved = (job: Job, isEdit: boolean) => {
    if (isEdit) {
      setJobs(prev => prev.map(j => j.id === job.id ? job : j));
    } else {
      setJobs(prev => [job, ...prev]);
      if (stats) setStats({ ...stats, totalJobs: stats.totalJobs + 1, activeJobs: stats.activeJobs + 1 });
    }
    setShowPostJob(false);
    setEditJob(null);
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Jobs', value: stats?.totalJobs ?? 0, icon: Briefcase, color: '#4F46E5', bg: '#EEF2FF' },
    { label: 'Active Jobs', value: stats?.activeJobs ?? 0, icon: TrendingUp, color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Total Applicants', value: stats?.totalApplicants ?? 0, icon: Users, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Pending Review', value: stats?.pendingReview ?? 0, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '40px 0' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A2E' }}>Employer Dashboard</h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Manage your job listings and applicants</p>
          </div>
          <button onClick={() => setShowPostJob(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            <Plus size={16} /> Post a Job
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #F0F0F5' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={18} color={color} />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A2E' }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Jobs table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E' }}>Your Job Listings</h2>
            <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{jobs.length} total</span>
          </div>

          {jobs.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Briefcase size={40} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>No jobs posted yet.</p>
              <button onClick={() => setShowPostJob(true)} style={{ background: '#4F46E5', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 22px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={15} /> Post Your First Job
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F0F0F5' }}>
                  {['Job Title', 'Category', 'Type', 'Applicants', 'Posted', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #F9FAFB' }} className="hover:bg-gray-50">
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E' }}>{job.title}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{job.location}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B7280' }}>{job.category}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, background: '#EEF2FF', color: '#4F46E5', padding: '3px 10px', borderRadius: '999px' }}>{job.type}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => setApplicantsJob(job)} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <Users size={13} /> {job.applications_count ?? 0} <ChevronRight size={13} />
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#9CA3AF' }}>{formatDate(job.created_at)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => handleToggle(job)} disabled={togglingId === job.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: job.is_active ? '#16A34A' : '#9CA3AF', padding: 0 }}>
                        {job.is_active ? <ToggleRight size={18} color="#16A34A" /> : <ToggleLeft size={18} color="#9CA3AF" />}
                        {job.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => { setEditJob(job); setShowPostJob(true); }} style={{ padding: '6px', borderRadius: '7px', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', display: 'flex' }} title="Edit">
                          <Pencil size={14} color="#6B7280" />
                        </button>
                        <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id} style={{ padding: '6px', borderRadius: '7px', border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', display: 'flex' }} title="Delete">
                          <Trash2 size={14} color="#DC2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showPostJob && (
        <PostJobModal token={token!} job={editJob} onClose={() => { setShowPostJob(false); setEditJob(null); }} onSaved={onJobSaved} />
      )}
      {applicantsJob && (
        <ApplicantsModal token={token!} job={applicantsJob} onClose={() => setApplicantsJob(null)} />
      )}
    </div>
  );
}