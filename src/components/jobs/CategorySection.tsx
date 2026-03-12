'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

const DesignIcon = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
        <path d="M10 38L22 26" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M30 8C26 8 22 12 22 16C22 20 26 24 30 24C32 24 33.5 23.5 34.5 22.5L38 26L42 22L38.5 18.5C39.5 17.5 40 16 40 14C40 10 36 8 32 8" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 28L16 20L22 26L14 34L8 36L8 28Z" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 20L22 26" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
);

const SalesIcon = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
        <circle cx="16" cy="14" r="9" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M16 9V14H21" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 42V32" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M22 42V28" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M30 42V30" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M38 42V24" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
);

const MarketingIcon = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
        <path d="M10 18H18L32 10V38L18 30H10C8.9 30 8 29.1 8 28V20C8 18.9 8.9 18 10 18Z" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 30V38" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M36 20C37.2 21.2 38 22.5 38 24C38 25.5 37.2 26.8 36 28" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M40 16C42.5 18.5 44 21.1 44 24C44 26.9 42.5 29.5 40 32" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
);

const FinanceIcon = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="12" width="36" height="26" rx="4" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="28" y="22" width="10" height="8" rx="3" stroke={color} strokeWidth="2.8" />
        <path d="M6 20H42" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
);

const TechnologyIcon = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="40" height="26" rx="3" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 42H30" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M24 34V42" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M12 18H24" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M12 23H20" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
);

const EngineeringIcon = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
        <path d="M18 14L8 24L18 34" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 14L40 24L30 34" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 10L20 38" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
);

const BusinessIcon = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">

        <rect x="6" y="20" width="36" height="24" rx="3" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

        <path d="M16 20V14C16 11.8 17.8 10 20 10H28C30.2 10 32 11.8 32 14V20" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

        <path d="M6 30H42" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M22 30V34" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M26 30V34" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
);

const HumanResourceIcon = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">

        <circle cx="24" cy="14" r="6" stroke={color} strokeWidth="2.8" />
        <path d="M10 42C10 34.3 16.3 28 24 28C31.7 28 38 34.3 38 42" stroke={color} strokeWidth="2.8" strokeLinecap="round" />

        <circle cx="10" cy="18" r="4" stroke={color} strokeWidth="2.4" />
        <path d="M2 38C2 33.6 5.6 30 10 30" stroke={color} strokeWidth="2.4" strokeLinecap="round" />

        <circle cx="38" cy="18" r="4" stroke={color} strokeWidth="2.4" />
        <path d="M46 38C46 33.6 42.4 30 38 30" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
);

const CATEGORIES = [
    { name: 'Design', Icon: DesignIcon },
    { name: 'Sales', Icon: SalesIcon },
    { name: 'Marketing', Icon: MarketingIcon },
    { name: 'Finance', Icon: FinanceIcon },
    { name: 'Technology', Icon: TechnologyIcon },
    { name: 'Engineering', Icon: EngineeringIcon },
    { name: 'Business', Icon: BusinessIcon },
    { name: 'Human Resource', Icon: HumanResourceIcon },
];

interface CategorySectionProps {
    categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A2E' }}>
                        Explore by{' '}
                        <span style={{ color: '#26A4FF' }}>category</span>
                    </h2>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>
                        Browse jobs in your area of expertise
                    </p>
                </div>
                <Link
                    href="/jobs"
                    style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                    Show all jobs <ArrowRight size={15} />
                </Link>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {CATEGORIES.map(({ name, Icon }) => {
                    const count = categories.find(c => c.category === name)?.count || 0;
                    const isActive = hovered === name;

                    return (
                        <Link
                            key={name}
                            href={`/jobs?category=${name}`}
                            onMouseEnter={() => setHovered(name)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                background: isActive ? '#4F46E5' : 'white',
                                border: `1px solid ${isActive ? '#4F46E5' : '#D6DDEB'}`,
                                borderRadius: '8px',
                                padding: '28px 24px',
                                textDecoration: 'none',
                                display: 'block',
                                transition: 'background 0.2s ease, border-color 0.2s ease',
                                cursor: 'pointer',
                            }}
                        >
                            {/* Icon */}
                            <div style={{ marginBottom: '20px' }}>
                                <Icon color={isActive ? 'white' : '#4640DE'} />
                            </div>

                            {/* Name */}
                            <div style={{
                                fontWeight: 700,
                                fontSize: '16px',
                                color: isActive ? 'white' : '#1A1A2E',
                                marginBottom: '6px',
                                transition: 'color 0.2s',
                            }}>
                                {name}
                            </div>

                            {/* Count + arrow */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: isActive ? 'rgba(255,255,255,0.8)' : '#9CA3AF',
                                fontSize: '14px',
                                transition: 'color 0.2s',
                            }}>
                                <span>{count} jobs available</span>
                                <ArrowRight size={14} />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}