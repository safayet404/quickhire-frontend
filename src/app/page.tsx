'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Building2, Briefcase } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import SearchBar from '@/components/jobs/SearchBar';
import { getFeaturedJobs, getCategories } from '@/lib/api';
import { Job, Category, JOB_CATEGORIES } from '@/types';

const STATS = [
  { icon: Briefcase, label: 'Live Jobs', value: '5,000+' },
  { icon: Building2, label: 'Companies', value: '1,200+' },
  { icon: Users, label: 'Candidates', value: '50k+' },
  { icon: TrendingUp, label: 'Success Rate', value: '87%' },
];

export default function HomePage() {
  const router = useRouter();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFeaturedJobs(),
      getCategories(),
      // Latest = first page of all jobs
      import('@/lib/api').then(m => m.getJobs({ per_page: 6 })),
    ]).then(([feat, cats, latest]) => {
      setFeaturedJobs(feat.data.data || []);
      setCategories(cats.data.data || []);
      setLatestJobs(latest.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (params: { search: string; category: string; type: string; location: string }) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.category) qs.set('category', params.category);
    if (params.type) qs.set('type', params.type);
    if (params.location) qs.set('location', params.location);
    router.push(`/jobs?${qs.toString()}`);
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-100 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <TrendingUp size={14} />
                #1 Job Board Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Discover more than{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-100 to-violet-400">
                  5000+ Jobs
                </span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-md">
                Great platform for job seekers who are passionately searching for exciting career opportunities and employers who seek quality talent.
              </p>

              {/* Search bar in hero */}
              <SearchBar onSearch={handleSearch} compact />

              {/* Popular searches */}
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="text-sm text-gray-400">Popular:</span>
                {['Designer', 'Developer', 'Marketing', 'Remote'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleSearch({ search: tag, category: '', type: '', location: '' })}
                    className="text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-full px-3 py-1 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats side */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {STATS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={20} className="text-primary-100" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{value}</div>
                  <div className="text-sm text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L1440 40L1440 20C1440 20 1080 0 720 0C360 0 0 20 0 20L0 40Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* ── EXPLORE BY CATEGORY ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Explore by category</h2>
            <p className="text-gray-500 mt-1">Browse jobs in your area of expertise</p>
          </div>
          <Link href="/jobs" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {JOB_CATEGORIES.map(cat => {
            const count = categories.find(c => c.category === cat.name)?.count || 0;
            return (
              <Link
                key={cat.name}
                href={`/jobs?category=${cat.name}`}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all group"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{cat.name}</div>
                <div className="text-sm text-gray-400 mt-0.5">{count} jobs</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-primary to-violet-600 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">Start posting jobs today</h3>
            <p className="text-primary-100">Reach thousands of qualified candidates instantly</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Post a Job
            </Link>
            <Link href="/jobs" className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
            <p className="text-gray-500 mt-1">Handpicked top opportunities</p>
          </div>
          <Link href="/jobs?featured=1" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
            Show all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-52 bg-gray-50" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map(job => <JobCard key={job.id} job={job} featured />)}
          </div>
        )}
      </section>

      {/* ── LATEST JOBS ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Latest Jobs Open</h2>
              <p className="text-gray-500 mt-1">Freshly posted opportunities</p>
            </div>
            <Link href="/jobs" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
              Show all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-52 bg-white" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/jobs" className="btn-primary inline-flex items-center gap-2">
              Browse All Jobs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
