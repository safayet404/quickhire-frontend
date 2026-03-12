import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Job } from '@/types';

interface LatestJobsProps {
  jobs: Job[];
  loading: boolean;
}

export default function LatestJobs({ jobs, loading }: LatestJobsProps) {
  return (
    <section style={{ background: '#F9FAFB', padding: '60px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>
              Latest <span style={{ color: '#26A4FF' }}>jobs open</span>
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Freshly posted opportunities</p>
          </div>
          <Link href="/jobs" className="flex items-center gap-1" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
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
            {jobs.map(job => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="hover:shadow-md"
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
              >
                {/* Company logo */}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px', background: '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, overflow: 'hidden',
                }}>
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#6B7280' }}>
                      {job.company?.[0] ?? '?'}
                    </span>
                  )}
                </div>

                {/* Job info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', marginBottom: '2px' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '10px' }}>
                    {job.company}{job.location ? ` • ${job.location}` : ''}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span style={{
                      fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '999px',
                      border: '1px solid #FDE68A', color: '#D97706', background: '#FFFBEB',
                      textTransform: 'capitalize',
                    }}>
                      {job.type.replace('-', ' ')}
                    </span>
                    {job.category && (
                      <span style={{
                        fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '999px',
                        border: '1px solid #C7D2FE', color: '#4F46E5', background: '#EEF2FF',
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
          <Link
            href="/jobs"
            style={{
              background: '#4F46E5', color: 'white', fontWeight: 600,
              padding: '14px 32px', borderRadius: '10px', fontSize: '14px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}
          >
            Browse All Jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
