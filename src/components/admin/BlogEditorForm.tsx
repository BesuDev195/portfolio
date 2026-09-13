'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost, BlogFormData, BlogStatus } from '@/lib/types';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { uploadBlogImage } from '@/lib/storage';
import {
  createBlogServerAction,
  updateBlogServerAction,
  deleteBlogServerAction,
} from '@/app/manage-blog/actions';
import { DeletePostModal } from './DeletePostModal';
import {
  Save,
  Send,
  ArrowLeft,
  Upload,
  Eye,
  Edit2,
  Columns,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Code,
  Heading1,
  Heading2,
  List,
  Quote,
  Table as TableIcon,
  Link2
} from 'lucide-react';

interface BlogEditorFormProps {
  initialPost?: BlogPost;
  isEditing?: boolean;
}

export function BlogEditorForm({ initialPost, isEditing = false }: BlogEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [slugModifiedManually, setSlugModifiedManually] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [coverImage, setCoverImage] = useState(initialPost?.cover_image || '');
  const [tagInput, setTagInput] = useState(initialPost?.tags?.join(', ') || 'Web Security, Vulnerability Research');
  const [content, setContent] = useState(initialPost?.content || '');
  const [status, setStatus] = useState<BlogStatus>(initialPost?.status || 'draft');

  // UI tabs for smaller screens (split vs editor vs preview)
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-generate slug from title if not manually edited
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slugModifiedManually) {
      const generated = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Image upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setNotification(null);

    const result = await uploadBlogImage(file);
    setIsUploading(false);

    if (result.error) {
      setNotification({ type: 'error', message: result.error });
    } else if (result.url) {
      setCoverImage(result.url);
      setNotification({ type: 'success', message: 'Cover image uploaded successfully' });
    }
  };

  // Quick Markdown toolbar inserter
  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('markdown-editor-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    setContent(text.substring(0, start) + replacement + text.substring(end));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 0);
  };

  // Handle pasting images directly into the Markdown editor
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = e.clipboardData?.files;
    const items = e.clipboardData?.items;

    let fileToUpload: File | null = null;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          fileToUpload = files[i];
          break;
        }
      }
    } else if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          fileToUpload = items[i].getAsFile();
          break;
        }
      }
    }

    if (fileToUpload) {
      e.preventDefault();

      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = content; // use state directly for synchronous update

      const placeholder = `![Uploading image...]()`;
      const textWithPlaceholder = currentText.substring(0, start) + placeholder + currentText.substring(end);
      setContent(textWithPlaceholder);
      
      setIsUploading(true);
      setNotification(null);

      const result = await uploadBlogImage(fileToUpload);
      setIsUploading(false);

      if (result.error) {
        setNotification({ type: 'error', message: result.error });
        setContent(prev => prev.replace(placeholder, '')); // Revert
      } else if (result.url) {
        setContent(prev => prev.replace(placeholder, `![Image](${result.url})`));
        setNotification({ type: 'success', message: 'Image pasted successfully!' });
      }
    }
  };

  // Save / Submit handler
  const handleSubmit = (overrideStatus?: BlogStatus) => {
    const targetStatus = overrideStatus || status;

    if (!title.trim()) {
      setNotification({ type: 'error', message: 'Article title is required.' });
      return;
    }
    if (!slug.trim()) {
      setNotification({ type: 'error', message: 'Unique slug is required.' });
      return;
    }
    if (!content.trim()) {
      setNotification({ type: 'error', message: 'Markdown content cannot be empty.' });
      return;
    }

    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: BlogFormData = {
      title,
      slug,
      excerpt,
      content,
      cover_image: coverImage,
      tags: tagsArray,
      status: targetStatus,
    };

    setNotification(null);

    startTransition(async () => {
      if (isEditing && initialPost?.id) {
        const res = await updateBlogServerAction(initialPost.id, payload);
        if (res.error) {
          setNotification({ type: 'error', message: res.error });
        } else {
          setNotification({ type: 'success', message: 'Article updated successfully.' });
          router.push('/manage-blog');
          router.refresh();
        }
      } else {
        const res = await createBlogServerAction(payload);
        if (res.error) {
          setNotification({ type: 'error', message: res.error });
        } else {
          setNotification({ type: 'success', message: 'Article created successfully.' });
          router.push('/manage-blog');
          router.refresh();
        }
      }
    });
  };

  // Delete handler
  const handleDelete = async () => {
    if (!initialPost?.id) return;
    setIsDeleting(true);

    try {
      const res = await deleteBlogServerAction(initialPost.id);
      if (res.error) {
        setNotification({ type: 'error', message: res.error });
        setShowDeleteModal(false);
      } else {
        router.push('/manage-blog');
        router.refresh();
      }
    } catch (err: unknown) {
      setNotification({ type: 'error', message: err instanceof Error ? err.message : 'Deletion failed' });
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <Link
          href="/manage-blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-3 py-1.5 border transition-colors flex items-center gap-1.5 ${
              viewMode === 'editor'
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Edit2 className="w-3 h-3" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 border transition-colors flex items-center gap-1.5 ${
              viewMode === 'preview'
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 border transition-colors ${
              viewMode === 'split'
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>Split View</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-2 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-900/60 transition-colors"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit('published')}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{status === 'published' ? 'Update & Publish' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 border font-mono text-xs flex items-center gap-2 ${
            notification.type === 'error'
              ? 'border-red-900/60 bg-red-950/30 text-red-300'
              : 'border-emerald-900/60 bg-emerald-950/30 text-emerald-300'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Check className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Metadata Fields */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 border border-zinc-800 bg-zinc-900/20 font-mono text-xs">
        {/* Title */}
        <div className="md:col-span-8 space-y-1.5">
          <label className="block text-zinc-400 uppercase tracking-wider">
            Article Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g., Deep Dive into Modern IDOR Patterns in Microservices"
            className="w-full bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm font-serif text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Slug */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="block text-zinc-400 uppercase tracking-wider">
            SEO Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugModifiedManually(true);
            }}
            placeholder="modern-idor-patterns"
            className="w-full bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        {/* Excerpt */}
        <div className="md:col-span-12 space-y-1.5">
          <label className="block text-zinc-400 uppercase tracking-wider">
            Brief Excerpt / Summary
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A concise synopsis of the vulnerability analysis and impact for listing cards..."
            className="w-full bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed"
          />
        </div>

        {/* Cover Image & Upload */}
        <div className="md:col-span-6 space-y-2">
          <label className="block text-zinc-400 uppercase tracking-wider">
            Cover Image Path or URL (Optional)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Leave blank or upload an image..."
              className="flex-1 bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
            />
            <label className="cursor-pointer px-3 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
          {/* Quick presets */}
          <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-500">
            <span>Presets:</span>
            <button
              type="button"
              onClick={() => setCoverImage('/images/cover_idor.jpg')}
              className="text-zinc-400 hover:text-white underline underline-offset-2"
            >
              Corridors
            </button>
            <button
              type="button"
              onClick={() => setCoverImage('/images/cover_http2.jpg')}
              className="text-zinc-400 hover:text-white underline underline-offset-2"
            >
              Louvers
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="md:col-span-6 space-y-1.5">
          <label className="block text-zinc-400 uppercase tracking-wider">
            Tags (Comma-separated)
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Web Security, IDOR, GraphQL, WAF"
            className="w-full bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>

      {/* Two-Panel Markdown Editor & Live Preview */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        {/* Left Panel: Markdown Source Editor */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className="border border-zinc-800 bg-zinc-950 flex flex-col h-[700px]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/40 font-mono text-xs">
              <span className="uppercase tracking-widest text-zinc-400 font-semibold text-[11px]">
                Markdown Source
              </span>

              {/* Formatting helper buttons */}
              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  type="button"
                  onClick={() => insertMarkdown('## ')}
                  className="p-1 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Heading 2"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('### ')}
                  className="p-1 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Heading 3"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**')}
                  className="p-1 font-serif font-bold text-xs hover:text-white hover:bg-zinc-800 transition-colors px-1"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*')}
                  className="p-1 font-serif italic text-xs hover:text-white hover:bg-zinc-800 transition-colors px-1"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('```http\n', '\n```')}
                  className="p-1 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Code block"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('> ')}
                  className="p-1 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Blockquote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Data A | Data B |\n')}
                  className="p-1 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Table"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              id="markdown-editor-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              placeholder="Write your cybersecurity research, exploit analysis, or methodology here using Markdown..."
              className="w-full flex-1 bg-transparent p-5 font-mono text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none leading-relaxed overflow-y-auto"
            />

            <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-900/20 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>{content.split(/\s+/).filter(Boolean).length} words</span>
              <span>Sanitized via OWASP A03 / rehype-sanitize</span>
            </div>
          </div>
        )}

        {/* Right Panel: Live Synchronized Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="border border-zinc-800 bg-zinc-950 flex flex-col h-[700px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/40 font-mono text-xs">
              <span className="uppercase tracking-widest text-zinc-400 font-semibold text-[11px]">
                Live Editorial Preview
              </span>
              <span className="text-[10px] text-zinc-500">
                Matches /blog/[slug]
              </span>
            </div>

            {/* Live Render Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-zinc-950">
              {/* Preview Header */}
              <div className="space-y-4 pb-6 border-b border-zinc-900">
                <div className="flex flex-wrap gap-1.5">
                  {tagInput
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800"
                      >
                        {t}
                      </span>
                    ))}
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif text-zinc-100 font-normal">
                  {title || 'Untitled Security Publication'}
                </h1>
                {excerpt && (
                  <p className="text-sm text-zinc-400 font-serif italic border-l-2 border-zinc-800 pl-3">
                    {excerpt}
                  </p>
                )}
              </div>

              {coverImage && (
                <div className="my-6 relative aspect-video w-full rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Rendered Body */}
              <div className="pt-2">
                <MarkdownRenderer content={content} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePostModal
        isOpen={showDeleteModal}
        postTitle={title}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
