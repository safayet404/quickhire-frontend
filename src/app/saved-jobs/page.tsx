'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, MapPin, ArrowRight, Briefcase, DollarSign } from 'lucide-react';
import BookmarkButton from '@/components/jobs/BookmarkButton';
import axios from 'axios';
import { formatSalary, formatDate, getCompanyInitials, getCompanyColor } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface SavedJob {
  id: number;
  job_id: number;
  created_at: string;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    salary_min: number | null;
    salary_max: number | null;
    is_featured: boolean;
    created_at: string;
  };
}

export default function SavedJobsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user && token) fetchSaved();
  }, [user, token, authLoading]);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs(res.data.data);
    } catch { }
    finally { setLoading(false); }
  };

  // Remove from list when unbookmarked
  const handleUnsave = (jobId: number) => {
    setSavedJobs(prev => prev.filter(s => s.job_id !== jobId));
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Loading saved jobs...</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '40px 0' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>Saved Jobs</h1>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
              {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} bookmarked
            </p>
          </div>
          <Link href="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#4F46E5', textDecoration: 'none', background: '#EEF2FF', padding: '9px 18px', borderRadius: '10px' }}>
            Browse More <ArrowRight size={15} />
          </Link>
        </div>

        {/* Empty state */}
        {savedJobs.length === 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '64px 20px', textAlign: 'center', border: '1px solid #F0F0F5' }}>
            <Bookmark size={44} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
            <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#374151', marginBottom: '6px' }}>No saved jobs yet</h3>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px' }}>Bookmark jobs you're interested in and find them here.</p>
            <Link href="/jobs" style={{ background: '#4F46E5', color: 'white', padding: '11px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Browse Jobs <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Jobs list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {savedJobs.map(({ id, job_id, created_at, job }) => (
            <div key={id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F5', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>

              {/* Logo */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 ${getCompanyColor(job.company)}`}>
                {getCompanyInitials(job.company)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <Link href={`/jobs/${job.id}`} style={{ fontWeight: 600, fontSize: '15px', color: '#1A1A2E', textDecoration: 'none' }} className="hover:text-indigo-600">
                    {job.title}
                  </Link>
                  {job.is_featured && <span style={{ fontSize: '11px', fontWeight: 600, background: '#FFFBEB', color: '#D97706', padding: '2px 8px', borderRadius: '999px' }}>⭐ Featured</span>}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#9CA3AF' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={12} /> {job.company}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {job.location}
                  </span>
                  {(job.salary_min || job.salary_max) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={12} /> {formatSalary(job.salary_min ?? undefined, job.salary_max ?? undefined)}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', background: '#F5F5FA', color: '#6B7280', padding: '3px 10px', borderRadius: '999px' }}>{job.type}</span>
                  <span style={{ fontSize: '12px', background: '#F5F5FA', color: '#6B7280', padding: '3px 10px', borderRadius: '999px' }}>{job.category}</span>
                  <span style={{ fontSize: '12px', color: '#C4B5FD' }}>Saved {formatDate(created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                <BookmarkButton jobId={job_id} />
                <Link href={`/jobs/${job.id}`} style={{ fontSize: '13px', fontWeight: 600, color: '#4F46E5', textDecoration: 'none', background: '#EEF2FF', padding: '6px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View <ArrowRight size={13} />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
