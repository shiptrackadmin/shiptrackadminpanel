export type Page = 'login' | 'dashboard' | 'blog' | 'blog-create' | 'blog-edit' | 'categories' | 'seo';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'Published' | 'Draft';
  publishDate: string;
  author: string; // e.g., "Admin"
  readTime: string; // MANUAL ENTRY e.g. "5 minutes"
  shortSummary: string;
  bodyContent: string;
  featuredImage?: string;
  targetKeywords: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdDate: string;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: string;
  type: 'login' | 'publish' | 'category' | 'draft';
}

export interface SeoConfig {
  sitemapUrl: string;
  sitemapLastGenerated: string;
  robotsTxt: string;
  robotsLastUpdated: string;
  metaTitleSuffix: string;
  canonicalEnabled: boolean;
  globalMetaDescription: string;
}
