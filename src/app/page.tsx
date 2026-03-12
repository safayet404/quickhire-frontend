'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, MapPin, Bell, LayoutDashboard, MessageSquare, Building2, Users, Briefcase, Calendar, Settings, HelpCircle, Plus } from 'lucide-react';
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
        <div className="absolute right-0 top-0 pointer-events-none" style={{ width: '55%', height: '100%' }}>
          <svg width="100%" height="100%" viewBox="0 0 700 520" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMid meet">
            <rect x="320" y="-60" width="320" height="320" rx="32" stroke="#C7C9F0" strokeWidth="1.2" transform="rotate(20 320 -60)" fill="none" />
            <rect x="380" y="20" width="260" height="260" rx="28" stroke="#C7C9F0" strokeWidth="1" transform="rotate(20 380 20)" fill="none" />
            <rect x="440" y="90" width="200" height="200" rx="24" stroke="#C7C9F0" strokeWidth="0.8" transform="rotate(20 440 90)" fill="none" />
            <rect x="490" y="150" width="150" height="150" rx="20" stroke="#C7C9F0" strokeWidth="0.6" transform="rotate(20 490 150)" fill="none" />
          </svg>
        </div>
        <div className="absolute hidden lg:block" style={{ right: '4%', top: '0', width: '38%', height: '100%', background: 'linear-gradient(160deg, #EEF0FF 0%, #E8EAFF 100%)', borderBottomLeftRadius: '999px', borderBottomRightRadius: '32px', zIndex: 1 }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 2 }}>
          <div className="grid lg:grid-cols-2 gap-0 items-center" style={{ minHeight: '520px' }}>
            <div className="py-16 pr-8">
              <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.15, color: '#1A1A2E', letterSpacing: '-1px' }} className="mb-5">
                Discover<br />more than<br />
                <span style={{ color: '#26A4FF', position: 'relative', display: 'inline-block' }}>
                  5000+ Jobs
                  <svg style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%' }} height="10" viewBox="0 0 260 10" fill="none">
                    <path d="M2 7 C40 2, 100 9, 160 5 C200 2, 230 8, 258 4" stroke="#26A4FF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </h1>
              <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.7, maxWidth: '360px' }} className="mb-8">
                Great platform for the job seeker that searching for new career heights and passionate about startups.
              </p>
              <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl overflow-hidden mb-4" style={{ maxWidth: '500px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid #F0F0F0', height: '56px' }}>
                <div className="flex items-center gap-2 px-4 flex-1">
                  <Search size={17} color="#9CA3AF" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title or keyword" style={{ fontSize: '13.5px', color: '#374151', outline: 'none', background: 'transparent', width: '100%' }} />
                </div>
                <div style={{ width: '1px', height: '28px', background: '#E5E7EB' }} />
                <div className="flex items-center gap-2 px-4">
                  <MapPin size={17} color="#9CA3AF" />
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Florence, Italy" style={{ fontSize: '13.5px', color: '#374151', outline: 'none', background: 'transparent', width: '110px' }} />
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
                <button type="submit" style={{ background: '#4F46E5', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0 28px', height: '100%', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Search my job
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-1" style={{ fontSize: '13px' }}>
                <span style={{ color: '#9CA3AF' }}>Popular :</span>
                {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag, i, arr) => (
                  <button key={tag} onClick={() => router.push(`/jobs?search=${tag}`)} style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }} className="hover:text-indigo-600 transition-colors">
                    {tag}{i < arr.length - 1 ? ',' : ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex items-end justify-center relative" style={{ height: '520px', zIndex: 2 }}>
              <Image src="/hero-person.png" alt="Job seeker" width={380} height={480} style={{ objectFit: 'contain', objectPosition: 'bottom', zIndex: 3, position: 'relative' }} priority />
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap items-center gap-10">
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Companies we helped grow</span>
              {[{ name: 'Vodafone' }, { name: 'Intel', italic: true }, { name: 'TESLA', wide: true }, { name: 'AMD', bold: true }, { name: 'Talkit' }].map((c: { name: string; italic?: boolean; wide?: boolean; bold?: boolean }) => (
                <span key={c.name} style={{ color: '#9CA3AF', fontWeight: c.bold ? 800 : 600, fontSize: c.wide ? '17px' : '15px', letterSpacing: c.wide ? '3px' : '1px', fontStyle: c.italic ? 'italic' : 'normal', textTransform: 'uppercase' }}>
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
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>Explore by <span style={{ color: '#26A4FF' }}>category</span></h2>
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
              <Link key={cat.name} href={`/jobs?category=${cat.name}`} className="group" style={{ background: 'white', border: '1px solid #F0F0F5', borderRadius: '16px', padding: '20px', display: 'block', transition: 'all 0.2s', textDecoration: 'none' }}>
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
        <div style={{ background: '#4F46E5', borderRadius: '24px', overflow: 'hidden', display: 'flex', alignItems: 'center', minHeight: '280px', position: 'relative' }}>
          {/* Left */}
          <div style={{ padding: '52px 56px', flexShrink: 0, width: '320px', zIndex: 2 }}>
            <h3 style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '14px' }}>
              Start posting<br />jobs today
            </h3>
            <p style={{ color: '#c7d2fe', fontSize: '14px', marginBottom: '32px' }}>Start posting jobs for only $10.</p>
            <Link href="/admin" style={{ display: 'inline-block', background: 'white', color: '#4F46E5', fontWeight: 700, fontSize: '14px', padding: '13px 30px', borderRadius: '8px', textDecoration: 'none' }}>
              Sign Up For Free
            </Link>
          </div>

          {/* Right — dashboard mockup */}
          <div style={{ flex: 1, position: 'relative', height: '280px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-8px', top: '24px', width: '680px', background: '#F1F5FF', borderRadius: '16px 16px 0 0', boxShadow: '0 -12px 48px rgba(0,0,0,0.22)', overflow: 'hidden' }}>
              {/* Navbar */}
              <div style={{ background: 'white', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EEF0F5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '26px', height: '26px', background: '#4F46E5', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={13} color="white" /></div>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: '#1A1A2E' }}>QuickHire</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F5F5FA', padding: '5px 12px', borderRadius: '7px', border: '1px solid #EBEBF5' }}>
                    <Building2 size={10} color="#6B7280" />
                    <span style={{ color: '#6B7280', fontSize: '10px' }}>Company</span>
                    <span style={{ color: '#1A1A2E', fontSize: '10px', fontWeight: 600 }}>Nomad</span>
                    <svg width="9" height="6" viewBox="0 0 9 6" fill="none"><path d="M1 1l3.5 3.5L8 1" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" /></svg>
                  </div>
                  <Bell size={14} color="#6B7280" />
                  <div style={{ width: '26px', height: '26px', background: '#E0E7FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#4F46E5' }}>M</span>
                  </div>
                  <button style={{ background: '#4F46E5', color: 'white', border: 'none', borderRadius: '7px', padding: '6px 12px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={10} /> Post a Job
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex' }}>
                {/* Sidebar */}
                <div style={{ width: '135px', background: 'white', padding: '14px 10px', borderRight: '1px solid #EEF0F5', flexShrink: 0 }}>
                  <div style={{ fontSize: '8px', color: '#9CA3AF', fontWeight: 700, marginBottom: '8px', paddingLeft: '8px', letterSpacing: '0.5px' }}>MENU</div>
                  {[
                    { icon: LayoutDashboard, label: 'Dashboard', active: true },
                    { icon: MessageSquare, label: 'Messages' },
                    { icon: Building2, label: 'Company Profile' },
                    { icon: Users, label: 'All Applicants' },
                    { icon: Briefcase, label: 'Job Listing' },
                    { icon: Calendar, label: 'My Schedule' },
                  ].map(({ icon: Icon, label, active }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 8px', borderRadius: '7px', background: active ? '#EEF2FF' : 'transparent', marginBottom: '1px' }}>
                      <Icon size={11} color={active ? '#4F46E5' : '#9CA3AF'} />
                      <span style={{ fontSize: '9px', fontWeight: active ? 600 : 400, color: active ? '#4F46E5' : '#6B7280' }}>{label}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: '8px', color: '#9CA3AF', fontWeight: 700, margin: '10px 0 8px', paddingLeft: '8px', letterSpacing: '0.5px' }}>SETTINGS</div>
                  {[{ icon: Settings, label: 'Settings' }, { icon: HelpCircle, label: 'Help Center' }].map(({ icon: Icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 8px', marginBottom: '1px' }}>
                      <Icon size={11} color="#9CA3AF" />
                      <span style={{ fontSize: '9px', color: '#6B7280' }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div style={{ flex: 1, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#1A1A2E' }}>Good morning, Maria</div>
                      <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '2px' }}>Here is your job listings statistic report from July 19 - July 25.</div>
                    </div>
                    <div style={{ fontSize: '9px', color: '#9CA3AF' }}>Jul 19 - Jul 25 ↑</div>
                  </div>

                  {/* 3 cards */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { value: '76', label: 'New candidates to review', bg: '#4F46E5' },
                      { value: '3', label: 'Schedule for today', bg: '#56CDAD' },
                      { value: '24', label: 'Messages received', bg: '#26A4FF' },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: '10px', padding: '10px 12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                          <div style={{ fontSize: '8px', opacity: 0.9, marginTop: '3px', lineHeight: 1.3 }}>{s.label}</div>
                        </div>
                        <span style={{ fontSize: '14px', opacity: 0.7 }}>→</span>
                      </div>
                    ))}
                  </div>

                  {/* Chart + stats */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, background: 'white', borderRadius: '10px', padding: '10px 12px', border: '1px solid #EEF0F5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '10px', color: '#1A1A2E' }}>Job statistics</div>
                          <div style={{ fontSize: '8px', color: '#9CA3AF' }}>Showing jobstatus Jul 19-25</div>
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {['Week', 'Month', 'Year'].map((t, i) => (
                            <span key={t} style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '4px', background: i === 0 ? '#4F46E5' : 'transparent', color: i === 0 ? 'white' : '#9CA3AF' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #F0F0F5', marginBottom: '8px' }}>
                        {['Overview', 'Jobs View', 'Jobs Applied'].map((t, i) => (
                          <span key={t} style={{ fontSize: '8px', paddingBottom: '5px', borderBottom: i === 0 ? '2px solid #4F46E5' : '2px solid transparent', color: i === 0 ? '#4F46E5' : '#9CA3AF', fontWeight: i === 0 ? 600 : 400 }}>{t}</span>
                        ))}
                      </div>
                      {/* Bars */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '55px', marginBottom: '4px' }}>
                        {[{ jv: 38, ja: 22 }, { jv: 52, ja: 30 }, { jv: 62, ja: 38 }, { jv: 42, ja: 24 }, { jv: 55, ja: 32 }, { jv: 36, ja: 19 }, { jv: 48, ja: 28 }].map((d, i) => (
                          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                            <div style={{ flex: 1, height: `${d.jv}px`, background: '#FFB836', borderRadius: '2px 2px 0 0' }} />
                            <div style={{ flex: 1, height: `${d.ja}px`, background: '#4F46E5', borderRadius: '2px 2px 0 0' }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                          <span key={d} style={{ fontSize: '7px', color: '#9CA3AF', flex: 1, textAlign: 'center' }}>{d}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {[{ label: 'Job Views', val: '2,342', trend: '↑ 3.42%', tc: '#56CDAD', color: '#FFB836' }, { label: 'Job Applied', val: '654', trend: '↓ 0.5%', tc: '#FF6550', color: '#4F46E5' }].map(s => (
                          <div key={s.label}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                              <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: s.color }} />
                              <span style={{ fontSize: '8px', color: '#9CA3AF' }}>{s.label}</span>
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1A1A2E' }}>{s.val}</div>
                            <div style={{ fontSize: '8px', color: s.tc }}>{s.trend}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Right */}
                    <div style={{ width: '125px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ background: 'white', borderRadius: '10px', padding: '10px', border: '1px solid #EEF0F5' }}>
                        <div style={{ fontSize: '8px', color: '#9CA3AF' }}>Job Open</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>12</div>
                        <div style={{ fontSize: '8px', color: '#9CA3AF' }}>Jobs Opened</div>
                      </div>
                      <div style={{ background: 'white', borderRadius: '10px', padding: '10px', border: '1px solid #EEF0F5', flex: 1 }}>
                        <div style={{ fontSize: '8px', color: '#9CA3AF', marginBottom: '3px' }}>Applicants Summary</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1, marginBottom: '6px' }}>67</div>
                        <div style={{ height: '5px', borderRadius: '3px', overflow: 'hidden', display: 'flex', marginBottom: '6px' }}>
                          <div style={{ width: '45%', background: '#4F46E5' }} />
                          <div style={{ width: '15%', background: '#FFB836' }} />
                          <div style={{ width: '18%', background: '#56CDAD' }} />
                          <div style={{ width: '22%', background: '#FF6550' }} />
                        </div>
                        {[{ l: 'Full Time', v: 45, c: '#4F46E5' }, { l: 'Part Time', v: 10, c: '#FFB836' }, { l: 'Internship', v: 12, c: '#56CDAD' }, { l: 'Remote', v: 32, c: '#FF6550' }].map(a => (
                          <div key={a.l} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.c, flexShrink: 0 }} />
                            <span style={{ fontSize: '8px', color: '#6B7280', flex: 1 }}>{a.l}</span>
                            <span style={{ fontSize: '8px', fontWeight: 700, color: '#1A1A2E' }}>{a.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>Featured <span style={{ color: '#26A4FF' }}>Jobs</span></h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Handpicked top opportunities</p>
          </div>
          <Link href="/jobs" className="flex items-center gap-1" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 500 }}>Show all <ArrowRight size={15} /></Link>
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
      {/* ── LATEST JOBS ── */}
      <section style={{ background: '#F9FAFB', padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>
                Latest <span style={{ color: '#26A4FF' }}>jobs open</span>
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>
                Freshly posted opportunities
              </p>
            </div>
            <Link href="/jobs" className="flex items-center gap-1"
              style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 500 }}>
              Show all jobs <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white" style={{ height: '100px' }} />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {latestJobs.map(job => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  style={{
                    background: 'white',
                    border: '1px solid #F0F0F5',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textDecoration: 'none',
                    transition: 'box-shadow 0.2s',
                  }}
                  className="hover:shadow-md"
                >
                  {/* Logo */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company}
                        style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '20px', fontWeight: 700, color: '#6B7280' }}>
                        {job.company?.[0] ?? '?'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', marginBottom: '2px' }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '10px' }}>
                      {job.company}{job.location ? ` • ${job.location}` : ''}
                    </div>

                    {/* Tag pills */}
                    <div className="flex flex-wrap gap-2">
                      {/* Job type pill */}
                      <span style={{
                        fontSize: '11px', fontWeight: 500, padding: '3px 10px',
                        borderRadius: '999px', border: '1px solid #FDE68A',
                        color: '#D97706', background: '#FFFBEB',
                        textTransform: 'capitalize',
                      }}>
                        {job.type.replace('-', ' ')}
                      </span>

                      {/* Category pill */}
                      {job.category && (
                        <span style={{
                          fontSize: '11px', fontWeight: 500, padding: '3px 10px',
                          borderRadius: '999px', border: '1px solid #C7D2FE',
                          color: '#4F46E5', background: '#EEF2FF',
                        }}>
                          {job.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/jobs" style={{
              background: '#4F46E5', color: 'white', fontWeight: 600,
              padding: '14px 32px', borderRadius: '10px', fontSize: '14px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              Browse All Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}