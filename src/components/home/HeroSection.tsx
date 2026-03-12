'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (location) qs.set('location', location);
    router.push(`/jobs?${qs.toString()}`);
  };

  return (
    <section className="relative bg-white overflow-hidden" style={{ minHeight: '540px' }}>
      {/* Background geometric rings */}
      <div className="absolute right-0 top-0 pointer-events-none" style={{ width: '55%', height: '100%' }}>
        <svg width="100%" height="100%" viewBox="0 0 700 520" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMid meet">
          <rect x="320" y="-60" width="320" height="320" rx="32" stroke="#C7C9F0" strokeWidth="1.2" transform="rotate(20 320 -60)" fill="none" />
          <rect x="380" y="20" width="260" height="260" rx="28" stroke="#C7C9F0" strokeWidth="1" transform="rotate(20 380 20)" fill="none" />
          <rect x="440" y="90" width="200" height="200" rx="24" stroke="#C7C9F0" strokeWidth="0.8" transform="rotate(20 440 90)" fill="none" />
          <rect x="490" y="150" width="150" height="150" rx="20" stroke="#C7C9F0" strokeWidth="0.6" transform="rotate(20 490 150)" fill="none" />
        </svg>
      </div>

      {/* Lavender gradient bg behind person */}
      <div
        className="absolute hidden lg:block"
        style={{ right: '4%', top: '0', width: '38%', height: '100%', background: 'linear-gradient(160deg, #EEF0FF 0%, #E8EAFF 100%)', borderBottomLeftRadius: '999px', borderBottomRightRadius: '32px', zIndex: 1 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-2 gap-0 items-center" style={{ minHeight: '520px' }}>

          {/* Left — text + search */}
          <div className="py-16 pr-8">
            <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.15, color: '#1A1A2E', letterSpacing: '-1px' }} className="mb-5">
              Discover<br />more than<br />
              <span style={{ color: '#26A4FF', position: 'relative', display: 'inline-block' }}>
                5000+ Jobs
                <svg style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%' }} height="10" viewBox="0 0 260 10" fill="none">
                  <path d="M2 7 C40 2, 100 9, 160 5 C200 2, 230 8, 258 4" stroke="#26A4FF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.7, maxWidth: '360px' }} className="mb-8">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white rounded-xl overflow-hidden mb-4"
              style={{ maxWidth: '500px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid #F0F0F0', height: '56px' }}
            >
              <div className="flex items-center gap-2 px-4 flex-1">
                <Search size={17} color="#9CA3AF" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Job title or keyword"
                  style={{ fontSize: '13.5px', color: '#374151', outline: 'none', background: 'transparent', width: '100%' }}
                />
              </div>
              <div style={{ width: '1px', height: '28px', background: '#E5E7EB' }} />
              <div className="flex items-center gap-2 px-4">
                <MapPin size={17} color="#9CA3AF" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Florence, Italy"
                  style={{ fontSize: '13.5px', color: '#374151', outline: 'none', background: 'transparent', width: '110px' }}
                />
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <button
                type="submit"
                style={{ background: '#4F46E5', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0 28px', height: '100%', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Search my job
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-1" style={{ fontSize: '13px' }}>
              <span style={{ color: '#9CA3AF' }}>Popular :</span>
              {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag, i, arr) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/jobs?search=${tag}`)}
                  style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {tag}{i < arr.length - 1 ? ',' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Right — person image */}
          <div className="hidden lg:flex items-end justify-center relative" style={{ height: '520px', zIndex: 2 }}>
            <Image
              src="/hero-person.png"
              alt="Job seeker"
              width={380}
              height={480}
              style={{ objectFit: 'contain', objectPosition: 'bottom', zIndex: 3, position: 'relative' }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Companies bar */}
      <div style={{ borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center gap-10">
            <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Companies we helped grow</span>
            {([
              { name: 'Vodafone' },
              { name: 'Intel', italic: true },
              { name: 'TESLA', wide: true },
              { name: 'AMD', bold: true },
              { name: 'Talkit' },
            ] as { name: string; italic?: boolean; wide?: boolean; bold?: boolean }[]).map(c => (
              <span
                key={c.name}
                style={{
                  color: '#9CA3AF',
                  fontWeight: c.bold ? 800 : 600,
                  fontSize: c.wide ? '17px' : '15px',
                  letterSpacing: c.wide ? '3px' : '1px',
                  fontStyle: c.italic ? 'italic' : 'normal',
                  textTransform: 'uppercase',
                }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
