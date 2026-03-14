'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Clock, CheckCircle, XCircle, Eye, ArrowRight, FileText } from 'lucide-react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: 'Pending', color: '#D97706', bg: '#FFFBEB', icon: Clock },
    reviewed: { label: 'Reviewed', color: '#2563EB', bg: '#EFF6FF', icon: Eye },
    accepted: { label: 'Accepted', color: '#16A34A', bg: '#F0FDF4', icon: CheckCircle },
    rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2', icon: XCircle },
};

interface Application {
    id: number;
    job_id: number;
    name: string;
    email: string;
    resume_link: string;
    cover_note: string | null;
    status: string;
    status_note: string | null;
    status_color: string;
    created_at: string;
    job: {
        id: number;
        title: string;
        company: string;
        location: string;
        type: string;
        category: string;
    };
}

export default function ApplicationsPage() {
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, current_page: 1, last_page: 1 });
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user && token) fetchApplications();
    }, [user, token, authLoading]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/seeker/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(res.data.data);
            setPagination(res.data.pagination);
        } catch { }
        finally { setLoading(false); }
    };

    const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Loading your applications...</div>
            </div>
        );
    }

    return (
        <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '40px 0' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>My Applications</h1>
                    <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Track the status of all your job applications.</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
                    {[
                        { key: 'pending', label: 'Pending', value: stats.pending },
                        { key: 'reviewed', label: 'Reviewed', value: stats.reviewed },
                        { key: 'accepted', label: 'Accepted', value: stats.accepted },
                        { key: 'rejected', label: 'Rejected', value: stats.rejected },
                    ].map(({ key, label, value }) => {
                        const cfg = STATUS_CONFIG[key];
                        return (
                            <div key={key} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #F0F0F5', textAlign: 'center', cursor: 'pointer', outline: filter === key ? `2px solid ${cfg.color}` : 'none' }} onClick={() => setFilter(filter === key ? 'all' : key)}>
                                <div style={{ fontSize: '26px', fontWeight: 700, color: cfg.color }}>{value}</div>
                                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 18px', borderRadius: '999px', border: '1px solid', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: filter === f ? '#4F46E5' : 'white', color: filter === f ? 'white' : '#6B7280', borderColor: filter === f ? '#4F46E5' : '#E5E7EB', textTransform: 'capitalize' }}>
                            {f === 'all' ? `All (${stats.total})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${(stats as any)[f]})`}
                        </button>
                    ))}
                </div>

                {/* Applications list */}
                {filtered.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', border: '1px solid #F0F0F5' }}>
                        <Briefcase size={40} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                        <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#374151', marginBottom: '6px' }}>
                            {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
                        </h3>
                        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                            {filter === 'all' ? 'Start applying to jobs to track your progress here.' : `You don't have any ${filter} applications.`}
                        </p>
                        {filter === 'all' && (
                            <Link href="/jobs" style={{ background: '#4F46E5', color: 'white', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                Browse Jobs <ArrowRight size={15} />
                            </Link>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filtered.map(app => {
                            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                            const Icon = cfg.icon;
                            return (
                                <div key={app.id} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #F0F0F5', display: 'flex', alignItems: 'center', gap: '16px' }}>

                                    {/* Company initials */}
                                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', color: '#4F46E5', flexShrink: 0 }}>
                                        {app.job?.company?.charAt(0) || '?'}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '15px', color: '#1A1A2E', marginBottom: '2px' }}>{app.job?.title || 'Unknown Position'}</div>
                                        <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                                            {app.job?.company} · {app.job?.location} · Applied {formatDate(app.created_at)}
                                        </div>
                                        {app.status_note && (
                                            <div style={{ marginTop: '8px', fontSize: '13px', color: '#6B7280', background: '#F9FAFB', borderRadius: '8px', padding: '8px 12px', borderLeft: `3px solid ${cfg.color}` }}>
                                                <strong>Note:</strong> {app.status_note}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right side */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: cfg.bg, color: cfg.color, fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '999px' }}>
                                            <Icon size={12} /> {cfg.label}
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <a href={app.resume_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280', textDecoration: 'none', padding: '4px 10px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                                                <FileText size={12} /> Resume
                                            </a>
                                            <Link href={`/jobs/${app.job_id}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#4F46E5', textDecoration: 'none', padding: '4px 10px', border: '1px solid #E0E7FF', borderRadius: '8px', background: '#EEF2FF' }}>
                                                View Job <ArrowRight size={12} />
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}