import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/LoginForm';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/blog-service';

export const metadata: Metadata = {
  title: 'Administrator Login',
  description: 'Private administrative authentication for the blog management system.',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const redirectTarget =
    typeof resolvedParams.redirect === 'string'
      ? resolvedParams.redirect
      : '/manage-blog';

  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 border border-zinc-800 bg-zinc-900/30 p-8 sm:p-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to public website</span>
        </Link>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto w-10 h-10 border border-zinc-700 bg-zinc-900 rounded-none flex items-center justify-center text-zinc-300">
            <Lock className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-serif text-zinc-100 font-normal">
            Management Portal
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Restricted access. Authenticate to manage security publications.
          </p>
        </div>



        {/* Interactive Client Login Form */}
        <LoginForm
          redirectTarget={redirectTarget}
        />

        <div className="pt-4 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-600">
          Enforced by Supabase Auth & Server-Side Session Guards.
          <br />
          No public registration enabled.
        </div>
      </div>
    </div>
  );
}
