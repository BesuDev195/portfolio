export type BlogStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  tags: string[];
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  reading_time?: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  tags: string[];
  status: BlogStatus;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  link: string;
  created_at: string;
}

export interface PortfolioItemFormData {
  title: string;
  description: string;
  link: string;
}
