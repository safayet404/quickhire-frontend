'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, Users, TrendingUp, CheckCircle, Building2, Star } from 'lucide-react';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const jobs = useCountUp(5842, 2000, started);
  const companies = useCountUp(1240, 2200, started);
  const hired = useCountUp(8300, 2400, started);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (location) qs.set('location', location);
    router.push(`/jobs?${qs.toString()}`);
  };

  return (
    <section className="relative bg-white overflow-hidden" style={{ minHeight: '560px' }}>

      {/* Background rings */}
      <div className="absolute right-0 top-0 pointer-events-none" style={{ width: '55%', height: '100%' }}>
        <svg width="100%" height="100%" viewBox="0 0 700 520" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMid meet">
          <rect x="320" y="-60" width="320" height="320" rx="32" stroke="#C7C9F0" strokeWidth="1.2" transform="rotate(20 320 -60)" fill="none" />
          <rect x="380" y="20" width="260" height="260" rx="28" stroke="#C7C9F0" strokeWidth="1" transform="rotate(20 380 20)" fill="none" />
          <rect x="440" y="90" width="200" height="200" rx="24" stroke="#C7C9F0" strokeWidth="0.8" transform="rotate(20 440 90)" fill="none" />
          <rect x="490" y="150" width="150" height="150" rx="20" stroke="#C7C9F0" strokeWidth="0.6" transform="rotate(20 490 150)" fill="none" />
        </svg>
      </div>

      {/* Lavender bg panel */}
      <div className="absolute hidden lg:block" style={{ right: '4%', top: 0, width: '38%', height: '100%', background: 'linear-gradient(160deg, #EEF0FF 0%, #E8EAFF 100%)', borderBottomLeftRadius: '999px', borderBottomRightRadius: '32px', zIndex: 1 }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-2 gap-0 items-center" style={{ minHeight: '540px' }}>

          {/* ── Left ── */}
          <div className="py-16 pr-8">
            <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.15, color: '#1A1A2E', letterSpacing: '-1px' }} className="mb-5">
              Discover<br />more than<br />
              <span style={{ color: '#26A4FF', position: 'relative', display: 'inline-block' }}>
                5000+ Jobs
                <svg style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%' }} height="11" viewBox="0 0 260 10" fill="none">
                  <path d="M2 7 C40 2, 100 9, 160 5 C200 2, 230 8, 258 4" stroke="#26A4FF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </svg>
                <svg style={{ position: 'absolute', bottom: '-12px', left: 0, width: '100%' }} height="12" viewBox="0 0 260 10" fill="none">
                  <path d="M2 7 C40 2, 100 9, 160 5 C200 2, 230 8, 258 4" stroke="#26A4FF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.7, maxWidth: '360px' }} className="mb-8">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl overflow-hidden mb-4"
              style={{ maxWidth: '500px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid #F0F0F0', height: '56px' }}>
              <div className="flex items-center gap-2 px-4 flex-1">
                <Search size={17} color="#9CA3AF" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title or keyword"
                  style={{ fontSize: '13.5px', color: '#374151', outline: 'none', background: 'transparent', width: '100%' }} />
              </div>
              <div style={{ width: '1px', height: '28px', background: '#E5E7EB' }} />
              <div className="flex items-center gap-2 px-4">
                <MapPin size={17} color="#9CA3AF" />
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location"
                  style={{ fontSize: '13.5px', color: '#374151', outline: 'none', background: 'transparent', width: '90px' }} />
              </div>
              <button type="submit" style={{ background: '#4F46E5', color: 'white', fontWeight: 600, fontSize: '14px', padding: '0 28px', height: '100%', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Search my job
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-1" style={{ fontSize: '13px' }}>
              <span style={{ color: '#9CA3AF' }}>Popular :</span>
              {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag, i, arr) => (
                <button key={tag} onClick={() => router.push(`/jobs?search=${tag}`)}
                  style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
                  className="hover:text-indigo-600 transition-colors">
                  {tag}{i < arr.length - 1 ? ',' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right — animated stats ── */}
          <div className="hidden lg:flex items-center justify-center relative" style={{ height: '540px', zIndex: 2 }}>

            {/* CSS keyframes */}
            <style>{`
              @keyframes floatA { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
              @keyframes floatB { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
              @keyframes floatC { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
              @keyframes floatD { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
              @keyframes floatE { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
              @keyframes pulse-ring { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
            `}</style>

            {/* Center circle */}
            <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 60px rgba(79,70,229,0.35)', zIndex: 10, animation: 'floatA 4s ease-in-out infinite' }}>
              <Briefcase size={32} color="white" />
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1.1, marginTop: '6px' }}>
                {jobs.toLocaleString()}+
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Open Jobs</div>
            </div>

            {/* Pulse ring */}
            <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '2px solid rgba(79,70,229,0.2)', animation: 'pulse-ring 3s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', width: '240px', height: '240px', borderRadius: '50%', border: '1px solid rgba(79,70,229,0.1)', animation: 'pulse-ring 3s ease-in-out infinite 0.5s' }} />

            {/* Card: Companies */}
            <div style={{ position: 'absolute', top: '60px', left: '30px', background: 'white', borderRadius: '16px', padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', minWidth: '150px', animation: 'floatB 5s ease-in-out infinite', zIndex: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} color="#4F46E5" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>{companies.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Companies</div>
                </div>
              </div>
            </div>

            {/* Card: People Hired */}
            <div style={{ position: 'absolute', top: '60px', right: '20px', background: 'white', borderRadius: '16px', padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', minWidth: '150px', animation: 'floatC 6s ease-in-out infinite 1s', zIndex: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} color="#16A34A" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>{hired.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>People Hired</div>
                </div>
              </div>
            </div>

            {/* Card: Success Rate */}
            <div style={{ position: 'absolute', bottom: '120px', left: '20px', background: 'white', borderRadius: '16px', padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', minWidth: '155px', animation: 'floatD 5.5s ease-in-out infinite 0.5s', zIndex: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} color="#D97706" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>94%</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Success Rate</div>
                </div>
              </div>
            </div>

            {/* Card: New Today */}
            <div style={{ position: 'absolute', bottom: '120px', right: '10px', background: 'white', borderRadius: '16px', padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', minWidth: '150px', animation: 'floatE 4.5s ease-in-out infinite 1.5s', zIndex: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={18} color="#DC2626" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>128</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>New Today</div>
                </div>
              </div>
            </div>

            {/* Card: Verified */}
            <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '16px', padding: '12px 22px', boxShadow: '0 8px 32px rgba(79,70,229,0.3)', animation: 'floatB 5s ease-in-out infinite 2s', zIndex: 8, whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="white" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>All jobs verified</span>
              </div>
            </div>

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
              <span key={c.name} style={{ color: '#9CA3AF', fontWeight: c.bold ? 800 : 600, fontSize: c.wide ? '17px' : '15px', letterSpacing: c.wide ? '3px' : '1px', fontStyle: c.italic ? 'italic' : 'normal', textTransform: 'uppercase' }}>
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}