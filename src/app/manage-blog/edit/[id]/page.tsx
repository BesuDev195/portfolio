import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/blog-service';
import { BlogEditorForm } from '@/components/admin/BlogEditorForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  return {
    title: post ? `Edit: ${post.title}` : 'Edit Post',
  };
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          Modification Mode
        </span>
        <h1 className="text-3xl font-serif text-zinc-100 font-normal">
          Revise Publication: {post.title}
        </h1>
      </div>

      <BlogEditorForm initialPost={post} isEditing={true} />
    </div>
  );
}
