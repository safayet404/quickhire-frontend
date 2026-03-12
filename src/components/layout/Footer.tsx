import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#D1D5DB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '16px' }}>
              <Image
                src="/logo.png"
                alt="QuickHire"
                width={32}
                height={32}
                style={{ borderRadius: '50%' }}
              />
              <span style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>
                Quick<span style={{ color: '#818CF8' }}>Hire</span>
              </span>
            </Link>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7, maxWidth: '280px' }}>
              Connect talented professionals with great companies. Your next opportunity is just a click away.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#1F2937', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#9CA3AF', transition: 'background 0.2s',
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '16px', fontSize: '14px' }}>
              For Job Seekers
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Browse Jobs', 'Job Categories', 'Companies'].map(l => (
                <li key={l}>
                  <Link href="/jobs" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}
                    className="hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '16px', fontSize: '14px' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'About Us', href: '#' },
                { label: 'Admin Panel', href: '/admin' },
                { label: 'Contact', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}
                    className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1F2937', marginTop: '40px', paddingTop: '24px',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          gap: '8px', fontSize: '13px', color: '#6B7280',
        }}>
          <p>© 2024 QuickHire. All rights reserved.</p>
          <p>Built with Next.js & Laravel</p>
        </div>
      </div>
    </footer>
  );
}