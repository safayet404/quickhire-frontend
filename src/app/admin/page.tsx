'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit, Eye, X, Loader2, AlertCircle, CheckCircle, Briefcase, Users, ChevronDown } from 'lucide-react';
import { createJob, deleteJob, getJobs, getApplications } from '@/lib/api';
import { Job, Application, JOB_CATEGORIES, JOB_TYPES } from '@/types';
import { formatDate, formatSalary, getCompanyInitials, getCompanyColor } from '@/lib/utils';

type Tab = 'jobs' | 'applications';

const EMPTY_FORM = {
  title: '', company: '', location: '', category: '', type: 'full-time',
  salary_min: '', salary_max: '', description: '', requirements: '',
  is_featured: false,
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getJobs({ per_page: 50 }),
      getApplications({ per_page: 50 }),
    ]).then(([j, a]) => {
      setJobs(j.data.data || []);
      setApplications(a.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setFormErrors(errs => ({ ...errs, [name]: '' }));
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (!form.company.trim()) errs.company = 'Required';
    if (!form.location.trim()) errs.location = 'Required';
    if (!form.category) errs.category = 'Required';
    if (!form.description.trim()) errs.description = 'Required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        requirements: form.requirements
          ? form.requirements.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
      };
      await createJob(payload);
      showToast('success', 'Job created successfully!');
      setShowForm(false);
      setForm(EMPTY_FORM);
      loadData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (error?.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(([k, v]) => { apiErrors[k] = v[0]; });
        setFormErrors(apiErrors);
      } else {
        showToast('error', error?.response?.data?.message || 'Something went wrong.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this job? This will also delete all applications for it.')) return;
    setDeletingId(id);
    try {
      await deleteJob(id);
      showToast('success', 'Job deleted.');
      loadData();
    } catch {
      showToast('error', 'Failed to delete job.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-500 text-sm mt-1">Manage jobs and applications</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Post a Job
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { icon: Briefcase, label: 'Total Jobs', value: jobs.length },
              { icon: Users, label: 'Applications', value: applications.length },
              { icon: Briefcase, label: 'Featured', value: jobs.filter(j => j.is_featured).length },
              { icon: Briefcase, label: 'Remote', value: jobs.filter(j => j.type === 'remote').length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">{value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mt-6 border-b -mb-px">
            {(['jobs', 'applications'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
                  tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-primary animate-spin" />
          </div>
        ) : tab === 'jobs' ? (
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
                <p>No jobs yet. Create your first one!</p>
              </div>
            ) : jobs.map(job => (
              <div key={job.id} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${getCompanyColor(job.company)}`}>
                  {getCompanyInitials(job.company)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 truncate">{job.title}</span>
                    {job.is_featured && <span className="badge bg-amber-50 text-amber-700">Featured</span>}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {job.company} · {job.location} · {JOB_TYPES[job.type]}
                    · {formatSalary(job.salary_min, job.salary_max)}
                    · <span className="text-gray-400">{formatDate(job.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/jobs/${job.id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="View">
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    {deletingId === job.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Users size={40} className="mx-auto mb-3 text-gray-300" />
                <p>No applications yet.</p>
              </div>
            ) : applications.map(app => (
              <div key={app.id} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-gray-900">{app.name}</div>
                    <div className="text-sm text-gray-500">{app.email}</div>
                    {app.job && <div className="text-xs text-primary mt-1">{app.job.title} at {app.job.company}</div>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-400">{formatDate(app.created_at)}</div>
                    <a href={app.resume_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">
                      View Resume →
                    </a>
                  </div>
                </div>
                {app.cover_note && (
                  <p className="text-sm text-gray-500 mt-3 border-t pt-3 line-clamp-2">{app.cover_note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-xl text-gray-900">Post a New Job</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Job Title *</label>
                  <input name="title" value={form.title} onChange={handleFormChange} className={`input ${formErrors.title ? 'border-red-300' : ''}`} placeholder="e.g. Senior Designer" />
                  {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
                </div>
                <div>
                  <label className="label">Company *</label>
                  <input name="company" value={form.company} onChange={handleFormChange} className={`input ${formErrors.company ? 'border-red-300' : ''}`} placeholder="e.g. Acme Inc." />
                  {formErrors.company && <p className="text-xs text-red-500 mt-1">{formErrors.company}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Location *</label>
                  <input name="location" value={form.location} onChange={handleFormChange} className={`input ${formErrors.location ? 'border-red-300' : ''}`} placeholder="e.g. Remote, New York" />
                  {formErrors.location && <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>}
                </div>
                <div>
                  <label className="label">Category *</label>
                  <div className="relative">
                    <select name="category" value={form.category} onChange={handleFormChange} className={`input appearance-none pr-8 ${formErrors.category ? 'border-red-300' : ''}`}>
                      <option value="">Select category</option>
                      {JOB_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {formErrors.category && <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Job Type</label>
                  <div className="relative">
                    <select name="type" value={form.type} onChange={handleFormChange} className="input appearance-none pr-8">
                      {Object.entries(JOB_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="label">Salary Min ($)</label>
                  <input name="salary_min" type="number" value={form.salary_min} onChange={handleFormChange} className="input" placeholder="e.g. 80000" />
                </div>
                <div>
                  <label className="label">Salary Max ($)</label>
                  <input name="salary_max" type="number" value={form.salary_max} onChange={handleFormChange} className="input" placeholder="e.g. 120000" />
                </div>
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} rows={5} className={`input resize-none ${formErrors.description ? 'border-red-300' : ''}`} placeholder="Describe the role, responsibilities, and what you're looking for..." />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>

              <div>
                <label className="label">Requirements (one per line)</label>
                <textarea name="requirements" value={form.requirements} onChange={handleFormChange} rows={4} className="input resize-none" placeholder="5+ years of experience&#10;Proficiency in React&#10;Strong communication skills" />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_featured" name="is_featured" checked={form.is_featured} onChange={handleFormChange} className="w-4 h-4 text-primary" />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Mark as Featured job</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-outline">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? 'Creating...' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
