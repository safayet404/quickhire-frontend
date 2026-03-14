'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  Briefcase, Bookmark, CheckCircle, Clock, ArrowRight,
  User, FileText, Eye, XCircle, TrendingUp, MapPin, DollarSign,
} from 'lucide-react';
import { formatDate, formatSalary, getCompanyInitials, getCompanyColor } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB', icon: Clock },
  reviewed: { label: 'Reviewed', color: '#2563EB', bg: '#EFF6FF', icon: Eye },
  accepted: { label: 'Accepted', color: '#16A34A', bg: '#F0FDF4', icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2', icon: XCircle },
};

interface ProfileCompletion {
  score: number;
  missing: string[];
}

function getProfileCompletion(profile: any, user: any): ProfileCompletion {
  const checks = [
    { key: 'headline', label: 'Add a headline', done: !!profile?.headline },
    { key: 'bio', label: 'Write a bio', done: !!profile?.bio },
    { key: 'location', label: 'Add your location', done: !!profile?.location },
    { key: 'resume_url', label: 'Upload resume link', done: !!profile?.resume_url },
    { key: 'skills', label: 'Add skills', done: profile?.skills?.length > 0 },
    { key: 'experience', label: 'Add work experience', done: profile?.experience?.length > 0 },
    { key: 'education', label: 'Add education', done: profile?.education?.length > 0 },
    { key: 'linkedin', label: 'Add LinkedIn', done: !!profile?.linkedin },
  ];
  const done = checks.filter(c => c.done).length;
  const missing = checks.filter(c => !c.done).map(c => c.label);
  return { score: Math.round((done / checks.length) * 100), missing };
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!authLoading && user?.role === 'employer') { router.push('/dashboard/employer'); return; }
    if (!authLoading && user?.role === 'admin') { router.push('/admin'); return; }
    if (user && token) fetchAll();
  }, [user, token, authLoading]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [profileRes, appsRes, savedRes] = await Promise.all([
        axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/seeker/applications`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/saved-jobs`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProfile(profileRes.data.profile);
      setApplications(appsRes.data.data || []);
      setSavedJobs(savedRes.data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Loading your dashboard...</p>
      </div>
    );
  }

  const completion = getProfileCompletion(profile, user);

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    saved: savedJobs.length,
  };

  const recentApps = applications.slice(0, 5);
  const recentSaved = savedJobs.slice(0, 3);

  const card = {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #F0F0F5',
    padding: '24px',
  };

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '40px 0' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A2E' }}>
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>
            Here's what's happening with your job search.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Applied', value: stats.total, icon: Briefcase, color: '#4F46E5', bg: '#EEF2FF' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
            { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Saved Jobs', value: stats.saved, icon: Bookmark, color: '#2563EB', bg: '#EFF6FF' },
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Recent Applications */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E' }}>Recent Applications</h2>
                <Link href="/applications" style={{ fontSize: '13px', color: '#4F46E5', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View all <ArrowRight size={13} />
                </Link>
              </div>

              {recentApps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <Briefcase size={36} style={{ color: '#E5E7EB', margin: '0 auto 12px' }} />
                  <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>You haven't applied to any jobs yet.</p>
                  <Link href="/jobs" style={{ background: '#4F46E5', color: 'white', padding: '9px 20px', borderRadius: '9px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentApps.map(app => {
                    const sc = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                    const Icon = sc.icon;
                    return (
                      <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '12px', border: '1px solid #F0F0F5' }}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getCompanyColor(app.job?.company || '')}`}>
                          {getCompanyInitials(app.job?.company || '?')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {app.job?.title || 'Unknown Position'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                            {app.job?.company} · {formatDate(app.created_at)}
                          </div>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: sc.bg, color: sc.color, fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px', flexShrink: 0 }}>
                          <Icon size={11} /> {sc.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Saved Jobs preview */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E' }}>Saved Jobs</h2>
                <Link href="/saved-jobs" style={{ fontSize: '13px', color: '#4F46E5', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View all <ArrowRight size={13} />
                </Link>
              </div>

              {recentSaved.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <Bookmark size={36} style={{ color: '#E5E7EB', margin: '0 auto 12px' }} />
                  <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>No saved jobs yet.</p>
                  <Link href="/jobs" style={{ background: '#4F46E5', color: 'white', padding: '9px 20px', borderRadius: '9px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentSaved.map(({ job_id, job }) => (
                    <Link key={job_id} href={`/jobs/${job_id}`} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '12px', border: '1px solid #F0F0F5', textDecoration: 'none' }} className="hover:bg-gray-50">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getCompanyColor(job?.company || '')}`}>
                        {getCompanyInitials(job?.company || '?')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {job?.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', gap: '8px', marginTop: '2px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={10} /> {job?.location}</span>
                          {(job?.salary_min || job?.salary_max) && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><DollarSign size={10} /> {formatSalary(job?.salary_min ?? undefined, job?.salary_max ?? undefined)}</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight size={14} color="#9CA3AF" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Profile completion */}
            <div style={card}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E', marginBottom: '16px' }}>Profile Strength</h2>

              {/* Progress bar */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Completion</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: completion.score >= 80 ? '#16A34A' : completion.score >= 50 ? '#D97706' : '#DC2626' }}>
                    {completion.score}%
                  </span>
                </div>
                <div style={{ height: '8px', background: '#F0F0F5', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${completion.score}%`,
                    borderRadius: '999px',
                    background: completion.score >= 80 ? '#16A34A' : completion.score >= 50 ? '#F59E0B' : '#4F46E5',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>

              {completion.score === 100 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                  <CheckCircle size={16} color="#16A34A" />
                  <span style={{ fontSize: '13px', color: '#16A34A', fontWeight: 500 }}>Your profile is complete!</span>
                </div>
              ) : (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>Missing:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {completion.missing.slice(0, 4).map(m => (
                      <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#6B7280' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#D1D5DB', flexShrink: 0 }} />
                        {m}
                      </div>
                    ))}
                    {completion.missing.length > 4 && (
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>+{completion.missing.length - 4} more</div>
                    )}
                  </div>
                </div>
              )}

              <Link href="/profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#4F46E5', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                <User size={14} /> {completion.score === 100 ? 'View Profile' : 'Complete Profile'}
              </Link>
            </div>

            {/* Quick actions */}
            <div style={card}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E', marginBottom: '16px' }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/jobs', icon: Briefcase, label: 'Browse Jobs', color: '#4F46E5', bg: '#EEF2FF' },
                  { href: '/applications', icon: FileText, label: 'My Applications', color: '#2563EB', bg: '#EFF6FF' },
                  { href: '/saved-jobs', icon: Bookmark, label: 'Saved Jobs', color: '#D97706', bg: '#FFFBEB' },
                  { href: '/profile', icon: User, label: 'Edit Profile', color: '#16A34A', bg: '#F0FDF4' },
                ].map(({ href, icon: Icon, label, color, bg }) => (
                  <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', border: '1px solid #F0F0F5', textDecoration: 'none', transition: 'background 0.15s' }} className="hover:bg-gray-50">
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={color} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>{label}</span>
                    <ArrowRight size={14} color="#D1D5DB" style={{ marginLeft: 'auto' }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Open to work toggle */}
            <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E' }}>Open to Work</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                  {profile?.open_to_work ? 'Visible to employers' : 'Hidden from employers'}
                </div>
              </div>
              <div style={{
                width: '44px', height: '24px', borderRadius: '999px',
                background: profile?.open_to_work ? '#4F46E5' : '#E5E7EB',
                position: 'relative', cursor: 'pointer', flexShrink: 0,
              }}
                onClick={async () => {
                  try {
                    const res = await axios.put(`${API}/profile`,
                      { open_to_work: !profile?.open_to_work },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setProfile(res.data.profile);
                  } catch { }
                }}
              >
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                  position: 'absolute', top: '3px',
                  left: profile?.open_to_work ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
