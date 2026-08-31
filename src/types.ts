export type Page = 'login' | 'dashboard' | 'blog' | 'blog-create' | 'blog-edit' | 'categories' | 'seo';

export interface BlogPost {
  id?: string;
  _id?: string;
  // English (Required)
  title: string;
  slug: string;
  bodyContent: string;
  shortSummary?: string;
  seoTitle?: string;
  seoDescription?: string;
  // Italian (Optional)
  titleIt?: string;
  slugIt?: string;
  bodyContentIt?: string;
  shortSummaryIt?: string;
  seoTitleIt?: string;
  seoDescriptionIt?: string;
  // Common
  category: string;
  status: 'Published' | 'Draft';
  publishDate: string;
  author?: string;
  readTime?: string;
  featuredImage?: string;
  targetKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  postCount?: number;
  createdDate?: string;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: string;
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