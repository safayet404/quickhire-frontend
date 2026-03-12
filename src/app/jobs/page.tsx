'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import SearchBar from '@/components/jobs/SearchBar';
import { getJobs } from '@/lib/api';
import { Job, PaginationMeta } from '@/types';

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';
  const location = searchParams.get('location') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, per_page: 9 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (type) params.type = type;
    if (location) params.location = location;

    getJobs(params)
      .then(res => {
        setJobs(res.data.data || []);
        setPagination(res.data.pagination || null);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [search, category, type, location, page]);

  const handleSearch = (params: { search: string; category: string; type: string; location: string }) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.category) qs.set('category', params.category);
    if (params.type) qs.set('type', params.type);
    if (params.location) qs.set('location', params.location);
    router.push(`/jobs?${qs.toString()}`);
  };

  const goToPage = (p: number) => {
    const qs = new URLSearchParams(searchParams.toString());
    qs.set('page', String(p));
    router.push(`/jobs?${qs.toString()}`);
  };

  const hasFilters = search || category || type || location;

  return (
    <div>
      {/* Page header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
          <p className="text-gray-400">
            {pagination ? `${pagination.total.toLocaleString()} jobs available` : 'Browse all available positions'}
          </p>
          <div className="mt-6">
            <SearchBar onSearch={handleSearch} compact />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">Filters:</span>
            {search && <FilterTag label={`"${search}"`} onRemove={() => handleSearch({ search: '', category, type, location })} />}
            {category && <FilterTag label={category} onRemove={() => handleSearch({ search, category: '', type, location })} />}
            {type && <FilterTag label={type} onRemove={() => handleSearch({ search, category, type: '', location })} />}
            {location && <FilterTag label={location} onRemove={() => handleSearch({ search, category, type, location: '' })} />}
            <button onClick={() => router.push('/jobs')} className="text-xs text-red-500 hover:underline ml-2">Clear all</button>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">
            {loading ? 'Loading...' : `${pagination?.total ?? 0} Jobs Found`}
          </h2>
          <span className="text-sm text-gray-500">
            Page {pagination?.current_page ?? 1} of {pagination?.last_page ?? 1}
          </span>
        </div>

        {/* Jobs grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-52 bg-gray-50" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={() => router.push('/jobs')} className="btn-primary">Browse All Jobs</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.last_page || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`ellipsis-${p}`} className="text-gray-400">…</span>
                  )}
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                </>
              ))}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= pagination.last_page}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-primary-700">×</button>
    </span>
  );
}

export default function JobsPage() {
  return (
    <Suspense>
      <JobsContent />
    </Suspense>
  );
}
