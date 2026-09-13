
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indices for performance and query optimization
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status_published ON public.blogs(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);

-- Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_blogs_updated_at ON public.blogs;
CREATE TRIGGER set_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous reads ONLY for published posts
DROP POLICY IF EXISTS "Public can view published posts" ON public.blogs;
CREATE POLICY "Public can view published posts"
    ON public.blogs
    FOR SELECT
    USING (status = 'published');

-- Allow authenticated administrator full access (CREATE, READ, UPDATE, DELETE, PUBLISH)
DROP POLICY IF EXISTS "Admins have full access to blogs" ON public.blogs;
CREATE POLICY "Admins have full access to blogs"
    ON public.blogs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. PROJECTS & CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.projects_certs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_projects_certs_created_at ON public.projects_certs(created_at DESC);

ALTER TABLE public.projects_certs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view projects and certs" ON public.projects_certs;
CREATE POLICY "Public can view projects and certs"
    ON public.projects_certs
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins have full access to projects and certs" ON public.projects_certs;
CREATE POLICY "Admins have full access to projects and certs"
    ON public.projects_certs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. SUPABASE STORAGE SETUP (blog-images bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Note: To configure RLS policies for your 'blog-images' bucket, 
-- please go to the Supabase Dashboard -> Storage -> Policies.
