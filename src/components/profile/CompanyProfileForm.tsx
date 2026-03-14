'use client';

import { useState } from 'react';
import axios from 'axios';
import { Building2 } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const INDUSTRIES = ['Technology', 'Fintech', 'Healthcare', 'Education', 'E-commerce', 'Marketing', 'Design', 'Finance', 'Logistics', 'Media', 'Other'];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

interface Props {
  profile: any;
  token: string;
  onSaved: (profile: any) => void;
}

export default function CompanyProfileForm({ profile, token, onSaved }: Props) {
  const [form, setForm] = useState({
    company_name: profile?.company_name || '',
    logo_url:     profile?.logo_url || '',
    website:      profile?.website || '',
    industry:     profile?.industry || '',
    company_size: profile?.company_size || '',
    founded_year: profile?.founded_year || '',
    location:     profile?.location || '',
    description:  profile?.description || '',
    linkedin:     profile?.linkedin || '',
    twitter:      profile?.twitter || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess(false);
    try {
      const res = await axios.put(`${API}/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSaved(res.data.profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(err.response.data.errors).forEach(([k, v]) => { mapped[k] = (v as string[])[0]; });
        setErrors(mapped);
      }
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (key?: string) => ({
    width: '100%', padding: '10px 14px',
    border: `1px solid ${key && errors[key] ? '#FECACA' : '#E5E7EB'}`,
    borderRadius: '8px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box' as const, background: 'white',
  });

  const cardStyle = { background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #F0F0F5', marginBottom: '20px' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' } as const;

  return (
    <form onSubmit={handleSubmit}>

      {success && (
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#16A34A', fontSize: '14px', fontWeight: 500 }}>
          ✅ Company profile saved successfully!
        </div>
      )}

      {/* Basic Info */}
      <div style={cardStyle}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={16} color="#4F46E5" /> Company Information
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Company Name *</label>
            <input style={inputStyle('company_name')} value={form.company_name} onChange={e => set('company_name', e.target.value)} placeholder="Acme Inc." required />
            {errors.company_name && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.company_name}</p>}
          </div>

          <div>
            <label style={labelStyle}>Industry</label>
            <select style={inputStyle()} value={form.industry} onChange={e => set('industry', e.target.value)}>
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Company Size</label>
            <select style={inputStyle()} value={form.company_size} onChange={e => set('company_size', e.target.value)}>
              <option value="">Select size</option>
              {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Founded Year</label>
            <input style={inputStyle()} value={form.founded_year} onChange={e => set('founded_year', e.target.value)} placeholder="2015" maxLength={4} />
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle()} value={form.location} onChange={e => set('location', e.target.value)} placeholder="San Francisco, USA" />
          </div>

          <div>
            <label style={labelStyle}>Website</label>
            <input style={inputStyle('website')} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://company.com" />
            {errors.website && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.website}</p>}
          </div>

          <div>
            <label style={labelStyle}>Logo URL</label>
            <input style={inputStyle('logo_url')} value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="https://company.com/logo.png" />
            {errors.logo_url && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.logo_url}</p>}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Company Description</label>
            <textarea
              style={{ ...inputStyle(), height: '120px', resize: 'vertical' }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Tell job seekers about your company, culture, and mission..."
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div style={cardStyle}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A2E', marginBottom: '20px' }}>Social Links</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={labelStyle}>LinkedIn</label>
            <input style={inputStyle('linkedin')} value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/company/..." />
            {errors.linkedin && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.linkedin}</p>}
          </div>
          <div>
            <label style={labelStyle}>Twitter / X</label>
            <input style={inputStyle('twitter')} value={form.twitter} onChange={e => set('twitter', e.target.value)} placeholder="https://twitter.com/..." />
            {errors.twitter && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.twitter}</p>}
          </div>
        </div>
      </div>

      {/* Logo preview */}
      {form.logo_url && (
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={form.logo_url} alt="Logo preview" style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '12px', border: '1px solid #F0F0F5' }} onError={e => (e.currentTarget.style.display = 'none')} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1A1A2E' }}>{form.company_name || 'Your Company'}</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF' }}>{form.industry} · {form.location}</div>
          </div>
        </div>
      )}

      <button type="submit" disabled={saving} style={{ width: '100%', background: saving ? '#A5B4FC' : '#4F46E5', color: 'white', fontWeight: 600, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
        {saving ? 'Saving...' : 'Save Company Profile'}
      </button>
    </form>
  );
}
