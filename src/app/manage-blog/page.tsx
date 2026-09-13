import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPostsForAdmin } from '@/lib/blog-service';
import { getPortfolioItems } from '@/lib/portfolio-service';
import { AdminPostsTable } from '@/components/admin/AdminPostsTable';
import { PortfolioManager } from '@/components/admin/PortfolioManager';
import { ChangeCredentialsForm } from '@/components/admin/ChangeCredentialsForm';
import { logoutAction } from './actions';
import {
  Plus,
  LogOut,
  Globe,
  FileText,
  CheckCircle2,
  Edit,
  Shield,
  Layers
} from 'lucide-react';

import { AdminSessionGuard } from '@/components/admin/AdminSessionGuard';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Security Publications',
  description: 'Private administration portal for the blog CMS.',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const allPosts = await getAllPostsForAdmin();
  const portfolioItems = await getPortfolioItems();

  const totalPosts = allPosts.length;
  const publishedCount = allPosts.filter((p) => p.status === 'published').length;
  const draftCount = allPosts.filter((p) => p.status === 'draft').length;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-zinc-900">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Active Admin</span>
            </span>
            <span>•</span>
            <AdminSessionGuard />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-zinc-100 font-normal">
            Blog Management System
          </h1>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <Link
            href="/manage-blog/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 text-zinc-950 font-semibold hover:bg-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Post</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-3 py-2.5 border border-zinc-800 text-zinc-400 hover:text-red-300 hover:border-red-900/60 transition-colors"
              title="Terminate Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        {/* Total Posts */}
        <div className="p-6 border border-zinc-800 bg-zinc-900/20 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="uppercase tracking-widest">Total Articles</span>
            <Layers className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-3xl font-serif text-zinc-100">{totalPosts}</div>
          <div className="text-[11px] text-zinc-500">
            Managed security writeups
          </div>
        </div>

        {/* Published Posts */}
        <div className="p-6 border border-zinc-800 bg-zinc-900/20 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="uppercase tracking-widest">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif text-emerald-400">{publishedCount}</div>
          <div className="text-[11px] text-zinc-500">
            Publicly visible on /blog
          </div>
        </div>

        {/* Draft Posts */}
        <div className="p-6 border border-zinc-800 bg-zinc-900/20 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="uppercase tracking-widest">Drafts</span>
            <FileText className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-3xl font-serif text-zinc-300">{draftCount}</div>
          <div className="text-[11px] text-zinc-500">
            Unpublished laboratory notes
          </div>
        </div>
      </div>

      {/* Main Posts Management Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-200">
            Recent Research Publications
          </h2>
        </div>

        <AdminPostsTable initialPosts={allPosts} />
      </div>

      {/* Projects & Certifications Section */}
      <div className="space-y-6 pt-12 border-t border-zinc-200 dark:border-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-200">
            Projects & Certifications
          </h2>
        </div>
        
        <PortfolioManager initialItems={portfolioItems} />
      </div>

      {/* Admin Settings Section */}
      <div className="space-y-6 pt-12 border-t border-zinc-200 dark:border-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-200">
            Security & Credentials
          </h2>
        </div>
        
        <ChangeCredentialsForm />
      </div>
    </div>
  );
}
