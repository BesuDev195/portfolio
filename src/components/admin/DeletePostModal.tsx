'use client';

import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeletePostModalProps {
  isOpen: boolean;
  postTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeletePostModal({
  isOpen,
  postTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: DeletePostModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md border border-red-900/60 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-red-800/80 bg-red-950/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-mono font-semibold text-zinc-100">
                Confirm Deletion
              </h3>
              <p className="text-xs font-mono text-zinc-500">
                Irreversible administrative operation
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning text */}
        <div className="space-y-2 text-xs font-mono text-zinc-300 bg-zinc-900/50 p-4 border border-zinc-800">
          <p className="text-zinc-400">Are you sure you want to permanently delete:</p>
          <p className="font-serif text-sm text-zinc-100 italic">&ldquo;{postTitle}&rdquo;?</p>
          <p className="text-[11px] text-red-400 pt-1">
            This action cannot be undone. The article and its references will be removed from the database.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 font-mono text-xs pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Post'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
