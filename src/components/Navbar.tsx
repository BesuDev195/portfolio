'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-all">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / Monogram */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-white transition-colors"
        >
          <div className="w-8 h-8 border border-zinc-300 dark:border-zinc-700 rounded flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 transition-colors">
            <span className="font-mono text-xs font-semibold tracking-tighter">BZ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wider uppercase font-mono">
              {siteConfig.name}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono tracking-widest uppercase">
              {siteConfig.title}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-mono tracking-wide">
          <Link
            href={isHome ? '#about' : '/#about'}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            About
          </Link>
          <Link
            href={isHome ? '#experience' : '/#experience'}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Experience
          </Link>
          <Link
            href="/blog"
            className={`transition-colors ${
              pathname.startsWith('/blog')
                ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Blog
          </Link>
          <Link
            href={isHome ? '#projects' : '/#projects'}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Projects
          </Link>
          <Link
            href={isHome ? '#socials' : '/#socials'}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Contact
          </Link>
          <div className="border-l border-zinc-200 dark:border-zinc-800 pl-8 ml-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-6 space-y-4 font-mono text-sm shadow-lg">
          <Link
            href={isHome ? '#about' : '/#about'}
            onClick={() => setIsOpen(false)}
            className="block text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            About
          </Link>
          <Link
            href={isHome ? '#experience' : '/#experience'}
            onClick={() => setIsOpen(false)}
            className="block text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            Experience
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className="block text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            Blog
          </Link>
          <Link
            href={isHome ? '#projects' : '/#projects'}
            onClick={() => setIsOpen(false)}
            className="block text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            Projects
          </Link>
          <Link
            href={isHome ? '#socials' : '/#socials'}
            onClick={() => setIsOpen(false)}
            className="block text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
