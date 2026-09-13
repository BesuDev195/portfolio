import { createClient as createServerSupabase } from './supabase/server';
import { createPublicClient } from './supabase/public';
import { PortfolioItem, PortfolioItemFormData } from './types';

// In-memory fallback cache for development before Supabase keys are configured
let memoryPortfolio: PortfolioItem[] = [];

/**
 * Fetch all portfolio items for public display or admin panel
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('projects_certs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as PortfolioItem[];
      }
    }
  } catch (err) {
    console.warn('Supabase query failed, falling back to local data:', err);
  }

  // Fallback
  return memoryPortfolio.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Create a new portfolio item
 */
export async function createPortfolioItem(formData: PortfolioItemFormData): Promise<{ item?: PortfolioItem; error?: string }> {
  const now = new Date().toISOString();

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const payload = {
        title: formData.title,
        description: formData.description,
        link: formData.link,
        created_at: now,
      };

      const { data, error } = await supabase
        .from('projects_certs')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }
      return { item: data as PortfolioItem };
    }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Database insertion failed' };
  }

  // Local fallback
  const newItem: PortfolioItem = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
    title: formData.title,
    description: formData.description,
    link: formData.link,
    created_at: now,
  };

  memoryPortfolio = [newItem, ...memoryPortfolio];
  return { item: newItem };
}

/**
 * Delete a portfolio item by ID
 */
export async function deletePortfolioItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await supabase.from('projects_certs').delete().eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Database deletion failed' };
  }

  memoryPortfolio = memoryPortfolio.filter((p) => p.id !== id);
  return { success: true };
}
