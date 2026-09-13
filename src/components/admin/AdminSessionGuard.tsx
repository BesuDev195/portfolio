'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pingSessionAction } from '@/app/manage-blog/actions';

const SESSION_TIMEOUT_SECONDS = 10 * 60;
import { ShieldAlert, Clock, AlertTriangle } from 'lucide-react';

export function AdminSessionGuard() {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(SESSION_TIMEOUT_SECONDS);
  const lastActiveRef = useRef<number>(Date.now());
  const lastPingRef = useRef<number>(Date.now());

  // Activity listener to reset inactivity timer
  const recordActivity = useCallback(() => {
    const now = Date.now();
    lastActiveRef.current = now;

    // Ping server every 2 minutes of activity to refresh sliding window
    if (now - lastPingRef.current > 2 * 60 * 1000) {
      lastPingRef.current = now;
      pingSessionAction().then((res) => {
        if (!res.valid) {
          router.push('/manage-blog/login?timeout=1');
        }
      });
    }
  }, [router]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleEvent = () => recordActivity();

    events.forEach((evt) => window.addEventListener(evt, handleEvent, { passive: true }));

    // Tick every second
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastActiveRef.current) / 1000);
      const remaining = Math.max(0, SESSION_TIMEOUT_SECONDS - elapsed);
      setRemainingSeconds(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        router.push('/manage-blog/login?timeout=1');
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      events.forEach((evt) => window.removeEventListener(evt, handleEvent));
    };
  }, [recordActivity, router]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpiringSoon = remainingSeconds <= 120; // 2 minutes or less

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border transition-colors ${
        isExpiringSoon
          ? 'bg-amber-950/40 border-amber-800/80 text-amber-400 animate-pulse'
          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
      }`}
      title="Administrative session expires after 10 minutes of inactivity"
    >
      {isExpiringSoon ? (
        <AlertTriangle className="w-3 h-3 text-amber-400" />
      ) : (
        <Clock className="w-3 h-3 text-zinc-500" />
      )}
      <span>Session: {timeFormatted}</span>
    </div>
  );
}
