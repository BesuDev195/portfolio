import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getPublishedPosts } from '@/lib/blog-service';
import { siteConfig } from '@/lib/config';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Shield,
  Tag
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: [siteConfig.name],
      tags: post.tags,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

// Helper to extract Table of Contents items from Markdown headings
function extractTableOfContents(markdown: string) {
  const headingRegex = /^(#{2,3})\s+(.*)$/gm;
  const items: { level: number; text: string; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    items.push({ level, text, id });
  }

  return items;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // If post does not exist or is a draft, return 404 for public visitors
  if (!post || post.status !== 'published') {
    notFound();
  }

  const allPosts = await getPublishedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Find related posts by tag
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.tags?.some((t) => post.tags?.includes(t)))
    .slice(0, 2);

  const toc = extractTableOfContents(post.content);

  return (
    <div className="w-full bg-white dark:bg-zinc-950">
      <article className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Back Link */}
        <div className="pb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Blog</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 pb-10 border-b border-zinc-200 dark:border-zinc-900">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-zinc-900 dark:text-zinc-100 font-normal leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          {/* Excerpt / Lead */}
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-serif leading-relaxed italic border-l-2 border-zinc-300 dark:border-zinc-800 pl-4 py-1">
              {post.excerpt}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs font-mono text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-900">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-800 dark:text-zinc-200">
                  BZ
                </div>
                <span className="text-zinc-800 dark:text-zinc-200">{siteConfig.name}</span>
              </div>
              <span>•</span>
              {post.published_at && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>

            {post.reading_time && (
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{post.reading_time}</span>
              </div>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="my-10 relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Layout: Content & Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
          {/* Main Markdown Body */}
          <div className="lg:col-span-8">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Table of Contents Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-6 p-6 border border-zinc-300 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/20">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 pb-2 border-b border-zinc-300 dark:border-zinc-800">
                Table of Contents
              </div>

              {toc.length > 0 ? (
                <nav className="space-y-2 text-xs font-mono">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors leading-relaxed ${
                        item.level === 3 ? 'pl-3 text-[11px] text-zinc-500' : ''
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              ) : (
                <p className="text-xs text-zinc-500 font-mono">
                  No section anchors in this article.
                </p>
              )}

              <div className="pt-4 border-t border-zinc-300 dark:border-zinc-800 text-[11px] font-mono text-zinc-500 space-y-2">
                <div>Author: {siteConfig.name}</div>
                <div>Discipline: Web Penetration Testing</div>
              </div>
            </div>
          </aside>
        </div>

        {/* Author Callout / Bio Box */}
        <div className="my-16 p-8 border border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-700 flex-shrink-0">
            <Image
              src={siteConfig.portraitImage}
              alt={siteConfig.name}
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {siteConfig.name}
              </span>
              <span className="font-mono text-xs text-zinc-500">
                {siteConfig.title} & {siteConfig.subtitle}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Web penetration tester dedicated to finding vulnerabilities, assessing authentication boundaries, and securing web applications. Founder of SkySec.
            </p>
          </div>
        </div>

        {/* Previous / Next Article Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-zinc-200 dark:border-zinc-900 font-mono text-xs">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="p-5 border border-zinc-300 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-900/20 transition-all group space-y-2"
            >
              <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-300">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Article</span>
              </div>
              <div className="font-serif text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white line-clamp-1">
                {prevPost.title}
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="p-5 border border-zinc-300 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-900/20 transition-all group space-y-2 text-right"
            >
              <div className="flex items-center justify-end gap-1.5 text-zinc-500 group-hover:text-zinc-300">
                <span>Next Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="font-serif text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white line-clamp-1">
                {nextPost.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-900">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-6">
              Related Blog Posts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="p-6 border border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/20 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all space-y-2 group"
                >
                  <div className="text-[11px] font-mono text-zinc-500">
                    {related.published_at &&
                      new Date(related.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                  </div>
                  <h4 className="font-serif text-base text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white line-clamp-2">
                    {related.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
