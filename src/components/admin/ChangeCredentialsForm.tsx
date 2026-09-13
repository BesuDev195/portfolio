'use client';

import React, { useState } from 'react';
import { Shield, Key, Save, AlertTriangle } from 'lucide-react';
import { updateCredentialsServerAction } from '@/app/manage-blog/actions';

export function ChangeCredentialsForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !password) return;

    setStatus({ type: 'loading' });

    try {
      const result = await updateCredentialsServerAction(email || undefined, password || undefined);
      if (result.error) {
        setStatus({ type: 'error', message: result.error });
      } else {
        setStatus({ type: 'success', message: result.message });
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          Update Admin Credentials
        </h3>
        <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
          Change your admin login email or password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            New Username / Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@security.local"
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-600 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-600 transition-colors"
            />
            <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {status.message && (
          <div className={`p-3 text-sm font-mono flex items-start gap-2 border ${
            status.type === 'error' 
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400' 
              : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{status.message}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={status.type === 'loading' || (!email && !password)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-mono text-sm hover:bg-black dark:hover:bg-white transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{status.type === 'loading' ? 'Saving...' : 'Update Credentials'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
