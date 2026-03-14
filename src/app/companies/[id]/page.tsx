'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
    MapPin, Users, Globe, Briefcase, ArrowLeft,
    ExternalLink, Calendar, DollarSign, ArrowRight,
    Building2, CheckCircle,
} from 'lucide-react';
import { formatDate, formatSalary } from '@/lib/utils';
import { JOB_TYPES } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getInitials(name: string) {
    return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

const BG_COLORS = [
    '#4F46E5', '#16A34A', '#DC2626', '#D97706', '#2563EB', '#7C3AED', '#DB2777', '#0891B2',
];
function getBg(name: string) {
    let h = 0;
    for (let i = 0; i < name?.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return BG_COLORS[Math.abs(h) % BG_COLORS.length];
}

export default function CompanyPage() {
    const { id } = useParams();
    const router = useRouter();

    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        axios.get(`${API}/companies/${id}`)
            .then(res => setCompany(res.data.data))
            .catch(err => { if (err.response?.status === 404) setNotFound(true); })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Loading company...</p>
            </div>
        );
    }

    if (notFound || !company) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <Building2 size={48} style={{ color: '#E5E7EB' }} />
                <p style={{ color: '#9CA3AF', fontSize: '15px' }}>Company not found.</p>
                <Link href="/companies" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>← Back to Companies</Link>
            </div>
        );
    }

    const bg = getBg(company.company_name);
    const jobs = company.jobs || [];

    return (
        <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>

            {/* Cover / Header */}
            <div style={{ background: 'white', borderBottom: '1px solid #F0F0F5' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Back */}
                    <div style={{ paddingTop: '20px' }}>
                        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <ArrowLeft size={14} /> Back
                        </button>
                    </div>

                    {/* Company identity */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '24px 0 28px' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{getInitials(company.company_name)}</span>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E' }}>{company.company_name}</h1>
                                {company.is_verified && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0FDF4', color: '#16A34A', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '999px' }}>
                                        <CheckCircle size={11} /> Verified
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', fontSize: '13px', color: '#6B7280' }}>
                                {company.industry && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Briefcase size={13} color="#9CA3AF" /> {company.industry}
                                    </span>
                                )}
                                {company.location && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={13} color="#9CA3AF" /> {company.location}
                                    </span>
                                )}
                                {company.company_size && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users size={13} color="#9CA3AF" /> {company.company_size} employees
                                    </span>
                                )}
                                {company.founded_year && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={13} color="#9CA3AF" /> Founded {company.founded_year}
                                    </span>
                                )}
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4F46E5', textDecoration: 'none' }}>
                                        <Globe size={13} /> Website <ExternalLink size={11} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Open jobs badge */}
                        <div style={{ textAlign: 'center', background: '#EEF2FF', borderRadius: '12px', padding: '12px 20px', flexShrink: 0 }}>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: '#4F46E5' }}>{jobs.length}</div>
                            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>Open Jobs</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '32px 16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

                    {/* Left — About + Jobs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* About */}
                        {company.description && (
                            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', padding: '24px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E', marginBottom: '12px' }}>About {company.company_name}</h2>
                                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{company.description}</p>
                            </div>
                        )}

                        {/* Open positions */}
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', padding: '24px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E', marginBottom: '16px' }}>
                                Open Positions <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 400 }}>({jobs.length})</span>
                            </h2>

                            {jobs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <Briefcase size={36} style={{ color: '#E5E7EB', margin: '0 auto 10px' }} />
                                    <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No open positions right now.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {jobs.map((job: any) => (
                                        <Link
                                            key={job.id}
                                            href={`/jobs/${job.id}`}
                                            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #F0F0F5', textDecoration: 'none', transition: 'background 0.15s' }}
                                            className="hover:bg-gray-50"
                                        >
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E' }}>{job.title}</div>
                                                <div style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                        <MapPin size={10} /> {job.location}
                                                    </span>
                                                    <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '1px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 500 }}>
                                                        {JOB_TYPES[job.type] || job.type}
                                                    </span>
                                                    {(job.salary_min || job.salary_max) && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                            <DollarSign size={10} /> {formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ArrowRight size={15} color="#D1D5DB" style={{ flexShrink: 0 }} />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Company details card */}
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', padding: '20px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E', marginBottom: '14px' }}>Company Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { label: 'Industry', value: company.industry },
                                    { label: 'Company size', value: company.company_size ? `${company.company_size} employees` : null },
                                    { label: 'Founded', value: company.founded_year },
                                    { label: 'Location', value: company.location },
                                ].filter(r => r.value).map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: '#9CA3AF' }}>{label}</span>
                                        <span style={{ color: '#374151', fontWeight: 500, textAlign: 'right', maxWidth: '160px' }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social links */}
                        {(company.website || company.linkedin) && (
                            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', padding: '20px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E', marginBottom: '14px' }}>Links</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {company.website && (
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4F46E5', textDecoration: 'none' }}>
                                            <Globe size={14} /> Website <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
                                        </a>
                                    )}
                                    {company.linkedin && (
                                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4F46E5', textDecoration: 'none' }}>
                                            <ExternalLink size={14} /> LinkedIn <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div style={{ background: '#4F46E5', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                            <Briefcase size={28} color="rgba(255,255,255,0.8)" style={{ margin: '0 auto 10px' }} />
                            <p style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                                {jobs.length > 0 ? `${jobs.length} open position${jobs.length > 1 ? 's' : ''}` : 'No openings now'}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '14px' }}>
                                {jobs.length > 0 ? 'Apply today and join the team' : 'Check back later for new roles'}
                            </p>
                            {jobs.length > 0 && (
                                <a href="#positions" style={{ display: 'block', background: 'white', color: '#4F46E5', padding: '9px', borderRadius: '9px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
                                    View All Jobs
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}