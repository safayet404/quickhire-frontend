import Link from 'next/link';
import { ArrowRight, MapPin, DollarSign } from 'lucide-react';
import { Job, JOB_TYPES } from '@/types';
import { formatSalary, getCompanyInitials, getCompanyColor } from '@/lib/utils';
import BookmarkButton from '@/components/jobs/BookmarkButton';

interface LatestJobsProps {
  jobs: Job[];
  loading: boolean;
}

const TYPE_CONFIG: Record<string, { bg: string; color: string }> = {
  'full-time': { bg: '#EEF2FF', color: '#4F46E5' },
  'part-time': { bg: '#FFFBEB', color: '#D97706' },
  'remote': { bg: '#F0FDF4', color: '#16A34A' },
  'contract': { bg: '#FEF2F2', color: '#DC2626' },
  'internship': { bg: '#FDF4FF', color: '#9333EA' },
};

const CATEGORY_CONFIG: Record<string, { bg: string; color: string; emoji: string }> = {
  'Design': { bg: '#F5F3FF', color: '#7C3AED', emoji: '🎨' },
  'Technology': { bg: '#ECFEFF', color: '#0891B2', emoji: '💻' },
  'Marketing': { bg: '#FDF2F8', color: '#DB2777', emoji: '📣' },
  'Finance': { bg: '#FFFBEB', color: '#D97706', emoji: '💰' },
  'Engineering': { bg: '#EEF2FF', color: '#4F46E5', emoji: '⚙️' },
  'Business': { bg: '#F0FDF4', color: '#16A34A', emoji: '🏢' },
  'Sales': { bg: '#EFF6FF', color: '#2563EB', emoji: '📈' },
  'Human Resource': { bg: '#FEF2F2', color: '#DC2626', emoji: '🤝' },
  'Healthcare': { bg: '#F0FDF4', color: '#16A34A', emoji: '🏥' },
};

export default function LatestJobs({ jobs, loading }: LatestJobsProps) {
  return (
    <section style={{ background: '#F9FAFB', padding: '64px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1A1A2E' }}>
              Latest <span style={{ color: '#26A4FF' }}>jobs open</span>
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>Freshly posted opportunities</p>
          </div>
          <Link href="/jobs" style={{ color: '#4F46E5', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Show all jobs <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse" style={{ height: '100px', borderRadius: '16px', background: 'white' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {jobs.map((job, idx) => {
              const typeConf = TYPE_CONFIG[job.type] || { bg: '#F9FAFB', color: '#6B7280' };
              const catConf = CATEGORY_CONFIG[job.category] || { bg: '#F9FAFB', color: '#6B7280', emoji: '💼' };
              const typeLabel = JOB_TYPES[job.type] || job.type;

              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  style={{
                    background: 'white',
                    border: '1.5px solid #F0F0F5',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  className="hover:shadow-md hover:border-indigo-100 group"
                >
                  {/* Left accent bar */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                    background: `linear-gradient(180deg, ${typeConf.color}, ${catConf.color})`,
                    borderRadius: '18px 0 0 18px',
                    opacity: 0.7,
                  }} />

                  {/* Company logo */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                    marginLeft: '6px', overflow: 'hidden', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', borderRadius: '14px',
                        background: `hsl(${Math.abs(job.company.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 360}, 65%, 50%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>
                          {job.company[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Job info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#1A1A2E', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9CA3AF', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 500, color: '#6B7280' }}>{job.company}</span>
                      {job.location && (
                        <>
                          <span>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <MapPin size={10} /> {job.location}
                          </span>
                        </>
                      )}
                      {(job.salary_min || job.salary_max) && (
                        <>
                          <span>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#16A34A', fontWeight: 600 }}>
                            <DollarSign size={10} />{formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}
                          </span>
                        </>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: typeConf.bg, color: typeConf.color }}>
                        {typeLabel}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: catConf.bg, color: catConf.color, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ fontSize: '10px' }}>{catConf.emoji}</span>{job.category}
                      </span>
                    </div>
                  </div>

                  {/* Right: bookmark + arrow */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <BookmarkButton jobId={job.id} size={15} />
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F5F5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Browse all button */}
        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link href="/jobs" style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: 'white', fontWeight: 700, padding: '14px 40px',
            borderRadius: '12px', fontSize: '14px', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
          }}>
            Browse All Jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}