import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { getPublishedPosts } from '@/lib/blog-service';
import { getPortfolioItems } from '@/lib/portfolio-service';
import {
  ArrowUpRight,
  Shield,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const allPublishedPosts = await getPublishedPosts();
  const latestPosts = allPublishedPosts.slice(0, 3);
  const worksItems = await getPortfolioItems();

  return (
    <div className="w-full flex flex-col items-center">
      {/* =================================================================== */}
      {/* 1. HERO SECTION */}
      {/* =================================================================== */}
      <section id="hero" className="w-full max-w-6xl mx-auto px-6 pt-12 pb-24 sm:pt-20 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Photograph */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-2xl group">
              <Image
                src={siteConfig.portraitImage}
                alt={`${siteConfig.name} - ${siteConfig.title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

            </div>
          </div>

          {/* Large Editorial Typography & Bio */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Scope */}
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-zinc-700" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                  {siteConfig.tagline}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal tracking-tight text-zinc-900 dark:text-zinc-100 leading-[0.95]">
                {siteConfig.name}
              </h1>

              {/* Dual Role / Titles */}
              <div className="space-y-1 font-mono text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 font-light">
                <div className="text-zinc-800 dark:text-zinc-200">{siteConfig.title}</div>
                {siteConfig.subtitle && <div className="text-zinc-500">{siteConfig.subtitle}</div>}
              </div>

              {/* Professional Introduction */}
              <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed max-w-xl pt-2">
                &ldquo;{siteConfig.introduction}&rdquo;
              </p>

              {/* Direct Actions */}
              <div className="pt-6 flex flex-wrap items-center gap-4 text-sm font-mono">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-medium hover:bg-white transition-all shadow-md"
                >
                  <span>Explore Blog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#experience"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-none border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-500 dark:hover:border-zinc-600 transition-all bg-white dark:bg-zinc-950"
                >
                  <span>View Experience</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. ABOUT SECTION */}
      {/* =================================================================== */}
      <section id="about" className="w-full border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Section Label */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                  01 / Background
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-zinc-900 dark:text-zinc-100 font-normal">
                  About & Pentest Focus
                </h2>
                <p className="text-xs font-mono text-zinc-500 leading-relaxed pt-2">
                  Hands-on web penetration testing, OWASP Top 10 assessment, and vulnerability discovery.
                </p>
              </div>
            </div>

            {/* Narrative & Specializations */}
            <div className="lg:col-span-8 space-y-10">
              <div className="prose prose-invert max-w-none text-zinc-700 dark:text-zinc-300 font-serif text-lg leading-relaxed space-y-6">
                <p className="text-xl text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                  {siteConfig.about.lead}
                </p>
                {siteConfig.about.paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-zinc-600 dark:text-zinc-400">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Specialization List */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-900">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-6">
                  Core Pentesting Focus & Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {siteConfig.about.specializations.map((spec, index) => (
                    <div
                      key={index}
                      className="p-4 border border-zinc-300 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-none flex items-start gap-3 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
                    >
                      <span className="text-xs font-mono text-zinc-500 mt-0.5">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200">
                        {spec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. EXPERIENCE SECTION */}
      {/* =================================================================== */}
      <section id="experience" className="w-full border-t border-zinc-200 dark:border-zinc-900 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Section Header */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                  02 / Experience
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-zinc-900 dark:text-zinc-100 font-normal">
                  Work & Engagements
                </h2>
                <p className="text-xs font-mono text-zinc-500 leading-relaxed pt-2">
                  Hands-on security assessments, institutional training, portal auditing, and security leadership.
                </p>
              </div>
            </div>

            {/* Experience Items */}
            <div className="lg:col-span-8 space-y-6">
              {siteConfig.experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-6 border border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/20 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-serif text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        {exp.organization}
                      </div>
                    </div>
                    {exp.period && (
                      <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 self-start sm:self-auto">
                        {exp.period}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed pt-1">
                    {exp.description}
                  </p>

                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-mono text-zinc-500 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. PROJECTS & CERTIFICATIONS SECTION */}
      {/* =================================================================== */}
      <section id="projects" className="w-full border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Section Header */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                  03 / Projects
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-zinc-900 dark:text-zinc-100 font-normal">
                  Projects & Certs
                </h2>
                <p className="text-xs font-mono text-zinc-500 leading-relaxed pt-2">
                  A continuous record of my professional certifications, independent cybersecurity research, and personal projects.
                </p>
              </div>
            </div>

            {/* Projects Items */}
            <div className="lg:col-span-8">
              {worksItems.length === 0 ? (
                <div className="py-12 border border-dashed border-zinc-300 dark:border-zinc-800 p-8 font-mono text-center bg-white/50 dark:bg-zinc-900/10">
                  <p className="text-zinc-500 text-sm">No projects or certs have been added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {worksItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="group relative flex flex-col p-6 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
                    >
                      <h3 className="text-lg font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400 flex-grow mb-6 whitespace-pre-wrap leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="mt-auto">
                        <Link 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                        >
                          <span>View Resource</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. SOCIAL MEDIA / CONTACT SECTION */}
      {/* =================================================================== */}
      <section id="socials" className="w-full border-t border-zinc-200 dark:border-zinc-900 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Section Header */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                  04 / Network
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-zinc-900 dark:text-zinc-100 font-normal">
                  Let&apos;s connect
                </h2>
                <p className="text-xs font-mono text-zinc-500 leading-relaxed pt-2">
                  Direct channels for web penetration testing inquiries, vulnerability reports, and peer collaboration.
                </p>
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={social.ariaLabel}
                  className="p-5 border border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/20 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-900/50 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                      {social.platform}
                    </div>
                    <div className="text-sm font-mono text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      {social.username}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 dark:text-zinc-600 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. LATEST BLOG SECTION */}
      {/* =================================================================== */}
      <section id="blog" className="w-full border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-12 border-b border-zinc-200 dark:border-zinc-900 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                05 / Blog
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-zinc-900 dark:text-zinc-100 font-normal">
                Latest Blog Posts
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors group"
            >
              <span>View all blog posts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Writings / Blog Grid */}
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              {latestPosts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col justify-between border border-zinc-300 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/10 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all group"
                >
                  <div>
                    {post.cover_image && (
                      <div className="relative aspect-video w-full overflow-hidden border-b border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                        {post.published_at && (
                          <span>
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
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

                      <h3 className="text-xl font-serif text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-none text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 pt-2 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read article</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-zinc-300 dark:border-zinc-800 p-8 font-mono space-y-3 mt-8">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">No blog posts published yet.</p>
              <p className="text-zinc-500 dark:text-zinc-600 text-xs">
                Articles published via the admin portal will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
