'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import { Search, ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

interface BlogListingClientProps {
  initialPosts: BlogPost[];
}

export function BlogListingClient({ initialPosts }: BlogListingClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((post) => {
      post.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [initialPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = !selectedTag || post.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [initialPosts, searchQuery, selectedTag]);

  return (
    <div className="space-y-12">
      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-900 font-mono">
        {/* Search input */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blog by keyword, topic, or tag..."
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-none pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        {/* Tag pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 text-xs border transition-colors ${
                selectedTag === null
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-medium'
                  : 'bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 text-xs border transition-colors ${
                  selectedTag === tag
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-medium'
                    : 'bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts List / Magazine View */}
      {filteredPosts.length > 0 ? (
        <div className="divide-y divide-zinc-900">
          {filteredPosts.map((post, idx) => (
            <article
              key={post.id}
              className="py-10 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group"
            >
              {/* Optional Cover Image */}
              {post.cover_image && (
                <div className="lg:col-span-4 relative aspect-[16/10] w-full overflow-hidden border border-zinc-800 bg-zinc-950">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Text info */}
              <div
                className={`${
                  post.cover_image ? 'lg:col-span-8' : 'lg:col-span-12'
                } space-y-4`}
              >
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500">
                  {post.published_at && (
                    <span>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  {post.reading_time && (
                    <>
                      <span>•</span>
                      <span>{post.reading_time}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif text-zinc-100 group-hover:text-white transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-4">
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Tags and link */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-[11px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : initialPosts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-800 p-8 font-mono space-y-3">
          <p className="text-zinc-400 text-sm">No blog posts published yet.</p>
          <p className="text-zinc-600 text-xs">
            Articles published via the admin portal will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-zinc-800 p-8 font-mono space-y-3">
          <p className="text-zinc-400 text-sm">No blog posts found matching your query.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTag(null);
            }}
            className="text-xs text-zinc-300 underline underline-offset-4 hover:text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
