'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

const CATEGORIES = [
    { name: 'Design', emoji: '🎨', color: '#7C3AED', bg: '#F5F3FF', hoverBg: '#7C3AED' },
    { name: 'Sales', emoji: '📈', color: '#2563EB', bg: '#EFF6FF', hoverBg: '#2563EB' },
    { name: 'Marketing', emoji: '📣', color: '#DB2777', bg: '#FDF2F8', hoverBg: '#DB2777' },
    { name: 'Finance', emoji: '💰', color: '#D97706', bg: '#FFFBEB', hoverBg: '#D97706' },
    { name: 'Technology', emoji: '💻', color: '#0891B2', bg: '#ECFEFF', hoverBg: '#0891B2' },
    { name: 'Engineering', emoji: '⚙️', color: '#4F46E5', bg: '#EEF2FF', hoverBg: '#4F46E5' },
    { name: 'Business', emoji: '🏢', color: '#16A34A', bg: '#F0FDF4', hoverBg: '#16A34A' },
    { name: 'Human Resource', emoji: '🤝', color: '#DC2626', bg: '#FEF2F2', hoverBg: '#DC2626' },
];

interface CategorySectionProps {
    categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1A1A2E' }}>
                        Explore by{' '}
                        <span style={{ color: '#26A4FF' }}>category</span>
                    </h2>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>
                        Browse jobs in your area of expertise
                    </p>
                </div>
                <Link href="/jobs" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    Show all jobs <ArrowRight size={15} />
                </Link>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {CATEGORIES.map(({ name, emoji, color, bg, hoverBg }) => {
                    const count = categories.find(c => c.category === name)?.count || 0;
                    const isActive = hovered === name;

                    return (
                        <Link
                            key={name}
                            href={`/jobs?category=${name}`}
                            onMouseEnter={() => setHovered(name)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                background: isActive ? hoverBg : 'white',
                                border: `1.5px solid ${isActive ? hoverBg : '#E5E7EB'}`,
                                borderRadius: '16px',
                                padding: '24px 22px',
                                textDecoration: 'none',
                                display: 'block',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                boxShadow: isActive ? `0 12px 32px ${hoverBg}40` : '0 1px 4px rgba(0,0,0,0.04)',
                                transform: isActive ? 'translateY(-3px)' : 'translateY(0)',
                            }}
                        >
                            {/* Emoji bubble */}
                            <div style={{
                                width: '54px', height: '54px', borderRadius: '14px',
                                background: isActive ? 'rgba(255,255,255,0.2)' : bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '26px', marginBottom: '16px',
                                transition: 'background 0.2s',
                            }}>
                                {emoji}
                            </div>

                            {/* Name */}
                            <div style={{
                                fontWeight: 700, fontSize: '15px',
                                color: isActive ? 'white' : '#1A1A2E',
                                marginBottom: '6px',
                                transition: 'color 0.2s',
                            }}>
                                {name}
                            </div>

                            {/* Count + arrow */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                color: isActive ? 'rgba(255,255,255,0.85)' : '#9CA3AF',
                                fontSize: '13px', transition: 'color 0.2s',
                            }}>
                                <span>{count} {count === 1 ? 'job' : 'jobs'} available</span>
                                <div style={{
                                    width: '26px', height: '26px', borderRadius: '50%',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s',
                                }}>
                                    <ArrowRight size={13} color={isActive ? 'white' : color} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}