import React from 'react';
import type { Metadata } from 'next';
import { BlogEditorForm } from '@/components/admin/BlogEditorForm';

export const metadata: Metadata = {
  title: 'Compose Research Paper — Blog CMS',
  description: 'Author and publish a new cybersecurity research article.',
};

export default function NewBlogPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          Drafting Mode
        </span>
        <h1 className="text-3xl font-serif text-zinc-100 font-normal">
          Compose Research Publication
        </h1>
      </div>

      <BlogEditorForm isEditing={false} />
    </div>
  );
}
