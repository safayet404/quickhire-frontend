'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Briefcase, ChevronDown, User, LogOut, LayoutDashboard,
  Bookmark, FileText, Bell, CheckCheck, X,
} from 'lucide-react';
import Image from 'next/image';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_COLORS: Record<string, string> = {
  application_submitted: '#4F46E5',
  new_application: '#16A34A',
  application_status: '#D97706',
};

export default function Navbar() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { notifications, unreadCount, loading: nLoading, fetchNotifications, markRead, markAllRead, deleteNotification } = useNotifications();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBellOpen = () => {
    if (!bellOpen) fetchNotifications();
    setBellOpen(prev => !prev);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setDropdownOpen(false);
  };

  const handleNotificationClick = async (n: any) => {
    if (!n.is_read) await markRead(n.id);
    if (n.link) router.push(n.link);
    setBellOpen(false);
  };

  const dashboardHref =
    user?.role === 'employer' ? '/dashboard/employer' :
      user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #F0F0F5', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          {/* <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '34px', height: '34px', background: '#4F46E5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={17} color="white" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A2E' }}>QuickHire</span>
          </Link> */}

          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '16px' }}>
            <Image src="/logo.png" alt="QuickHire" width={30} height={30} style={{ borderRadius: '50%' }} />
            <span style={{ fontWeight: 700, fontSize: '17px', color: 'black' }}>
              Quick<span style={{ color: '#4F46E5' }}>Hire</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link href="/jobs" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Find Jobs</Link>
            <Link href="/companies" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Companies</Link>
            {!loading && isAuthenticated && user?.role === 'seeker' && (
              <Link href="/saved-jobs" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Bookmark size={14} /> Saved
              </Link>
            )}
            {!loading && isAuthenticated && user?.role === 'employer' && (
              <Link href="/dashboard/employer" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Dashboard</Link>
            )}
            {!loading && isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', textDecoration: 'none' }}>Admin</Link>
            )}
          </div>

          {/* Auth section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {/* While loading — show skeleton */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '36px', background: '#F0F0F5', borderRadius: '10px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ width: '110px', height: '36px', background: '#F0F0F5', borderRadius: '10px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            )}

            {/* Not logged in */}
            {!loading && !isAuthenticated && (
              <>
                <Link href="/login" style={{ fontSize: '14px', fontWeight: 600, color: '#4F46E5', textDecoration: 'none' }}>Login</Link>
                <Link href="/register" style={{ fontSize: '14px', fontWeight: 600, color: 'white', background: '#4F46E5', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none' }}>Sign Up</Link>
              </>
            )}

            {/* Logged in */}
            {!loading && isAuthenticated && (
              <>
                {/* Bell */}
                <div ref={bellRef} style={{ position: 'relative' }}>
                  <button
                    onClick={handleBellOpen}
                    style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '10px', border: '1px solid #E5E7EB', background: bellOpen ? '#F5F5FA' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Bell size={17} color="#6B7280" />
                    {unreadCount > 0 && (
                      <span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', background: '#EF4444', borderRadius: '50%', fontSize: '10px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {bellOpen && (
                    <div style={{ position: 'absolute', right: 0, top: '48px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', width: '360px', zIndex: 100, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #F0F0F5' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A2E' }}>
                          Notifications {unreadCount > 0 && <span style={{ fontSize: '12px', color: '#4F46E5', fontWeight: 600 }}>({unreadCount} new)</span>}
                        </span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#4F46E5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                            <CheckCheck size={13} /> Mark all read
                          </button>
                        )}
                      </div>

                      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        {nLoading ? (
                          <p style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF', fontSize: '13px' }}>Loading...</p>
                        ) : notifications.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <Bell size={32} style={{ color: '#E5E7EB', margin: '0 auto 10px' }} />
                            <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No notifications yet.</p>
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              style={{ display: 'flex', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #F9FAFB', background: n.is_read ? 'white' : '#FAFAFE', cursor: n.link ? 'pointer' : 'default' }}
                              onClick={() => handleNotificationClick(n)}
                              className="hover:bg-gray-50"
                            >
                              <div style={{ flexShrink: 0, marginTop: '5px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.is_read ? '#E5E7EB' : (TYPE_COLORS[n.type] || '#4F46E5') }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '13px', fontWeight: n.is_read ? 500 : 700, color: '#1A1A2E' }}>{n.title}</div>
                                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', lineHeight: 1.4 }}>{n.body}</div>
                                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{timeAgo(n.created_at)}</div>
                              </div>
                              <button
                                onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                                style={{ flexShrink: 0, padding: '4px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#D1D5DB', alignSelf: 'flex-start' }}
                                className="hover:text-red-400"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div style={{ padding: '10px 16px', borderTop: '1px solid #F0F0F5', textAlign: 'center' }}>
                          <Link href="/notifications" onClick={() => setBellOpen(false)} style={{ fontSize: '13px', color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>
                            View all notifications
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User dropdown */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F5FA', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '7px 14px', cursor: 'pointer' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{user?.name[0].toUpperCase()}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E' }}>{user?.name.split(' ')[0]}</span>
                    <ChevronDown size={14} color="#9CA3AF" />
                  </button>

                  {dropdownOpen && (
                    <div style={{ position: 'absolute', right: 0, top: '48px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: '210px', zIndex: 100, overflow: 'hidden' }} onMouseLeave={() => setDropdownOpen(false)}>
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F0F5' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A2E' }}>{user?.name}</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{user?.email}</div>
                        <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#EEF2FF', color: '#4F46E5', textTransform: 'capitalize' }}>{user?.role}</span>
                      </div>

                      <div style={{ padding: '6px' }}>
                        <Link href={dashboardHref} onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontSize: '14px' }} className="hover:bg-gray-50">
                          <LayoutDashboard size={15} color="#6B7280" /> Dashboard
                        </Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontSize: '14px' }} className="hover:bg-gray-50">
                          <User size={15} color="#6B7280" /> My Profile
                        </Link>
                        {user?.role === 'seeker' && (
                          <>
                            <Link href="/applications" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontSize: '14px' }} className="hover:bg-gray-50">
                              <FileText size={15} color="#6B7280" /> My Applications
                            </Link>
                            <Link href="/saved-jobs" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontSize: '14px' }} className="hover:bg-gray-50">
                              <Bookmark size={15} color="#6B7280" /> Saved Jobs
                            </Link>
                          </>
                        )}
                      </div>

                      <div style={{ padding: '6px', borderTop: '1px solid #F0F0F5' }}>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', color: '#DC2626', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }} className="hover:bg-red-50">
                          <LogOut size={15} color="#DC2626" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}