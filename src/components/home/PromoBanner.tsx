import Link from 'next/link';
import { Briefcase, Search, ArrowRight, Users, Building2, Star } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <style>{`
        @keyframes floatX { 0%,100% { transform: translateY(0px) rotate(-6deg); } 50% { transform: translateY(-10px) rotate(-6deg); } }
        @keyframes floatY { 0%,100% { transform: translateY(0px) rotate(8deg); } 50% { transform: translateY(-14px) rotate(8deg); } }
        @keyframes floatZ { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes floatW { 0%,100% { transform: translateY(0px) rotate(3deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 40%, #0F3460 100%)',
        borderRadius: '28px',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '320px',
        display: 'flex',
        alignItems: 'center',
      }}>

        {/* Background decorations */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Large blurred circles */}
          <div style={{ position: 'absolute', top: '-80px', left: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(79,70,229,0.15)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '20%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(38,164,255,0.12)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', top: '20%', right: '5%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(124,58,237,0.1)', filter: 'blur(40px)' }} />

          {/* Spinning ring */}
          <div style={{ position: 'absolute', top: '-40px', right: '38%', width: '200px', height: '200px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)', animation: 'spin-slow 20s linear infinite' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '42%', width: '260px', height: '260px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.05)', animation: 'spin-slow 30s linear infinite reverse' }} />

          {/* Grid dots */}
          {[...Array(6)].map((_, i) => (
            [...Array(4)].map((_, j) => (
              <div key={`${i}-${j}`} style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', left: `${8 + i * 16}%`, top: `${15 + j * 25}%` }} />
            ))
          ))}
        </div>

        {/* Floating cards */}
        {/* Top left floating card */}
        <div style={{ position: 'absolute', top: '28px', left: '32%', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'floatX 5s ease-in-out infinite', zIndex: 2 }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(79,70,229,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={13} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', lineHeight: 1 }}>2,400+</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Candidates hired</div>
          </div>
        </div>

        {/* Top right floating card */}
        <div style={{ position: 'absolute', top: '24px', right: '6%', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'floatY 6s ease-in-out infinite 1s', zIndex: 2 }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(22,163,74,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={13} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', lineHeight: 1 }}>98%</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Satisfaction rate</div>
          </div>
        </div>

        {/* Bottom center floating card */}
        <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'floatZ 4.5s ease-in-out infinite 0.5s', zIndex: 2, whiteSpace: 'nowrap' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(38,164,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={13} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', lineHeight: 1 }}>500+ Companies</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>actively hiring now</div>
          </div>
        </div>

        {/* Bottom right floating pill */}
        <div style={{ position: 'absolute', bottom: '36px', right: '7%', background: 'linear-gradient(135deg, rgba(79,70,229,0.5), rgba(124,58,237,0.5))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '8px 16px', animation: 'floatW 5.5s ease-in-out infinite 2s', zIndex: 2 }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'white' }}>🔥 128 new jobs today</span>
        </div>

        {/* ── Main content ── */}
        <div style={{ position: 'relative', zIndex: 3, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1px 1fr', alignItems: 'center', padding: '52px 64px', gap: '0' }}>

          {/* Left — For Seekers */}
          <div style={{ paddingRight: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(38,164,255,0.15)', border: '1px solid rgba(38,164,255,0.3)', borderRadius: '999px', padding: '5px 14px', marginBottom: '16px' }}>
              <Search size={11} color="#26A4FF" />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#26A4FF' }}>For Job Seekers</span>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '10px' }}>
              Find your dream<br />job today
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
              Browse thousands of curated job listings from top companies. Your next opportunity is one click away.
            </p>
            <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#26A4FF', color: 'white', fontWeight: 700, fontSize: '14px', padding: '12px 26px', borderRadius: '10px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(38,164,255,0.35)' }}>
              Browse Jobs <ArrowRight size={15} />
            </Link>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

          {/* Right — For Employers */}
          <div style={{ paddingLeft: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '16px' }}>
              <Briefcase size={11} color="#818CF8" />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#818CF8' }}>For Employers</span>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '10px' }}>
              Hire top talent<br />effortlessly
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
              Post jobs, manage applications, and find the perfect candidate — all in one powerful dashboard.
            </p>
            <Link href="/register?role=employer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#39B0EF', color: 'white', fontWeight: 700, fontSize: '14px', padding: '12px 26px', borderRadius: '10px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              Post a Job <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}