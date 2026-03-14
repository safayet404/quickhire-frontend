import Link from 'next/link';
import { MapPin, DollarSign } from 'lucide-react';
import { Job, JOB_TYPES } from '@/types';
import { formatSalary, getCompanyInitials, getCompanyColor } from '@/lib/utils';
import BookmarkButton from '@/components/jobs/BookmarkButton';

interface JobCardProps {
  job: Job;
  featured?: boolean;
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

export default function JobCard({ job, featured }: JobCardProps) {
  const typeLabel = JOB_TYPES[job.type] || job.type;
  const typeConf = TYPE_CONFIG[job.type] || { bg: '#F9FAFB', color: '#6B7280' };
  const catConf = CATEGORY_CONFIG[job.category] || { bg: '#F9FAFB', color: '#6B7280', emoji: '💼' };

  return (
    <Link href={`/jobs/${job.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div style={{
        background: 'white',
        border: `1.5px solid ${featured ? '#C7D2FE' : '#F0F0F5'}`,
        borderRadius: '20px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        height: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="hover:shadow-lg hover:-translate-y-0.5"
      >
        {/* Featured glow strip */}
        {featured && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #26A4FF)', borderRadius: '20px 20px 0 0' }} />
        )}

        {/* Row 1: Logo + Bookmark */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ position: 'relative' }}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getCompanyColor(job.company)}`}>
              {getCompanyInitials(job.company)}
            </div>
            {featured && (
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '48px', height: '48px', borderRadius: '50%', background: '#F59E0B', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '17px' }}> {getCompanyInitials(job.company)} </span>
              </div>
            )}
          </div>
          <BookmarkButton jobId={job.id} size={16} />
        </div>

        {/* Row 2: Title + Company */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', lineHeight: 1.3, marginBottom: '5px' }}>
            {job.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9CA3AF' }}>
            <span style={{ fontWeight: 500, color: '#6B7280' }}>{job.company}</span>
            {job.location && (
              <>
                <span>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <MapPin size={11} /> {job.location}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Row 3: Description */}
        <p style={{
          fontSize: '12.5px', color: '#9CA3AF', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any,
          overflow: 'hidden', margin: '0 0 14px', flex: 1,
        }}>
          {job.description?.slice(0, 100)}...
        </p>

        {/* Salary if available */}
        {(job.salary_min || job.salary_max) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#16A34A', fontWeight: 600, marginBottom: '12px' }}>
            <DollarSign size={12} />
            {formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}
            <span style={{ color: '#9CA3AF', fontWeight: 400 }}>/year</span>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: '1px', background: '#F3F4F6', marginBottom: '12px' }} />

        {/* Row 4: Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {/* Type pill */}
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px',
              background: typeConf.bg, color: typeConf.color,
            }}>
              {typeLabel}
            </span>
            {/* Category pill */}
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px',
              background: catConf.bg, color: catConf.color,
              display: 'flex', alignItems: 'center', gap: '3px',
            }}>
              <span style={{ fontSize: '10px' }}>{catConf.emoji}</span>
              {job.category}
            </span>
          </div>

          {/* Arrow */}
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F5F5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}