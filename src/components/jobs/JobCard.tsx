import Link from 'next/link';
import { Job, JOB_TYPES, JOB_TYPE_COLORS } from '@/types';
import { formatSalary, formatDate, getCompanyInitials, getCompanyColor } from '@/lib/utils';
import BookmarkButton from '@/components/jobs/BookmarkButton';

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Marketing: { bg: '#FFF7ED', text: '#C2621B', border: '#FDE68A' },
  Design: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  Business: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  Technology: { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
  Finance: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  'Human Resource': { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
};

export default function JobCard({ job, featured }: JobCardProps) {
  const typeLabel = JOB_TYPES[job.type] || job.type;
  const catStyle = CATEGORY_COLORS[job.category] ?? { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };

  return (
    <Link href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'white',
          border: `1px solid ${featured ? '#C7D2FE' : '#F0F0F5'}`,
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          cursor: 'pointer',
          height: '100%',
          transition: 'box-shadow 0.2s',
        }}
        className="hover:shadow-md"
      >
        {/* Row 1: Logo + Type badge + Bookmark */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getCompanyColor(job.company)}`}>
            {getCompanyInitials(job.company)}
          </div>

          {/* Right side: type badge + bookmark button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1.5px solid #4F46E5',
              color: '#4F46E5',
              background: 'white',
              whiteSpace: 'nowrap',
            }}>
              {typeLabel}
            </span>
            <BookmarkButton jobId={job.id} size={16} />
          </div>
        </div>

        {/* Row 2: Title */}
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A2E', lineHeight: 1.3 }}>
          {job.title}
        </div>

        {/* Row 3: Company • Location */}
        <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
          {job.company}
          {job.location ? <span> &nbsp;·&nbsp; {job.location}</span> : null}
        </div>

        {/* Row 4: Description */}
        <p style={{
          fontSize: '13px',
          color: '#6B7280',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0,
          flex: 1,
        }}>
          {job.company} is looking for {job.title} {job.description?.slice(0, 60)}...
        </p>

        {/* Row 5: Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '999px',
            background: '#FFF7ED', color: '#C2621B', border: '1px solid #FDE68A',
          }}>
            {typeLabel}
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '999px',
            background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}`,
          }}>
            {job.category}
          </span>
        </div>
      </div>
    </Link>
  );
}