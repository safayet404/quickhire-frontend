'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Search, MapPin, Users, Briefcase, Building2, ExternalLink } from 'lucide-react';

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

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState<any>(null);
    const [page, setPage] = useState(1);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/companies`, { params: { search, page } });
            setCompanies(res.data.data || []);
            setPagination(res.data.pagination);
        } catch { }
        finally { setLoading(false); }
    }, [search, page]);

    useEffect(() => { setPage(1); }, [search]);
    useEffect(() => { fetchCompanies(); }, [search, page]);

    return (
        <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>

            {/* Hero */}
            <div style={{ background: 'white', borderBottom: '1px solid #F0F0F5', padding: '48px 0 32px' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1A1A2E', marginBottom: '6px' }}>
                        Browse Companies
                    </h1>
                    <p style={{ color: '#9CA3AF', fontSize: '15px', marginBottom: '24px' }}>
                        Discover great places to work
                    </p>

                    {/* Search */}
                    <div style={{ position: 'relative', maxWidth: '480px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search companies, industries..."
                            style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '32px 16px' }}>

                {/* Results count */}
                {!loading && (
                    <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>
                        {pagination?.total ?? companies.length} companies found
                        {search && ` for "${search}"`}
                    </p>
                )}

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', padding: '24px', height: '180px', animation: 'pulse 2s infinite' }} />
                        ))}
                    </div>
                ) : companies.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <Building2 size={48} style={{ color: '#E5E7EB', margin: '0 auto 16px' }} />
                        <p style={{ color: '#9CA3AF', fontSize: '15px' }}>No companies found{search ? ` for "${search}"` : ''}.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {companies.map(company => (
                            <Link
                                key={company.id}
                                href={`/companies/${company.id}`}
                                style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', padding: '24px', textDecoration: 'none', display: 'block', transition: 'box-shadow 0.2s, border-color 0.2s' }}
                                className="hover:shadow-md hover:border-indigo-100"
                            >
                                {/* Logo / initials */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: getBg(company.company_name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>{getInitials(company.company_name)}</span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {company.company_name}
                                        </div>
                                        {company.industry && (
                                            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{company.industry}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {company.description && (
                                    <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                                        {company.description}
                                    </p>
                                )}

                                {/* Meta */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#9CA3AF' }}>
                                    {company.location && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <MapPin size={11} /> {company.location}
                                        </span>
                                    )}
                                    {company.company_size && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <Users size={11} /> {company.company_size}
                                        </span>
                                    )}
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: 'auto', color: '#4F46E5', fontWeight: 600 }}>
                                        <Briefcase size={11} /> {company.jobs_count ?? 0} open jobs
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                        {[...Array(pagination.last_page)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid', borderColor: page === i + 1 ? '#4F46E5' : '#E5E7EB', background: page === i + 1 ? '#4F46E5' : 'white', color: page === i + 1 ? 'white' : '#6B7280', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}