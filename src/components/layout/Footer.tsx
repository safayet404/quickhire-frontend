'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Facebook, Instagram, AtSign, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: '#111827', color: '#D1D5DB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '16px' }}>
              <Image src="/logo.png" alt="QuickHire" width={30} height={30} style={{ borderRadius: '50%' }} />
              <span style={{ fontWeight: 700, fontSize: '17px', color: 'white' }}>
                Quick<span style={{ color: '#818CF8' }}>Hire</span>
              </span>
            </Link>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.7, maxWidth: '220px' }}>
              Great platform for the job seeker that passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '16px', fontSize: '14px' }}>About</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Companies', href: '/companies' },
                { label: 'Pricing', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'Advice', href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}
                    className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '16px', fontSize: '14px' }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Help Docs', href: '#' },
                { label: 'Guide', href: '#' },
                { label: 'Updates', href: '#' },
                { label: 'Contact Us', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none' }}
                    className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '10px', fontSize: '14px' }}>
              Get job notifications
            </h4>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6, marginBottom: '16px' }}>
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div style={{ display: 'flex', gap: '0' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  fontSize: '13px',
                  background: '#1F2937',
                  border: '1px solid #374151',
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px',
                  color: '#D1D5DB',
                  outline: 'none',
                  minWidth: 0,
                }}
              />
              <button
                onClick={() => setEmail('')}
                style={{
                  background: '#4F46E5',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '0 8px 8px 0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1F2937',
          marginTop: '48px',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            2021 @ QuickHire. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[Facebook, Instagram, AtSign, Linkedin, Twitter].map((Icon, i) => (
              <a key={i} href="#" style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#1F2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9CA3AF',
                transition: 'background 0.2s',
              }}
                className="hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}