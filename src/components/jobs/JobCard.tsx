import Link from 'next/link';
import { MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { Job, JOB_TYPES, JOB_TYPE_COLORS } from '@/types';
import { formatSalary, formatDate, getCompanyInitials, getCompanyColor } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export default function JobCard({ job, featured }: JobCardProps) {
  const typeLabel = JOB_TYPES[job.type] || job.type;
  const typeColor = JOB_TYPE_COLORS[job.type] || 'bg-gray-50 text-gray-700';

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className={`card h-full flex flex-col gap-4 cursor-pointer group ${featured ? 'border-primary/20' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Company avatar */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getCompanyColor(job.company)}`}>
              {getCompanyInitials(job.company)}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">{job.company}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <MapPin size={11} />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          {/* Type badge */}
          <span className={`badge flex-shrink-0 ${typeColor}`}>
            {typeLabel}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug">
            {job.title}
          </h3>
          <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
            {job.category}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{job.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <DollarSign size={12} />
            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div className="flex items-center gap-3">
            {job.applications_count !== undefined && (
              <span className="flex items-center gap-1">
                <Users size={12} />
                {job.applications_count}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(job.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
