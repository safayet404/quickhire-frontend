'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, FileText, CheckCircle, XCircle, Eye, Clock, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { Job, Application } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  color: '#D97706', bg: '#FFFBEB', icon: Clock },
  reviewed: { label: 'Reviewed', color: '#2563EB', bg: '#EFF6FF', icon: Eye },
  accepted: { label: 'Accepted', color: '#16A34A', bg: '#F0FDF4', icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2', icon: XCircle },
};

interface Props {
  token: string;
  job: Job;
  onClose: () => void;
}

export default function ApplicantsModal({ token, job, onClose }: Props) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);
  const [updatingId, setUpdatingId]     = useState<number | null>(null);
  const [noteFor, setNoteFor]           = useState<number | null>(null);
  const [noteText, setNoteText]         = useState('');

  useEffect(() => {
    axios.get(`${API}/employer/jobs/${job.id}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setApplications(res.data.data))
      .finally(() => setLoading(false));
  }, [job.id, token]);

  const updateStatus = async (id: number, status: string, note?: string) => {
    setUpdatingId(id);
    try {
      const res = await axios.patch(`${API}/employer/applications/${id}/status`,
        { status, status_note: note || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(prev => prev.map(a => a.id === id ? { ...a, ...res.data.data } : a));
      setNoteFor(null);
      setNoteText('');
    } catch { }
    finally { setUpdatingId(null); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '740px', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid #F0F0F5', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A2E' }}>Applicants — {job.title}</h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <X size={20} color="#6B7280" />
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 size={24} color="#A5B4FC" className="animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
              <FileText size={36} style={{ margin: '0 auto 12px', color: '#E5E7EB' }} />
              <p style={{ fontSize: '14px' }}>No applications yet for this job.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {applications.map(app => {
                const cfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <div key={app.id} style={{ border: '1px solid #F0F0F5', borderRadius: '14px', padding: '18px 20px' }}>

                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '15px', color: '#1A1A2E' }}>{app.name}</div>
                        <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{app.email} · Applied {formatDate(app.created_at)}</div>
                        {app.user?.seeker_profile?.headline && (
                          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{app.user.seeker_profile.headline}</div>
                        )}
                        {app.user?.seeker_profile?.skills && app.user.seeker_profile.skills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                            {app.user.seeker_profile.skills.slice(0, 5).map(s => (
                              <span key={s} style={{ fontSize: '11px', background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '999px' }}>{s}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Status badge */}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: cfg.bg, color: cfg.color, fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '999px', flexShrink: 0 }}>
                        <Icon size={12} /> {cfg.label}
                      </span>
                    </div>

                    {/* Cover note */}
                    {app.cover_note && (
                      <div style={{ marginTop: '12px', fontSize: '13px', color: '#6B7280', background: '#F9FAFB', borderRadius: '8px', padding: '10px 14px', borderLeft: '3px solid #E5E7EB', fontStyle: 'italic' }}>
                        "{app.cover_note}"
                      </div>
                    )}

                    {/* Status note */}
                    {app.status_note && (
                      <div style={{ marginTop: '8px', fontSize: '13px', color: '#6B7280', background: '#FFFBEB', borderRadius: '8px', padding: '8px 12px', borderLeft: `3px solid ${cfg.color}` }}>
                        <strong>Note:</strong> {app.status_note}
                      </div>
                    )}

                    {/* Note input */}
                    {noteFor === app.id && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <input
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Optional note to applicant..."
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                        />
                        <button onClick={() => setNoteFor(null)} style={{ padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white', color: '#6B7280', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                      <a href={app.resume_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#4F46E5', textDecoration: 'none', background: '#EEF2FF', padding: '6px 12px', borderRadius: '8px' }}>
                        <FileText size={13} /> Resume <ExternalLink size={11} />
                      </a>

                      {(['reviewed', 'accepted', 'rejected'] as const).filter(s => s !== app.status).map(s => {
                        const c = STATUS_CONFIG[s];
                        return (
                          <button
                            key={s}
                            disabled={updatingId === app.id}
                            onClick={() => noteFor === app.id ? updateStatus(app.id, s, noteText) : updateStatus(app.id, s)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: c.color, background: c.bg, border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
                          >
                            {updatingId === app.id ? <Loader2 size={12} className="animate-spin" /> : <c.icon size={12} />}
                            Mark {c.label}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => { setNoteFor(noteFor === app.id ? null : app.id); setNoteText(app.status_note || ''); }}
                        style={{ fontSize: '12px', color: '#6B7280', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        {noteFor === app.id ? 'Hide Note' : '+ Add Note'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
