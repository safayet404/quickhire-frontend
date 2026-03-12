'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/jobs', label: 'Find Jobs' },
    { href: '/jobs', label: 'Browse Companies' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #F3F4F6', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Image
              src="/logo.png"
              alt="QuickHire"
              width={32}
              height={32}
              style={{ borderRadius: '50%' }}
            />
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#1A1A2E' }}>
              Quick<span style={{ color: '#4F46E5' }}>Hire</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '32px' }}>
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: pathname === l.href ? '#4F46E5' : '#374151',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '12px' }}>
            <Link
              href="/login"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1A1A2E',
                textDecoration: 'none',
                padding: '8px 16px',
              }}
            >
              Login
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'white',
                background: '#4F46E5',
                textDecoration: 'none',
                padding: '10px 22px',
                borderRadius: '8px',
              }}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ borderTop: '1px solid #F3F4F6', background: 'white', padding: '16px' }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                padding: '10px 0',
                color: pathname === l.href ? '#4F46E5' : '#374151',
                textDecoration: 'none',
                borderBottom: '1px solid #F9FAFB',
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <Link href="/login" style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#1A1A2E', textDecoration: 'none' }}>
              Login
            </Link>
            <Link href="/register" style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#4F46E5', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: 'white', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}