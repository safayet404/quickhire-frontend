import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import { Job } from '@/types';

interface FeaturedJobsProps {
  jobs: Job[];
  loading: boolean;
}

export default function FeaturedJobs({ jobs, loading }: FeaturedJobsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>
            Featured <span style={{ color: '#26A4FF' }}>Jobs</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Handpicked top opportunities</p>
        </div>
        <Link href="/jobs" className="flex items-center gap-1" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
          Show all <ArrowRight size={15} />
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-100" style={{ height: '200px' }} />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map(job => <JobCard key={job.id} job={job} featured />)}
        </div>
      )}
    </section>
  );
}
