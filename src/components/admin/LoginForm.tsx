'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/manage-blog/actions';
import { KeyRound, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  redirectTarget: string;
}

export function LoginForm({
  redirectTarget,
}: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        const result = await loginAction(formData);
        if (result?.error) {
          setErrorMsg(result.error);
        } else {
          router.push(redirectTarget);
          router.refresh();
        }
      } catch (err: unknown) {
        // Handle Next.js redirect throw or regular error
        if ((err as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
          router.push(redirectTarget);
        } else {
          setErrorMsg(err instanceof Error ? err.message : 'Login failed');
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
      <input type="hidden" name="redirect" value={redirectTarget} />

      {errorMsg && (
        <div className="p-3 border border-red-900/50 bg-red-950/30 text-xs font-mono text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-zinc-400 uppercase tracking-wider"
        >
          Administrator Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="admin@example.com"
          autoComplete="username"
          className="w-full bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-zinc-400 uppercase tracking-wider"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••••••"
          autoComplete="current-password"
          className="w-full bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-zinc-100 text-zinc-950 font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
      >
        <KeyRound className="w-3.5 h-3.5" />
        <span>{isPending ? 'Verifying Session...' : 'Authenticate Session'}</span>
      </button>
    </form>
  );
}
