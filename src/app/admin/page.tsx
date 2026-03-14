'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import axios from 'axios';
import {
  Users, Briefcase, FileText, TrendingUp, Trash2,
  ToggleLeft, ToggleRight, Shield, Search, Eye,
  CheckCircle, XCircle, Clock, ChevronDown
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { JOB_TYPES } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

type Tab = 'overview' | 'users' | 'jobs' | 'applications';

const ROLE_CONFIG = {
  seeker: { bg: '#EEF2FF', color: '#4F46E5' },
  employer: { bg: '#F0FDF4', color: '#16A34A' },
  admin: { bg: '#FEF2F2', color: '#DC2626' },
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB', icon: Clock },
  reviewed: { label: 'Reviewed', color: '#2563EB', bg: '#EFF6FF', icon: Eye },
  accepted: { label: 'Accepted', color: '#16A34A', bg: '#F0FDF4', icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2', icon: XCircle },
};

export default function AdminPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // search / filter
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [appStatus, setAppStatus] = useState('');

  // action states
  const [deletingUser, setDeletingUser] = useState<number | null>(null);
  const [deletingJob, setDeletingJob] = useState<number | null>(null);
  const [deletingApp, setDeletingApp] = useState<number | null>(null);
  const [togglingJob, setTogglingJob] = useState<number | null>(null);
  const [updatingRole, setUpdatingRole] = useState<number | null>(null);
  const [updatingApp, setUpdatingApp] = useState<number | null>(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!authLoading && user?.role !== 'admin') { router.push('/'); return; }
    if (user && token) fetchAll();
  }, [user, token, authLoading]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, u, j, a] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/admin/users`, { headers }),
        axios.get(`${API}/admin/jobs`, { headers }),
        axios.get(`${API}/admin/applications`, { headers }),
      ]);
      setStats(s.data.data);
      setUsers(u.data.data);
      setJobs(j.data.data);
      setApps(a.data.data);
    } catch { toast.error('Failed to load admin data.'); }
    finally { setLoading(false); }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, { headers, params: { search: userSearch, role: userRole } });
      setUsers(res.data.data);
    } catch { toast.error('Failed to load users.'); }
  }, [userSearch, userRole, token]);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/jobs`, { headers, params: { search: jobSearch, status: jobStatus } });
      setJobs(res.data.data);
    } catch { toast.error('Failed to load jobs.'); }
  }, [jobSearch, jobStatus, token]);

  const fetchApps = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/applications`, { headers, params: { status: appStatus } });
      setApps(res.data.data);
    } catch { toast.error('Failed to load applications.'); }
  }, [appStatus, token]);

  useEffect(() => { if (token) fetchUsers(); }, [userSearch, userRole]);
  useEffect(() => { if (token) fetchJobs(); }, [jobSearch, jobStatus]);
  useEffect(() => { if (token) fetchApps(); }, [appStatus]);

  // ── User actions ─────────────────────────────────────────────
  const handleRoleChange = async (id: number, role: string) => {
    setUpdatingRole(id);
    try {
      await axios.patch(`${API}/admin/users/${id}/role`, { role }, { headers });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      toast.success('User role updated.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role.');
    } finally { setUpdatingRole(null); }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Delete this user? All their data will be removed.')) return;
    setDeletingUser(id);
    try {
      await axios.delete(`${API}/admin/users/${id}`, { headers });
      setUsers(prev => prev.filter(u => u.id !== id));
      if (stats) setStats({ ...stats, total_users: stats.total_users - 1 });
      toast.success('User deleted.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    } finally { setDeletingUser(null); }
  };

  // ── Job actions ──────────────────────────────────────────────
  const handleToggleJob = async (job: any) => {
    setTogglingJob(job.id);
    try {
      const res = await axios.patch(`${API}/admin/jobs/${job.id}/toggle`, {}, { headers });
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_active: res.data.is_active } : j));
      toast.success(res.data.message);
    } catch { toast.error('Failed to toggle job.'); }
    finally { setTogglingJob(null); }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Delete this job and all its applications?')) return;
    setDeletingJob(id);
    try {
      await axios.delete(`${API}/admin/jobs/${id}`, { headers });
      setJobs(prev => prev.filter(j => j.id !== id));
      if (stats) setStats({ ...stats, total_jobs: stats.total_jobs - 1 });
      toast.success('Job deleted.');
    } catch { toast.error('Failed to delete job.'); }
    finally { setDeletingJob(null); }
  };

  // ── Application actions ───────────────────────────────────────
  const handleAppStatus = async (id: number, status: string) => {
    setUpdatingApp(id);
    try {
      await axios.patch(`${API}/admin/applications/${id}/status`, { status }, { headers });
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success('Status updated.');
    } catch { toast.error('Failed to update status.'); }
    finally { setUpdatingApp(null); }
  };

  const handleDeleteApp = async (id: number) => {
    if (!confirm('Delete this application?')) return;
    setDeletingApp(id);
    try {
      await axios.delete(`${API}/admin/applications/${id}`, { headers });
      setApps(prev => prev.filter(a => a.id !== id));
      toast.success('Application deleted.');
    } catch { toast.error('Failed to delete application.'); }
    finally { setDeletingApp(null); }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Loading admin panel...</p>
      </div>
    );
  }

  const card = { background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', padding: '24px' };
  const th = { padding: '12px 16px', textAlign: 'left' as const, fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #F0F0F5' };
  const td = { padding: '13px 16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #F9FAFB' };
  const inp = { padding: '9px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'white' };
  const tabBt = (t: Tab) => ({
    padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
    background: tab === t ? '#4F46E5' : 'transparent',
    color: tab === t ? 'white' : '#6B7280',
  });

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: TrendingUp },
    { key: 'users', label: `Users (${stats?.total_users ?? 0})`, icon: Users },
    { key: 'jobs', label: `Jobs (${stats?.total_jobs ?? 0})`, icon: Briefcase },
    { key: 'applications', label: `Applications (${stats?.total_applications ?? 0})`, icon: FileText },
  ];

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #F0F0F5', padding: '24px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', background: '#FEF2F2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="#DC2626" />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A2E' }}>Admin Panel</h1>
              <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Full platform control</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)} style={tabBt(key)}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} /> {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '32px 16px' }}>

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {tab === 'overview' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Users', value: stats.total_users, icon: Users, color: '#4F46E5', bg: '#EEF2FF' },
                { label: 'Total Jobs', value: stats.total_jobs, icon: Briefcase, color: '#16A34A', bg: '#F0FDF4' },
                { label: 'Applications', value: stats.total_applications, icon: FileText, color: '#2563EB', bg: '#EFF6FF' },
                { label: 'Pending Review', value: stats.pending_apps, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} style={card}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div style={{ fontSize: '30px', fontWeight: 700, color: '#1A1A2E' }}>{value}</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* User breakdown */}
              <div style={card}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', marginBottom: '16px' }}>User Breakdown</h3>
                {[
                  { role: 'Seekers', value: stats.total_seekers, color: '#4F46E5' },
                  { role: 'Employers', value: stats.total_employers, color: '#16A34A' },
                  { role: 'Admins', value: stats.total_users - stats.total_seekers - stats.total_employers, color: '#DC2626' },
                ].map(({ role, value, color }) => (
                  <div key={role} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>{role}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '120px', height: '6px', background: '#F0F0F5', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.round((value / stats.total_users) * 100)}%`, background: color, borderRadius: '999px' }} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E', minWidth: '24px', textAlign: 'right' }}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Application breakdown */}
              <div style={card}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', marginBottom: '16px' }}>Application Status</h3>
                {[
                  { label: 'Pending', value: stats.pending_apps, color: '#D97706' },
                  { label: 'Accepted', value: stats.accepted_apps, color: '#16A34A' },
                  { label: 'Others', value: stats.total_applications - stats.pending_apps - stats.accepted_apps, color: '#9CA3AF' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '120px', height: '6px', background: '#F0F0F5', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${stats.total_applications ? Math.round((value / stats.total_applications) * 100) : 0}%`, background: color, borderRadius: '999px' }} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E', minWidth: '24px', textAlign: 'right' }}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ────────────────────────────────────────────── */}
        {tab === 'users' && (
          <div style={card}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email..." style={{ ...inp, paddingLeft: '34px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <select value={userRole} onChange={e => setUserRole(e.target.value)} style={{ ...inp, minWidth: '140px' }}>
                <option value="">All Roles</option>
                <option value="seeker">Seeker</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['User', 'Role', 'Jobs Posted', 'Applications', 'Joined', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const rc = ROLE_CONFIG[u.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.seeker;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{u.name[0].toUpperCase()}</span>
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E' }}>{u.name}</div>
                            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={td}>
                        <select
                          value={u.role}
                          disabled={updatingRole === u.id || u.id === user?.id}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          style={{ fontSize: '12px', fontWeight: 600, padding: '4px 8px', borderRadius: '999px', border: 'none', background: rc.bg, color: rc.color, cursor: 'pointer', outline: 'none' }}
                        >
                          <option value="seeker">Seeker</option>
                          <option value="employer">Employer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={td}>{u.job_listings_count ?? 0}</td>
                      <td style={td}>{u.applications_count ?? 0}</td>
                      <td style={{ ...td, color: '#9CA3AF' }}>{formatDate(u.created_at)}</td>
                      <td style={td}>
                        {u.id !== user?.id && u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u.id)} disabled={deletingUser === u.id} style={{ padding: '6px', borderRadius: '7px', border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', display: 'flex' }}>
                            <Trash2 size={14} color="#DC2626" />
                          </button>
                        )}
                        {u.id === user?.id && <span style={{ fontSize: '12px', color: '#9CA3AF' }}>You</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {users.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: '14px' }}>No users found.</p>}
          </div>
        )}

        {/* ── JOBS ─────────────────────────────────────────────── */}
        {tab === 'jobs' && (
          <div style={card}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input value={jobSearch} onChange={e => setJobSearch(e.target.value)} placeholder="Search by title or company..." style={{ ...inp, paddingLeft: '34px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <select value={jobStatus} onChange={e => setJobStatus(e.target.value)} style={{ ...inp, minWidth: '140px' }}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Job', 'Type', 'Applicants', 'Posted', 'Status', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td style={td}>
                      <div style={{ fontWeight: 600, color: '#1A1A2E' }}>{job.title}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{job.company} · {job.location}</div>
                    </td>
                    <td style={td}>
                      <span style={{ fontSize: '12px', fontWeight: 500, background: '#EEF2FF', color: '#4F46E5', padding: '3px 10px', borderRadius: '999px' }}>{JOB_TYPES[job.type] || job.type}</span>
                    </td>
                    <td style={td}>{job.applications_count ?? 0}</td>
                    <td style={{ ...td, color: '#9CA3AF' }}>{formatDate(job.created_at)}</td>
                    <td style={td}>
                      <button onClick={() => handleToggleJob(job)} disabled={togglingJob === job.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: job.is_active ? '#16A34A' : '#9CA3AF', padding: 0 }}>
                        {job.is_active ? <ToggleRight size={18} color="#16A34A" /> : <ToggleLeft size={18} color="#9CA3AF" />}
                        {job.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link href={`/jobs/${job.id}`} style={{ padding: '6px', borderRadius: '7px', border: '1px solid #E5E7EB', background: 'white', display: 'flex' }} title="View">
                          <Eye size={14} color="#6B7280" />
                        </Link>
                        <button onClick={() => handleDeleteJob(job.id)} disabled={deletingJob === job.id} style={{ padding: '6px', borderRadius: '7px', border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', display: 'flex' }}>
                          <Trash2 size={14} color="#DC2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: '14px' }}>No jobs found.</p>}
          </div>
        )}

        {/* ── APPLICATIONS ─────────────────────────────────────── */}
        {tab === 'applications' && (
          <div style={card}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <select value={appStatus} onChange={e => setAppStatus(e.target.value)} style={{ ...inp, minWidth: '160px' }}>
                <option value="">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <span style={{ fontSize: '13px', color: '#9CA3AF', alignSelf: 'center' }}>{apps.length} results</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Applicant', 'Job', 'Status', 'Applied', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {apps.map(app => {
                  const sc = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                  const Icon = sc.icon;
                  return (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td style={td}>
                        <div style={{ fontWeight: 600, color: '#1A1A2E' }}>{app.name}</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{app.email}</div>
                      </td>
                      <td style={td}>
                        {app.job ? (
                          <div>
                            <Link href={`/jobs/${app.job_id}`} style={{ fontWeight: 500, color: '#4F46E5', textDecoration: 'none', fontSize: '13px' }}>{app.job.title}</Link>
                            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{app.job.company}</div>
                          </div>
                        ) : <span style={{ color: '#9CA3AF', fontSize: '13px' }}>—</span>}
                      </td>
                      <td style={td}>
                        <select
                          value={app.status}
                          disabled={updatingApp === app.id}
                          onChange={e => handleAppStatus(app.id, e.target.value)}
                          style={{ fontSize: '12px', fontWeight: 600, padding: '4px 8px', borderRadius: '999px', border: 'none', background: sc.bg, color: sc.color, cursor: 'pointer', outline: 'none' }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td style={{ ...td, color: '#9CA3AF' }}>{formatDate(app.created_at)}</td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <a href={app.resume_link} target="_blank" rel="noopener noreferrer" style={{ padding: '6px', borderRadius: '7px', border: '1px solid #E5E7EB', background: 'white', display: 'flex' }} title="Resume">
                            <Eye size={14} color="#6B7280" />
                          </a>
                          <button onClick={() => handleDeleteApp(app.id)} disabled={deletingApp === app.id} style={{ padding: '6px', borderRadius: '7px', border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', display: 'flex' }}>
                            <Trash2 size={14} color="#DC2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {apps.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: '14px' }}>No applications found.</p>}
          </div>
        )}

      </div>
    </div>
  );
}
