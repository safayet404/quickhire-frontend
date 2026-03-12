import Link from 'next/link';
import { Briefcase, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Quick<span className="text-primary-100">Hire</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Connect talented professionals with great companies. Your next opportunity is just a click away.
            </p>
            <div className="flex gap-4 mt-6">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              {['Browse Jobs', 'Job Categories', 'Companies'].map(l => (
                <li key={l}>
                  <Link href="/jobs" className="hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Admin Panel', 'Contact'].map((l, i) => (
                <li key={l}>
                  <Link href={i === 1 ? '/admin' : '#'} className="hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>© 2024 QuickHire. All rights reserved.</p>
          <p>Built with Next.js & Laravel</p>
        </div>
      </div>
    </footer>
  );
}
