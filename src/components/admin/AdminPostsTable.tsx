'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/types';
import { DeletePostModal } from './DeletePostModal';
import { deleteBlogServerAction } from '@/app/manage-blog/actions';
import {
  Edit3,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Tag
} from 'lucide-react';

interface AdminPostsTableProps {
  initialPosts: BlogPost[];
}

export function AdminPostsTable({ initialPosts }: AdminPostsTableProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await deleteBlogServerAction(deletingPost.id);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setPosts((prev) => prev.filter((p) => p.id !== deletingPost.id));
        setDeletingPost(null);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 border border-red-900 bg-red-950/40 text-red-300 font-mono text-xs">
          {errorMsg}
        </div>
      )}

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter managed posts..."
            className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-3 py-2 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="text-zinc-500">
          Showing {filteredPosts.length} of {posts.length} entries
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 bg-zinc-950 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs divide-y divide-zinc-800">
          <thead className="bg-zinc-900/60 text-zinc-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5 font-medium">Article Title</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium">Published / Created</th>
              <th className="px-5 py-3.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-900/40 transition-colors group">
                  {/* Title & Slug */}
                  <td className="px-5 py-4 max-w-md">
                    <div className="font-serif text-sm text-zinc-200 group-hover:text-white font-medium line-clamp-1">
                      {post.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 pt-0.5 truncate">
                      /blog/{post.slug}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {post.status === 'published' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-emerald-800/80 bg-emerald-950/40 text-emerald-400 text-[10px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-400 text-[10px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                        Draft
                      </span>
                    )}
                  </td>

                  {/* Timestamps */}
                  <td className="px-5 py-4 whitespace-nowrap text-zinc-400">
                    <div>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Unpublished'}
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      Created{' '}
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4 whitespace-nowrap text-right space-x-2">
                    {post.status === 'published' && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        title="View Public Post"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <Link
                      href={`/manage-blog/edit/${post.id}`}
                      className="inline-flex items-center p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                      title="Edit Post"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => setDeletingPost(post)}
                      className="inline-flex items-center p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-zinc-500 space-y-3">
                  <p className="text-zinc-400">
                    {posts.length === 0
                      ? 'No blog articles created yet.'
                      : 'No blog posts found matching your criteria.'}
                  </p>
                  {posts.length === 0 && (
                    <Link
                      href="/manage-blog/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 font-semibold hover:bg-white transition-colors"
                    >
                      <span>Create Your First Post</span>
                    </Link>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeletePostModal
        isOpen={Boolean(deletingPost)}
        postTitle={deletingPost?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPost(null)}
      />
    </div>
  );
}
