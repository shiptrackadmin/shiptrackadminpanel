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
}