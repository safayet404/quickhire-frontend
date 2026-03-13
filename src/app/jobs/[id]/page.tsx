'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, Users, DollarSign, Briefcase, ArrowLeft, CheckCircle, Building2 } from 'lucide-react';
import ApplyModal from '@/components/jobs/ApplyModal';
import { getJob } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Job, JOB_TYPES, JOB_TYPE_COLORS } from '@/types';
import { formatSalary, formatDate, getCompanyInitials, getCompanyColor } from '@/lib/utils';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    getJob(id as string)
      .then(res => setJob(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Check if already applied
  useEffect(() => {
    if (!user || !token || !id) return;
    axios.get(`${API}/seeker/applications/check`, {
      params: { job_id: id },
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setApplied(res.data.applied)).catch(() => { });
  }, [user, token, id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-96 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-bold text-2xl mb-2">Job not found</h2>
        <p className="text-gray-500 mb-6">This job may have been removed or expired.</p>
        <Link href="/jobs" className="btn-primary">Browse All Jobs</Link>
      </div>
    );
  }

  const typeLabel = JOB_TYPES[job.type] || job.type;
  const typeColor = JOB_TYPE_COLORS[job.type] || 'bg-gray-50 text-gray-700';

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              <div className="card">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${getCompanyColor(job.company)}`}>
                    {getCompanyInitials(job.company)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Building2 size={14} />{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
                          <span className="flex items-center gap-1"><Clock size={14} />{formatDate(job.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {job.is_featured && <span className="badge bg-amber-50 text-amber-700">⭐ Featured</span>}
                        {applied && <span className="badge bg-green-50 text-green-700"><CheckCircle size={11} className="mr-1" />Applied</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`badge ${typeColor}`}>{typeLabel}</span>
                      <span className="badge bg-gray-50 text-gray-700">{job.category}</span>
                      {job.applications_count !== undefined && (
                        <span className="badge bg-blue-50 text-blue-700">
                          <Users size={11} className="mr-1" />{job.applications_count} applied
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {(job.salary_min || job.salary_max) && (
                  <div className="mt-4 flex items-center gap-2 text-gray-700 font-medium">
                    <DollarSign size={16} className="text-green-500" />
                    {formatSalary(job.salary_min, job.salary_max)}
                    <span className="text-sm font-normal text-gray-400">/ year</span>
                  </div>
                )}
              </div>

              <div className="card">
                <h2 className="font-bold text-lg text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="card">
                  <h2 className="font-bold text-lg text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="card text-center bg-primary">
                <Briefcase size={36} className="text-white mx-auto mb-3 opacity-80" />
                <h3 className="font-bold text-lg text-white mb-2">
                  {applied ? 'Application Sent!' : 'Interested in this role?'}
                </h3>
                <p className="text-indigo-200 text-sm mb-5">
                  {applied ? 'Track your application status below.' : `Join the team at ${job.company}`}
                </p>

                {applied ? (
                  <Link href="/applications" className="w-full block bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors text-center">
                    Track Application
                  </Link>
                ) : (
                  <button onClick={() => setShowApply(true)} className="w-full bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    Apply Now
                  </button>
                )}
              </div>

              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Job Overview</h3>
                <dl className="space-y-4">
                  {[
                    { label: 'Job Type', value: typeLabel },
                    { label: 'Category', value: job.category },
                    { label: 'Location', value: job.location },
                    { label: 'Salary', value: formatSalary(job.salary_min, job.salary_max) },
                    { label: 'Posted', value: formatDate(job.created_at) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">{label}</dt>
                      <dd className="font-medium text-gray-900 mt-0.5">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApply && (
        <ApplyModal
          job={job}
          onClose={() => setShowApply(false)}
          onApplied={() => setApplied(true)}
        />
      )}
    </>
  );
}