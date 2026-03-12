import Link from 'next/link';
import {
  Bell, LayoutDashboard, MessageSquare, Building2,
  Users, Briefcase, Calendar, Settings, HelpCircle, Plus,
} from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div style={{ background: '#4F46E5', borderRadius: '24px', overflow: 'hidden', display: 'flex', alignItems: 'center', minHeight: '280px', position: 'relative' }}>

        {/* Left — CTA text */}
        <div style={{ padding: '52px 56px', flexShrink: 0, width: '320px', zIndex: 2 }}>
          <h3 style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '14px' }}>
            Start posting<br />jobs today
          </h3>
          <p style={{ color: '#c7d2fe', fontSize: '14px', marginBottom: '32px' }}>
            Start posting jobs for only $10.
          </p>
          <Link
            href="/admin"
            style={{ display: 'inline-block', background: 'white', color: '#4F46E5', fontWeight: 700, fontSize: '14px', padding: '13px 30px', borderRadius: '8px', textDecoration: 'none' }}
          >
            Sign Up For Free
          </Link>
        </div>

        {/* Right — dashboard mockup */}
        <div style={{ flex: 1, position: 'relative', height: '280px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-8px', top: '24px', width: '680px', background: '#F1F5FF', borderRadius: '16px 16px 0 0', boxShadow: '0 -12px 48px rgba(0,0,0,0.22)', overflow: 'hidden' }}>

            {/* Navbar */}
            <div style={{ background: 'white', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EEF0F5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '26px', height: '26px', background: '#4F46E5', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={13} color="white" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '12px', color: '#1A1A2E' }}>QuickHire</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F5F5FA', padding: '5px 12px', borderRadius: '7px', border: '1px solid #EBEBF5' }}>
                  <Building2 size={10} color="#6B7280" />
                  <span style={{ color: '#6B7280', fontSize: '10px' }}>Company</span>
                  <span style={{ color: '#1A1A2E', fontSize: '10px', fontWeight: 600 }}>Nomad</span>
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none"><path d="M1 1l3.5 3.5L8 1" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" /></svg>
                </div>
                <Bell size={14} color="#6B7280" />
                <div style={{ width: '26px', height: '26px', background: '#E0E7FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#4F46E5' }}>M</span>
                </div>
                <button style={{ background: '#4F46E5', color: 'white', border: 'none', borderRadius: '7px', padding: '6px 12px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={10} /> Post a Job
                </button>
              </div>
            </div>

            <div style={{ display: 'flex' }}>
              {/* Sidebar */}
              <div style={{ width: '135px', background: 'white', padding: '14px 10px', borderRight: '1px solid #EEF0F5', flexShrink: 0 }}>
                <div style={{ fontSize: '8px', color: '#9CA3AF', fontWeight: 700, marginBottom: '8px', paddingLeft: '8px', letterSpacing: '0.5px' }}>MENU</div>
                {([
                  { icon: LayoutDashboard, label: 'Dashboard', active: true },
                  { icon: MessageSquare, label: 'Messages' },
                  { icon: Building2, label: 'Company Profile' },
                  { icon: Users, label: 'All Applicants' },
                  { icon: Briefcase, label: 'Job Listing' },
                  { icon: Calendar, label: 'My Schedule' },
                ] as { icon: React.ElementType; label: string; active?: boolean }[]).map(({ icon: Icon, label, active }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 8px', borderRadius: '7px', background: active ? '#EEF2FF' : 'transparent', marginBottom: '1px' }}>
                    <Icon size={11} color={active ? '#4F46E5' : '#9CA3AF'} />
                    <span style={{ fontSize: '9px', fontWeight: active ? 600 : 400, color: active ? '#4F46E5' : '#6B7280' }}>{label}</span>
                  </div>
                ))}
                <div style={{ fontSize: '8px', color: '#9CA3AF', fontWeight: 700, margin: '10px 0 8px', paddingLeft: '8px', letterSpacing: '0.5px' }}>SETTINGS</div>
                {([{ icon: Settings, label: 'Settings' }, { icon: HelpCircle, label: 'Help Center' }] as { icon: React.ElementType; label: string }[]).map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 8px', marginBottom: '1px' }}>
                    <Icon size={11} color="#9CA3AF" />
                    <span style={{ fontSize: '9px', color: '#6B7280' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Main dashboard */}
              <div style={{ flex: 1, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#1A1A2E' }}>Good morning, Maria</div>
                    <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '2px' }}>Here is your job listings statistic report from July 19 - July 25.</div>
                  </div>
                  <div style={{ fontSize: '9px', color: '#9CA3AF' }}>Jul 19 - Jul 25 ↑</div>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {[
                    { value: '76', label: 'New candidates to review', bg: '#4F46E5' },
                    { value: '3', label: 'Schedule for today', bg: '#56CDAD' },
                    { value: '24', label: 'Messages received', bg: '#26A4FF' },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: '10px', padding: '10px 12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: '8px', opacity: 0.9, marginTop: '3px', lineHeight: 1.3 }}>{s.label}</div>
                      </div>
                      <span style={{ fontSize: '14px', opacity: 0.7 }}>→</span>
                    </div>
                  ))}
                </div>

                {/* Chart + right stats */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, background: 'white', borderRadius: '10px', padding: '10px 12px', border: '1px solid #EEF0F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '10px', color: '#1A1A2E' }}>Job statistics</div>
                        <div style={{ fontSize: '8px', color: '#9CA3AF' }}>Showing jobstatus Jul 19-25</div>
                      </div>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {['Week', 'Month', 'Year'].map((t, i) => (
                          <span key={t} style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '4px', background: i === 0 ? '#4F46E5' : 'transparent', color: i === 0 ? 'white' : '#9CA3AF' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #F0F0F5', marginBottom: '8px' }}>
                      {['Overview', 'Jobs View', 'Jobs Applied'].map((t, i) => (
                        <span key={t} style={{ fontSize: '8px', paddingBottom: '5px', borderBottom: i === 0 ? '2px solid #4F46E5' : '2px solid transparent', color: i === 0 ? '#4F46E5' : '#9CA3AF', fontWeight: i === 0 ? 600 : 400 }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '55px', marginBottom: '4px' }}>
                      {[{ jv: 38, ja: 22 }, { jv: 52, ja: 30 }, { jv: 62, ja: 38 }, { jv: 42, ja: 24 }, { jv: 55, ja: 32 }, { jv: 36, ja: 19 }, { jv: 48, ja: 28 }].map((d, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                          <div style={{ flex: 1, height: `${d.jv}px`, background: '#FFB836', borderRadius: '2px 2px 0 0' }} />
                          <div style={{ flex: 1, height: `${d.ja}px`, background: '#4F46E5', borderRadius: '2px 2px 0 0' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                        <span key={d} style={{ fontSize: '7px', color: '#9CA3AF', flex: 1, textAlign: 'center' }}>{d}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {[
                        { label: 'Job Views', val: '2,342', trend: '↑ 3.42%', tc: '#56CDAD', color: '#FFB836' },
                        { label: 'Job Applied', val: '654', trend: '↓ 0.5%', tc: '#FF6550', color: '#4F46E5' },
                      ].map(s => (
                        <div key={s.label}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                            <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: s.color }} />
                            <span style={{ fontSize: '8px', color: '#9CA3AF' }}>{s.label}</span>
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1A1A2E' }}>{s.val}</div>
                          <div style={{ fontSize: '8px', color: s.tc }}>{s.trend}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right stats */}
                  <div style={{ width: '125px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: 'white', borderRadius: '10px', padding: '10px', border: '1px solid #EEF0F5' }}>
                      <div style={{ fontSize: '8px', color: '#9CA3AF' }}>Job Open</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>12</div>
                      <div style={{ fontSize: '8px', color: '#9CA3AF' }}>Jobs Opened</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '10px', padding: '10px', border: '1px solid #EEF0F5', flex: 1 }}>
                      <div style={{ fontSize: '8px', color: '#9CA3AF', marginBottom: '3px' }}>Applicants Summary</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1, marginBottom: '6px' }}>67</div>
                      <div style={{ height: '5px', borderRadius: '3px', overflow: 'hidden', display: 'flex', marginBottom: '6px' }}>
                        <div style={{ width: '45%', background: '#4F46E5' }} />
                        <div style={{ width: '15%', background: '#FFB836' }} />
                        <div style={{ width: '18%', background: '#56CDAD' }} />
                        <div style={{ width: '22%', background: '#FF6550' }} />
                      </div>
                      {[
                        { l: 'Full Time', v: 45, c: '#4F46E5' },
                        { l: 'Part Time', v: 10, c: '#FFB836' },
                        { l: 'Internship', v: 12, c: '#56CDAD' },
                        { l: 'Remote', v: 32, c: '#FF6550' },
                      ].map(a => (
                        <div key={a.l} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.c, flexShrink: 0 }} />
                          <span style={{ fontSize: '8px', color: '#6B7280', flex: 1 }}>{a.l}</span>
                          <span style={{ fontSize: '8px', fontWeight: 700, color: '#1A1A2E' }}>{a.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
