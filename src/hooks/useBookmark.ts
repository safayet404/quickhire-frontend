import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function useBookmark(jobId: number) {
  const { user, token } = useAuth();
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(false);

  // Check initial state
  useEffect(() => {
    if (!user || !token) return;
    axios.get(`${API}/saved-jobs/check`, {
      params: { job_id: jobId },
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setSaved(res.data.saved)).catch(() => {});
  }, [user, token, jobId]);

  const toggle = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!user || !token || loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/saved-jobs/toggle`,
        { job_id: jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(res.data.saved);
    } catch { }
    finally { setLoading(false); }
  };

  return { saved, loading, toggle, isLoggedIn: !!user };
}
