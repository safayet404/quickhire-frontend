'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import SeekerProfileForm from '@/components/profile/SeekerProfileForm';
import CompanyProfileForm from '@/components/profile/CompanyProfileForm';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function ProfilePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user && token) {
      axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setProfile(res.data.profile))
        .finally(() => setFetching(false));
    }
  }, [user, token, loading]);

  if (loading || fetching) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '40px 0' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px' }}>My Profile</h1>
        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '32px' }}>
          {user?.role === 'seeker' ? 'Keep your profile updated to get better job matches.' : 'Complete your company profile to attract top talent.'}
        </p>

        {user?.role === 'seeker' && (
          <SeekerProfileForm profile={profile} token={token!} onSaved={setProfile} />
        )}

        {user?.role === 'employer' && (
          <CompanyProfileForm profile={profile} token={token!} onSaved={setProfile} />
        )}
      </div>
    </div>
  );
}
