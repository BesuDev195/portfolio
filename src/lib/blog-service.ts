import { createClient as createServerSupabase } from './supabase/server';
import { createPublicClient } from './supabase/public';
import { BlogPost, BlogFormData } from './types';
import { INITIAL_SEED_POSTS } from './seed-data';
import { calculateReadingTime } from './reading-time';

// In-memory fallback cache for development before Supabase keys are configured
let memoryPosts: BlogPost[] = [...INITIAL_SEED_POSTS];

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Fetch all published blog posts for public display (Homepage & /blog)
 * Strictly filters out drafts for public security
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((post) => ({
          ...post,
          tags: Array.isArray(post.tags) ? post.tags : [],
          reading_time: calculateReadingTime(post.content),
        }));
      }
    }
  } catch (err) {
    console.warn('Supabase query failed, falling back to local seed data:', err);
  }

  // Fallback to published seed posts
  return memoryPosts
    .filter((post) => post.status === 'published')
    .sort(
      (a, b) =>
        new Date(b.published_at || b.created_at).getTime() -
        new Date(a.published_at || a.created_at).getTime()
    )
    .map((post) => ({
      ...post,
      reading_time: calculateReadingTime(post.content),
    }));
}

/**
 * Fetch a single blog post by unique slug (for /blog/[slug])
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : [],
          reading_time: calculateReadingTime(data.content),
        };
      }
    }
  } catch (err) {
    console.warn('Supabase query failed, checking local seed data:', err);
  }

  const found = memoryPosts.find((p) => p.slug === slug);
  if (!found) return null;
  return {
    ...found,
    reading_time: calculateReadingTime(found.content),
  };
}

/**
 * Fetch all posts (both published and drafts) for admin dashboard (/manage-blog)
 */
export async function getAllPostsForAdmin(): Promise<BlogPost[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((post) => ({
          ...post,
          tags: Array.isArray(post.tags) ? post.tags : [],
          reading_time: calculateReadingTime(post.content),
        }));
      }
    }
  } catch (err) {
    console.warn('Supabase admin query failed, using local store:', err);
  }

  return memoryPosts.map((post) => ({
    ...post,
    reading_time: calculateReadingTime(post.content),
  }));
}

/**
 * Fetch a single post by ID for admin editing (/manage-blog/edit/[id])
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : [],
          reading_time: calculateReadingTime(data.content),
        };
      }
    }
  } catch (err) {
    console.warn('Supabase getPostById failed, checking local store:', err);
  }

  const found = memoryPosts.find((p) => p.id === id);
  if (!found) return null;
  return {
    ...found,
    reading_time: calculateReadingTime(found.content),
  };
}

/**
 * Create a new post
 */
export async function createPost(formData: BlogFormData): Promise<{ post?: BlogPost; error?: string }> {
  const now = new Date().toISOString();
  const published_at = formData.status === 'published' ? now : null;

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image || null,
        tags: formData.tags,
        status: formData.status,
        published_at,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('blogs')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }
      return { post: data };
    }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Database insertion failed' };
  }

  // Local fallback
  const newPost: BlogPost = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
    title: formData.title,
    slug: formData.slug,
    excerpt: formData.excerpt,
    content: formData.content,
    cover_image: formData.cover_image || null,
    tags: formData.tags,
    status: formData.status,
    published_at,
    created_at: now,
    updated_at: now,
    reading_time: calculateReadingTime(formData.content),
  };

  memoryPosts = [newPost, ...memoryPosts];
  return { post: newPost };
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: string,
  formData: Partial<BlogFormData>
): Promise<{ post?: BlogPost; error?: string }> {
  const now = new Date().toISOString();
  const published_at = formData.status === 'published' ? now : undefined;

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const payload: Record<string, unknown> = {
        ...formData,
        updated_at: now,
      };
      if (formData.status === 'published') {
        payload.published_at = now;
      }

      const { data, error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }
      return { post: data };
    }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Database update failed' };
  }

  // Local fallback
  const index = memoryPosts.findIndex((p) => p.id === id);
  if (index === -1) {
    return { error: 'Post not found' };
  }

  const existing = memoryPosts[index];
  const updated: BlogPost = {
    ...existing,
    ...formData,
    tags: formData.tags || existing.tags,
    published_at: formData.status === 'published' ? (existing.published_at || now) : (formData.status === 'draft' ? null : existing.published_at),
    updated_at: now,
    reading_time: formData.content ? calculateReadingTime(formData.content) : existing.reading_time,
  };

  memoryPosts[index] = updated;
  return { post: updated };
}

/**
 * Delete a post by ID
 */
export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Database deletion failed' };
  }

  memoryPosts = memoryPosts.filter((p) => p.id !== id);
  return { success: true };
}
