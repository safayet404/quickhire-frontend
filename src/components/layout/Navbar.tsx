'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setDropdownOpen(false);
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #F0F0F5', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '34px', height: '34px', background: '#4F46E5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={17} color="white" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A2E' }}>QuickHire</span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link href="/jobs" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Find Jobs</Link>
            <Link href="/companies" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Companies</Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Admin</Link>
            )}
          </div>

          {/* Auth buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isAuthenticated ? (
              <>
                <Link href="/login" style={{ fontSize: '14px', fontWeight: 600, color: '#4F46E5', textDecoration: 'none' }}>Login</Link>
                <Link href="/register" style={{ fontSize: '14px', fontWeight: 600, color: 'white', background: '#4F46E5', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </>
            ) : (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F5FA', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '7px 14px', cursor: 'pointer' }}
                >
                  {/* Avatar */}
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{user?.name[0].toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E' }}>{user?.name.split(' ')[0]}</span>
                  <ChevronDown size={14} color="#9CA3AF" />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    style={{ position: 'absolute', right: 0, top: '48px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: '200px', zIndex: 100, overflow: 'hidden' }}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    {/* User info */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F0F5' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E' }}>{user?.name}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{user?.email}</div>
                      <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#EEF2FF', color: '#4F46E5', textTransform: 'capitalize' }}>
                        {user?.role}
                      </span>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: '6px' }}>
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontSize: '14px' }}
                        className="hover:bg-gray-50"
                      >
                        <LayoutDashboard size={15} color="#6B7280" /> Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontSize: '14px' }}
                        className="hover:bg-gray-50"
                      >
                        <User size={15} color="#6B7280" /> My Profile
                      </Link>
                    </div>

                    <div style={{ padding: '6px', borderTop: '1px solid #F0F0F5' }}>
                      <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', color: '#DC2626', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                        className="hover:bg-red-50"
                      >
                        <LogOut size={15} color="#DC2626" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}