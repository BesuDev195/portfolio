import React from 'react';
import type { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/blog-service';
import { BlogListingClient } from '@/components/BlogListingClient';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Blog — Web Penetration Testing & Security Writeups',
  description: `Web penetration testing articles, vulnerability writeups, and security research by ${siteConfig.name}.`,
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16 sm:py-24">
      {/* Editorial Header */}
      <div className="space-y-4 pb-12 border-b border-zinc-200 dark:border-zinc-900">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-zinc-700" />
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            Web Pentesting & Security Insights
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-zinc-900 dark:text-zinc-100 font-normal tracking-tight">
          Blog
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-serif max-w-2xl leading-relaxed">
          Technical articles, vulnerability breakdowns, and web penetration testing methodologies authored by {siteConfig.name}.
        </p>
      </div>

      {/* Main Interactive Blog Listing */}
      <div className="pt-12">
        <BlogListingClient initialPosts={posts} />
      </div>
    </div>
  );
}
