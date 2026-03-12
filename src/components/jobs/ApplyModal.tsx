'use client';

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Job } from '@/types';
import { submitApplication } from '@/lib/api';

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
}

export default function ApplyModal({ job, onClose }: ApplyModalProps) {
  const [form, setForm] = useState({ name: '', email: '', resume_link: '', cover_note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(ev => ({ ...ev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.resume_link.trim()) errs.resume_link = 'Resume link is required';
    else {
      try { new URL(form.resume_link); } catch { errs.resume_link = 'Enter a valid URL'; }
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    try {
      await submitApplication({ ...form, job_id: job.id });
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (error?.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(([k, v]) => {
          apiErrors[k] = v[0];
        });
        setErrors(apiErrors);
      } else {
        setServerError(error?.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="font-bold text-xl text-gray-900">Apply for this position</h2>
            <p className="text-sm text-gray-500 mt-1">{job.title} at {job.company}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-500 text-sm">We've received your application for <strong>{job.title}</strong> at {job.company}. We'll be in touch soon!</p>
              <button onClick={onClose} className="btn-primary mt-6">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {serverError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                  <AlertCircle size={16} />
                  <span>{serverError}</span>
                </div>
              )}

              <div>
                <label className="label">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={`input ${errors.name ? 'border-red-300' : ''}`} placeholder="John Smith" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="label">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={`input ${errors.email ? 'border-red-300' : ''}`} placeholder="john@example.com" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="label">Resume Link *</label>
                <input name="resume_link" value={form.resume_link} onChange={handleChange} className={`input ${errors.resume_link ? 'border-red-300' : ''}`} placeholder="https://drive.google.com/..." />
                {errors.resume_link && <p className="text-xs text-red-500 mt-1">{errors.resume_link}</p>}
                <p className="text-xs text-gray-400 mt-1">Link to your resume (Google Drive, Dropbox, etc.)</p>
              </div>

              <div>
                <label className="label">Cover Note</label>
                <textarea name="cover_note" value={form.cover_note} onChange={handleChange} rows={4} className="input resize-none" placeholder="Tell us why you're a great fit for this role..." />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
