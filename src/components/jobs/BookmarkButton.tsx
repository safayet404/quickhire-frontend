'use client';

import { Bookmark } from 'lucide-react';
import { useBookmark } from '@/hooks/useBookmark';
import { useRouter } from 'next/navigation';

interface Props {
  jobId: number;
  size?: number;
}

export default function BookmarkButton({ jobId, size = 18 }: Props) {
  const { saved, loading, toggle, isLoggedIn } = useBookmark(jobId);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { router.push('/login'); return; }
    toggle(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={saved ? 'Remove bookmark' : 'Save job'}
      style={{
        background: saved ? '#EEF2FF' : 'white',
        border: `1px solid ${saved ? '#C7D2FE' : '#E5E7EB'}`,
        borderRadius: '8px',
        padding: '7px',
        cursor: loading ? 'wait' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      <Bookmark
        size={size}
        color={saved ? '#4F46E5' : '#9CA3AF'}
        fill={saved ? '#4F46E5' : 'none'}
      />
    </button>
  );
}
