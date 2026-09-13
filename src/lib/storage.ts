import { createClient as createBrowserSupabase } from './supabase/client';

export async function uploadBlogImage(file: File): Promise<{ url?: string; error?: string }> {
  // Validate file type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (!allowedMimeTypes.includes(file.type)) {
    return { error: 'Invalid file type. Please upload a JPG, PNG, WEBP, or AVIF image.' };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Image size exceeds 5MB limit.' };
  }

  const supabase = createBrowserSupabase();
  if (supabase) {
    try {
      const fileName = file.name || 'pasted-image.png';
      const fileExt = fileName.split('.').pop() || 'png';
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `uploads/${Date.now()}-${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return { error: uploadError.message };
      }

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      return { url: data.publicUrl };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Storage upload failed' };
    }
  }

  // Fallback for local development without Supabase credentials:
  // Convert to object URL or Data URL so author can preview immediately
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ error: 'Failed to read file locally' });
    };
    reader.readAsDataURL(file);
  });
}
