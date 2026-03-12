'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, MapPin } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import { getFeaturedJobs, getCategories } from '@/lib/api';
import { Job, Category, JOB_CATEGORIES } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    Promise.all([
      getFeaturedJobs(),
      getCategories(),
      import('@/lib/api').then(m => m.getJobs({ per_page: 6 })),
    ]).then(([feat, cats, latest]) => {
      setFeaturedJobs(feat.data.data || []);
      setCategories(cats.data.data || []);
      setLatestJobs(latest.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (location) qs.set('location', location);
    router.push(`/jobs?${qs.toString()}`);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-white overflow-hidden" style={{ minHeight: '540px' }}>

        {/* Geometric lines background — top right */}
        <div className="absolute right-0 top-0 pointer-events-none" style={{ width: '55%', height: '100%' }}>
          <svg width="100%" height="100%" viewBox="0 0 700 520" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMid meet">
            {/* Large rotated rectangles matching Figma */}
            <rect x="320" y="-60" width="320" height="320" rx="32" stroke="#C7C9F0" strokeWidth="1.2" transform="rotate(20 320 -60)" fill="none" />
            <rect x="380" y="20" width="260" height="260" rx="28" stroke="#C7C9F0" strokeWidth="1" transform="rotate(20 380 20)" fill="none" />
            <rect x="440" y="90" width="200" height="200" rx="24" stroke="#C7C9F0" strokeWidth="0.8" transform="rotate(20 440 90)" fill="none" />
            <rect x="490" y="150" width="150" height="150" rx="20" stroke="#C7C9F0" strokeWidth="0.6" transform="rotate(20 490 150)" fill="none" />
          </svg>
        </div>

        {/* Purple/indigo rectangle behind person */}
        <div
          className="absolute hidden lg:block"
          style={{
            right: '4%',
            top: '0',
            width: '38%',
            height: '100%',
            background: 'linear-gradient(160deg, #EEF0FF 0%, #E8EAFF 100%)',
            borderBottomLeftRadius: '999px',
            borderBottomRightRadius: '32px',
            zIndex: 1,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 2 }}>
          <div className="grid lg:grid-cols-2 gap-0 items-center" style={{ minHeight: '520px' }}>

            {/* LEFT */}
            <div className="py-16 pr-8">
              <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.15, color: '#1A1A2E', letterSpacing: '-1px' }} className="mb-5">
                Discover<br />
                more than<br />
                <span style={{ color: '#26A4FF', position: 'relative', display: 'inline-block' }}>
                  5000+ Jobs
                  {/* Hand-drawn underline */}
                  <svg style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%' }} height="10" viewBox="0 0 260 10" fill="none">
                    <path d="M2 7 C40 2, 100 9, 160 5 C200 2, 230 8, 258 4" stroke="#26A4FF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </h1>

              <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.7, maxWidth: '360px' }} className="mb-8">
                Great platform for the job seeker that searching for new career heights and passionate about startups.
              </p>

              {/* Search bar — exactly like Figma */}
              <form onSubmit={handleSearch}
                className="flex items-center bg-white rounded-xl overflow-hidden mb-4"
                style={{
                  maxWidth: '500px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                  border: '1px solid #F0F0F0',
                  height: '56px',
                }}>
                <div className="flex items-center gap-2 px-4 flex-1">
                  <Search size={17} color="#9CA3AF" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Job title or keyword"
                    style={{ fontSize: '13.5px', color: '#374151', outline: 'none', background: 'transparent', width: '100%' }}
                  />
                </div>
                <div style={{ width: '1px', height: '28px', background: '#E5E7EB' }} />
                <div className="flex items-center gap-2 px-4">
                  <MapPin size={17} color="#9CA3AF" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Florence, Italy"
                    style={{ fontSize: '13.5px', color: '#374151', outline: 'none', background: 'transparent', width: '110px' }}
                  />
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
                <button
                  type="submit"
                  style={{
                    background: '#4F46E5',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '14px',
                    padding: '0 28px',
                    height: '100%',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Search my job
                </button>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center gap-1" style={{ fontSize: '13px' }}>
                <span style={{ color: '#9CA3AF' }}>Popular :</span>
                {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag, i, arr) => (
                  <button
                    key={tag}
                    onClick={() => router.push(`/jobs?search=${tag}`)}
                    style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {tag}{i < arr.length - 1 ? ',' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT — person image */}
            <div className="hidden lg:flex items-end justify-center relative" style={{ height: '520px', zIndex: 2 }}>
              <Image
                src="/hero-person.png"
                alt="Job seeker"
                width={380}
                height={480}
                style={{ objectFit: 'contain', objectPosition: 'bottom', zIndex: 3, position: 'relative' }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Companies we helped grow */}
        <div style={{ borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap items-center gap-10">
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Companies we helped grow</span>
              {[
                { name: 'vodafone', icon: '●' },
                { name: 'Intel', italic: true },
                { name: 'TESLA', wide: true },
                { name: 'AMD', bold: true },
                { name: 'Talkit' },
              ].map(c => (
                <span key={c.name} style={{
                  color: '#9CA3AF',
                  fontWeight: c.bold ? 800 : 600,
                  fontSize: c.wide ? '17px' : '15px',
                  letterSpacing: c.wide ? '3px' : '1px',
                  fontStyle: c.italic ? 'italic' : 'normal',
                  textTransform: 'uppercase',
                }}>
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE BY CATEGORY ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>Explore by <span style={{ color: "#26A4FF" }} >category</span> </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Browse jobs in your area of expertise</p>
          </div>
          <Link href="/jobs" className="flex items-center gap-1" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 500 }}>
            Show all jobs <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {JOB_CATEGORIES.map(cat => {
            const count = categories.find(c => c.category === cat.name)?.count || 0;
            return (
              <Link key={cat.name} href={`/jobs?category=${cat.name}`}
                className="group"
                style={{
                  background: 'white',
                  border: '1px solid #F0F0F5',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'block',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cat.icon}</div>
                <div style={{ fontWeight: 600, color: '#1A1A2E', fontSize: '14px' }} className="group-hover:text-indigo-600 transition-colors">{cat.name}</div>
                <div style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '3px' }}>{count} jobs available</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4F46E5 100%)', borderRadius: '24px', padding: '40px 48px' }}>
          <div style={{ color: 'white', position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Start posting jobs today</h3>
            <p style={{ color: '#a5b4fc', fontSize: '14px' }}>Reach thousands of qualified candidates instantly</p>
          </div>
          <div className="flex gap-3" style={{ position: 'relative', zIndex: 1 }}>
            <Link href="/admin" style={{ background: 'white', color: '#4F46E5', fontWeight: 600, padding: '12px 24px', borderRadius: '12px', fontSize: '14px', textDecoration: 'none' }}>
              Post a Job
            </Link>
            <Link href="/jobs" style={{ border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: 600, padding: '12px 24px', borderRadius: '12px', fontSize: '14px', textDecoration: 'none' }}>
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>Featured <span style={{ color: "#26A4FF" }} >Jobs</span> </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Handpicked top opportunities</p>
          </div>
          <Link href="/jobs" className="flex items-center gap-1" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 500 }}>
            Show all <ArrowRight size={15} />
          </Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse rounded-2xl bg-gray-100" style={{ height: '200px' }} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map(job => <JobCard key={job.id} job={job} featured />)}
          </div>
        )}
      </section>

      {/* ── LATEST JOBS ── */}
      <section style={{ background: '#F9FAFB', padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>Latest Jobs Open</h2>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Freshly posted opportunities</p>
            </div>
            <Link href="/jobs" className="flex items-center gap-1" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 500 }}>
              Show all <ArrowRight size={15} />
            </Link>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse rounded-2xl bg-white" style={{ height: '200px' }} />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/jobs"
              style={{ background: '#4F46E5', color: 'white', fontWeight: 600, padding: '14px 32px', borderRadius: '10px', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Browse All Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
