'use client';

import React, { useState } from 'react';
import { PortfolioItem } from '@/lib/types';
import { createPortfolioItemAction, deletePortfolioItemAction } from '@/app/manage-blog/actions';
import { Plus, Trash2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PortfolioManagerProps {
  initialItems: PortfolioItem[];
}

export function PortfolioManager({ initialItems }: PortfolioManagerProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createPortfolioItemAction({
        title,
        description,
        link: linkUrl
      });

      if (res.error) {
        setError(res.error);
      } else if (res.item) {
        setItems([res.item, ...items]);
        setTitle('');
        setDescription('');
        setLinkUrl('');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await deletePortfolioItemAction(id);
      if (res.error) {
        setError(res.error);
      } else {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm font-mono">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 border border-zinc-800 bg-zinc-900/20 space-y-4">
        <h3 className="text-sm font-mono font-semibold text-zinc-100 mb-4">Add New Project or Certification</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-zinc-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50"
              placeholder="e.g. Offensive Security Certified Professional (OSCP)"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-zinc-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50 resize-y"
              placeholder="Briefly describe the project or certification..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">Link</label>
            <input
              type="url"
              required
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-zinc-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-zinc-500 font-mono text-sm">No projects or certifications added yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-4 border border-zinc-800 bg-zinc-900/10 flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-zinc-100 font-mono font-semibold">{item.title}</h4>
                <p className="text-zinc-400 text-sm whitespace-pre-wrap">{item.description}</p>
                <div className="pt-2">
                  <Link
                    href={item.link}
                    target="_blank"
                    className="inline-flex items-start gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 break-all"
                  >
                    <LinkIcon className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{item.link}</span>
                  </Link>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
