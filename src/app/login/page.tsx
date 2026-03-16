'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Briefcase, CheckCircle } from 'lucide-react';
import axios from 'axios';

const demoAccounts = [
    { role: 'Seeker', email: 'alex@example.com', password: 'password', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', initials: 'SK' },
    { role: 'Employer', email: 'nomad@example.com', password: 'password', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', initials: 'EM' },
    { role: 'Admin', email: 'admin@quickhire.com', password: 'admin123', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', initials: 'AD' },
];

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDemo, setSelectedDemo] = useState('');

    const fillDemo = (acc: typeof demoAccounts[0]) => {
        setEmail(acc.email);
        setPassword(acc.password);
        setSelectedDemo(acc.email);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Invalid email or password.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>

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
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>Welcome back</h1>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '28px' }}>Sign in to your account to continue</p>

                    {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#DC2626', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setSelectedDemo(''); }}
                                placeholder="you@example.com"
                                required
                                style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', color: '#1A1A2E', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Password</label>
                                <Link href="/forgot-password" style={{ fontSize: '13px', color: '#4F46E5', textDecoration: 'none' }}>Forgot password?</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{ width: '100%', padding: '11px 40px 11px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', color: '#1A1A2E', outline: 'none', boxSizing: 'border-box' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', background: loading ? '#A5B4FC' : '#4F46E5', color: 'white', fontWeight: 600, fontSize: '15px', padding: '13px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {loading && (
                                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            )}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo accounts */}
                    <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
                        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                            Try a demo account
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {demoAccounts.map(acc => (
                                <button
                                    key={acc.email}
                                    type="button"
                                    onClick={() => fillDemo(acc)}
                                    style={{
                                        background: selectedDemo === acc.email ? acc.bg : '#FAFAFA',
                                        border: `1px solid ${selectedDemo === acc.email ? acc.border : '#E5E7EB'}`,
                                        borderRadius: '10px',
                                        padding: '10px 8px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.15s ease',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Checkmark */}
                                    {selectedDemo === acc.email && (
                                        <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                                            <CheckCircle size={12} color={acc.color} />
                                        </div>
                                    )}
                                    {/* Avatar */}
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: acc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '11px', fontWeight: 700, color: 'white' }}>
                                        {acc.initials}
                                    </div>
                                    <p style={{ fontSize: '12px', fontWeight: 600, color: selectedDemo === acc.email ? acc.color : '#374151', margin: 0 }}>
                                        {acc.role}
                                    </p>
                                    <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {acc.email}
                                    </p>
                                </button>
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '11px', color: '#C4C4C4', marginTop: '10px' }}>
                            Click any card to auto-fill credentials
                        </p>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6B7280' }}>
                        Don&#39;t have an account?{' '}
                        <Link href="/register" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}