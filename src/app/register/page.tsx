'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Briefcase, User, Building2 } from 'lucide-react';
import axios from 'axios';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'seeker' as 'seeker' | 'employer',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.password_confirmation, form.role);
            router.push('/');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data;
                if (data?.errors) {
                    // Laravel validation errors
                    const mapped: Record<string, string> = {};
                    Object.entries(data.errors).forEach(([k, v]) => {
                        mapped[k] = (v as string[])[0];
                    });
                    setErrors(mapped);
                } else {
                    setErrors({ general: data?.message || 'Registration failed.' });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <div style={{ width: '40px', height: '40px', background: '#4F46E5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={20} color="white" />
                        </div>
                        <span style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E' }}>QuickHire</span>
                    </Link>
                </div>

                {/* Card */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #F0F0F5' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>Create an account</h1>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '28px' }}>Join thousands of job seekers and employers</p>

                    {errors.general && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#DC2626', fontSize: '14px' }}>
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Role selector */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>I am a...</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {([
                                    { value: 'seeker', label: 'Job Seeker', desc: 'Looking for jobs', icon: User },
                                    { value: 'employer', label: 'Employer', desc: 'Hiring talent', icon: Building2 },
                                ] as const).map(({ value, label, desc, icon: Icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => set('role', value)}
                                        style={{
                                            padding: '14px',
                                            borderRadius: '10px',
                                            border: `2px solid ${form.role === value ? '#4F46E5' : '#E5E7EB'}`,
                                            background: form.role === value ? '#EEF2FF' : 'white',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <Icon size={20} color={form.role === value ? '#4F46E5' : '#9CA3AF'} />
                                        <div style={{ fontWeight: 600, fontSize: '14px', color: form.role === value ? '#4F46E5' : '#1A1A2E', marginTop: '6px' }}>{label}</div>
                                        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => set('name', e.target.value)}
                                placeholder="John Doe"
                                required
                                style={{ width: '100%', padding: '11px 14px', border: `1px solid ${errors.name ? '#FECACA' : '#E5E7EB'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            />
                            {errors.name && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => set('email', e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={{ width: '100%', padding: '11px 14px', border: `1px solid ${errors.email ? '#FECACA' : '#E5E7EB'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            />
                            {errors.email && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => set('password', e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    style={{ width: '100%', padding: '11px 40px 11px 14px', border: `1px solid ${errors.password ? '#FECACA' : '#E5E7EB'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Confirm Password</label>
                            <input
                                type="password"
                                value={form.password_confirmation}
                                onChange={e => set('password_confirmation', e.target.value)}
                                placeholder="Repeat your password"
                                required
                                style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', background: loading ? '#A5B4FC' : '#4F46E5', color: 'white', fontWeight: 600, fontSize: '15px', padding: '13px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6B7280' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}