'use client';

import { useState } from 'react';
import axios from 'axios';
import { Plus, X, Briefcase, GraduationCap, User, Link as LinkIcon } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const COMMON_SKILLS = ['React', 'Vue.js', 'Next.js', 'TypeScript', 'JavaScript', 'Laravel', 'Node.js', 'Python', 'Figma', 'Tailwind CSS', 'PostgreSQL', 'MySQL', 'Docker', 'AWS'];

interface Props {
  profile: any;
  token: string;
  onSaved: (profile: any) => void;
}

export default function SeekerProfileForm({ profile, token, onSaved }: Props) {
  const [form, setForm] = useState({
    headline:     profile?.headline || '',
    bio:          profile?.bio || '',
    phone:        profile?.phone || '',
    location:     profile?.location || '',
    website:      profile?.website || '',
    linkedin:     profile?.linkedin || '',
    github:       profile?.github || '',
    resume_url:   profile?.resume_url || '',
    skills:       (profile?.skills || []) as string[],
    experience:   (profile?.experience || []) as any[],
    education:    (profile?.education || []) as any[],
    open_to_work: profile?.open_to_work ?? true,
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s)) {
      set('skills', [...form.skills, s]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => set('skills', form.skills.filter(s => s !== skill));

  const addExperience = () => {
    set('experience', [...form.experience, {
      title: '', company: '', location: '', start_date: '', end_date: '', current: false, description: '',
    }]);
  };

  const updateExperience = (i: number, key: string, value: any) => {
    const updated = [...form.experience];
    updated[i] = { ...updated[i], [key]: value };
    set('experience', updated);
  };

  const removeExperience = (i: number) => set('experience', form.experience.filter((_, idx) => idx !== i));

  const addEducation = () => {
    set('education', [...form.education, { degree: '', school: '', start_year: '', end_year: '' }]);
  };

  const updateEducation = (i: number, key: string, value: string) => {
    const updated = [...form.education];
    updated[i] = { ...updated[i], [key]: value };
    set('education', updated);
  };

  const removeEducation = (i: number) => set('education', form.education.filter((_, idx) => idx !== i));

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
    width: '100%', padding: '10px 14px', border: `1px solid ${key && errors[key] ? '#FECACA' : '#E5E7EB'}`,
    borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, background: 'white',
  });

  const cardStyle = { background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #F0F0F5', marginBottom: '20px' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' } as const;
  const sectionTitle = { fontSize: '16px', fontWeight: 700, color: '#1A1A2E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' } as const;

  return (
    <form onSubmit={handleSubmit}>

      {success && (
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#16A34A', fontSize: '14px', fontWeight: 500 }}>
          ✅ Profile saved successfully!
        </div>
      )}

      {/* Open to work toggle */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1A1A2E' }}>Open to Work</div>
          <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>Let employers know you're actively looking</div>
        </div>
        <button
          type="button"
          onClick={() => set('open_to_work', !form.open_to_work)}
          style={{ width: '48px', height: '26px', borderRadius: '999px', background: form.open_to_work ? '#4F46E5' : '#E5E7EB', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
        >
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: form.open_to_work ? '25px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        </button>
      </div>

      {/* Basic Info */}
      <div style={cardStyle}>
        <div style={sectionTitle}><User size={16} color="#4F46E5" /> Basic Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Headline</label>
            <input style={inputStyle('headline')} value={form.headline} onChange={e => set('headline', e.target.value)} placeholder="e.g. Senior React Developer" />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle()} value={form.location} onChange={e => set('location', e.target.value)} placeholder="New York, USA" />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle()} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" />
          </div>
          <div>
            <label style={labelStyle}>Resume URL (PDF link)</label>
            <input style={inputStyle()} value={form.resume_url} onChange={e => set('resume_url', e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div style={{ marginTop: '14px' }}>
          <label style={labelStyle}>Bio</label>
          <textarea style={{ ...inputStyle(), height: '100px', resize: 'vertical' }} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell employers about yourself..." />
        </div>
      </div>

      {/* Links */}
      <div style={cardStyle}>
        <div style={sectionTitle}><LinkIcon size={16} color="#4F46E5" /> Links</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {[
            { key: 'website', label: 'Website', placeholder: 'https://yoursite.com' },
            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
            { key: 'github', label: 'GitHub', placeholder: 'https://github.com/...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input style={inputStyle(key)} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
              {errors[key] && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors[key]}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div style={cardStyle}>
        <div style={sectionTitle}><span>🛠</span> Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {form.skills.map(skill => (
            <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#EEF2FF', color: '#4F46E5', fontSize: '13px', fontWeight: 500, padding: '5px 12px', borderRadius: '999px' }}>
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818CF8', padding: 0, display: 'flex' }}><X size={12} /></button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
            placeholder="Type a skill and press Enter"
            style={{ ...inputStyle(), flex: 1 }}
          />
          <button type="button" onClick={() => addSkill(skillInput)} style={{ background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {COMMON_SKILLS.filter(s => !form.skills.includes(s)).map(s => (
            <button key={s} type="button" onClick={() => addSkill(s)} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '999px', border: '1px solid #E5E7EB', background: 'white', color: '#6B7280', cursor: 'pointer' }}>
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div style={cardStyle}>
        <div style={{ ...sectionTitle, justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Briefcase size={16} color="#4F46E5" /> Experience</span>
          <button type="button" onClick={addExperience} style={{ fontSize: '13px', color: '#4F46E5', background: '#EEF2FF', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={13} /> Add
          </button>
        </div>
        {form.experience.map((exp, i) => (
          <div key={i} style={{ border: '1px solid #F0F0F5', borderRadius: '12px', padding: '18px', marginBottom: '12px', position: 'relative' }}>
            <button type="button" onClick={() => removeExperience(i)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={16} /></button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={labelStyle}>Job Title</label><input style={inputStyle()} value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} placeholder="Senior Developer" /></div>
              <div><label style={labelStyle}>Company</label><input style={inputStyle()} value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Acme Inc." /></div>
              <div><label style={labelStyle}>Location</label><input style={inputStyle()} value={exp.location} onChange={e => updateExperience(i, 'location', e.target.value)} placeholder="New York / Remote" /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '22px' }}>
                <input type="checkbox" id={`current-${i}`} checked={exp.current} onChange={e => updateExperience(i, 'current', e.target.checked)} />
                <label htmlFor={`current-${i}`} style={{ fontSize: '13px', color: '#374151' }}>Currently working here</label>
              </div>
              <div><label style={labelStyle}>Start Date</label><input type="month" style={inputStyle()} value={exp.start_date} onChange={e => updateExperience(i, 'start_date', e.target.value)} /></div>
              {!exp.current && <div><label style={labelStyle}>End Date</label><input type="month" style={inputStyle()} value={exp.end_date} onChange={e => updateExperience(i, 'end_date', e.target.value)} /></div>}
            </div>
            <div style={{ marginTop: '12px' }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle(), height: '80px', resize: 'vertical' }} value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} placeholder="What did you accomplish?" /></div>
          </div>
        ))}
        {form.experience.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No experience added yet.</p>}
      </div>

      {/* Education */}
      <div style={cardStyle}>
        <div style={{ ...sectionTitle, justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap size={16} color="#4F46E5" /> Education</span>
          <button type="button" onClick={addEducation} style={{ fontSize: '13px', color: '#4F46E5', background: '#EEF2FF', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={13} /> Add
          </button>
        </div>
        {form.education.map((edu, i) => (
          <div key={i} style={{ border: '1px solid #F0F0F5', borderRadius: '12px', padding: '18px', marginBottom: '12px', position: 'relative' }}>
            <button type="button" onClick={() => removeEducation(i)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={16} /></button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={labelStyle}>Degree</label><input style={inputStyle()} value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="B.Sc. Computer Science" /></div>
              <div><label style={labelStyle}>School</label><input style={inputStyle()} value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} placeholder="MIT" /></div>
              <div><label style={labelStyle}>Start Year</label><input style={inputStyle()} value={edu.start_year} onChange={e => updateEducation(i, 'start_year', e.target.value)} placeholder="2018" /></div>
              <div><label style={labelStyle}>End Year</label><input style={inputStyle()} value={edu.end_year} onChange={e => updateEducation(i, 'end_year', e.target.value)} placeholder="2022" /></div>
            </div>
          </div>
        ))}
        {form.education.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No education added yet.</p>}
      </div>

      {/* Save */}
      <button type="submit" disabled={saving} style={{ width: '100%', background: saving ? '#A5B4FC' : '#4F46E5', color: 'white', fontWeight: 600, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
