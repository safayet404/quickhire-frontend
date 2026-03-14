'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Job, JOB_CATEGORIES, JOB_TYPES } from '@/types';
import { useToast } from '@/context/ToastContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Props {
  token: string;
  job?: Job | null;
  onClose: () => void;
  onSaved: (job: Job, isEdit: boolean) => void;
}

export default function PostJobModal({ token, job, onClose, onSaved }: Props) {
  const toast = useToast();
  const isEdit = !!job;

  const [form, setForm] = useState({
    title: job?.title || '',
    company: job?.company || '',
    company_logo: job?.company_logo || '',
    location: job?.location || '',
    category: job?.category || '',
    type: job?.type || 'full-time',
    salary_min: job?.salary_min?.toString() || '',
    salary_max: job?.salary_max?.toString() || '',
    description: job?.description || '',
    requirements: (job?.requirements || []) as string[],
    is_featured: job?.is_featured || false,
  });
  const [newReq, setNewReq] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const addReq = () => {
    if (newReq.trim()) { set('requirements', [...form.requirements, newReq.trim()]); setNewReq(''); }
  };
  const removeReq = (i: number) => set('requirements', form.requirements.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? parseInt(form.salary_min) : null,
        salary_max: form.salary_max ? parseInt(form.salary_max) : null,
        requirements: form.requirements.length ? form.requirements : null,
      };
      let res;
      if (isEdit) {
        res = await axios.put(`${API}/employer/jobs/${job!.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Job updated successfully!');
      } else {
        res = await axios.post(`${API}/employer/jobs`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Job posted successfully!');
      }
      onSaved(res.data.data, isEdit);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(err.response.data.errors).forEach(([k, v]) => { mapped[k] = (v as string[])[0]; });
        setErrors(mapped);
        toast.error('Please fix the errors below.');
      } else {
        toast.error(err.response?.data?.message || 'Something went wrong.');
      }
    } finally { setSaving(false); }
  };

  const inp = (k?: string) => ({
    width: '100%', padding: '10px 14px',
    border: `1px solid ${k && errors[k] ? '#FECACA' : '#E5E7EB'}`,
    borderRadius: '8px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box' as const, background: 'white',
  });
  const label = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' } as const;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid #F0F0F5' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A2E' }}>{isEdit ? 'Edit Job' : 'Post a New Job'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px', display: 'flex' }}>
            <X size={20} color="#6B7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Job Title *</label>
              <input style={inp('title')} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior React Developer" required />
              {errors.title && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
            </div>

            <div>
              <label style={label}>Company Name *</label>
              <input style={inp('company')} value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Inc." required />
              {errors.company && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.company}</p>}
            </div>

            <div>
              <label style={label}>Location *</label>
              <input style={inp('location')} value={form.location} onChange={e => set('location', e.target.value)} placeholder="New York / Remote" required />
            </div>

            <div>
              <label style={label}>Category *</label>
              <select style={inp('category')} value={form.category} onChange={e => set('category', e.target.value)} required>
                <option value="">Select category</option>
                {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={label}>Job Type *</label>
              <select style={inp()} value={form.type} onChange={e => set('type', e.target.value)}>
                {Object.entries(JOB_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            <div>
              <label style={label}>Salary Min (USD/yr)</label>
              <input type="number" style={inp()} value={form.salary_min} onChange={e => set('salary_min', e.target.value)} placeholder="50000" min={0} />
            </div>
            <div>
              <label style={label}>Salary Max (USD/yr)</label>
              <input type="number" style={inp()} value={form.salary_max} onChange={e => set('salary_max', e.target.value)} placeholder="80000" min={0} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Company Logo URL</label>
              <input style={inp()} value={form.company_logo} onChange={e => set('company_logo', e.target.value)} placeholder="https://company.com/logo.png" />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Job Description *</label>
              <textarea style={{ ...inp('description'), height: '120px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role, responsibilities..." required />
              {errors.description && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.description}</p>}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Requirements</label>
              {form.requirements.map((req, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1, padding: '9px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', color: '#374151' }}>{req}</div>
                  <button type="button" onClick={() => removeReq(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#DC2626', display: 'flex' }}><Trash2 size={15} /></button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={newReq} onChange={e => setNewReq(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addReq(); } }} placeholder="Type a requirement and press Enter" style={{ ...inp(), flex: 1 }} />
                <button type="button" onClick={addReq} style={{ background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}>
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button type="button" onClick={() => set('is_featured', !form.is_featured)}
                style={{ width: '44px', height: '24px', borderRadius: '999px', background: form.is_featured ? '#4F46E5' : '#E5E7EB', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: form.is_featured ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
              <span style={{ fontSize: '14px', color: '#374151' }}>Mark as Featured job</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', background: 'white', color: '#6B7280', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: '12px', background: saving ? '#A5B4FC' : '#4F46E5', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}