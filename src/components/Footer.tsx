import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-16 text-zinc-600 dark:text-zinc-400 font-mono text-xs">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-zinc-200 dark:border-zinc-900">
          {/* Identity column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold tracking-wider uppercase text-sm">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-zinc-500 max-w-sm text-xs leading-relaxed font-sans">
              {siteConfig.tagline}. Focused on web application security, practical penetration testing, and vulnerability research.
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-3 space-y-3">
            <div className="uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-semibold text-[11px]">
              Index
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials / Direct Channels */}
          <div className="md:col-span-3 space-y-3">
            <div className="uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-semibold text-[11px]">
              Channels
            </div>
            <ul className="space-y-2">
              {siteConfig.socials.filter(s => s.platform !== 'Email').map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target={social.url.startsWith('http') ? '_blank' : undefined}
                    rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <span>{social.platform}</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500 dark:text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div>
            © {currentYear} {siteConfig.name}
          </div>
        </div>
      </div>
    </footer>
  );
}
