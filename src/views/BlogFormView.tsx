import React, { useState, useEffect } from 'react';
import { BlogPost, Category } from '../types';
import {
  ArrowLeft,
  Save,
  Send,
  UploadCloud,
  Clock,
  Bold,
  Italic,
  List,
  Heading,
  Link,
  Quote,
  Code,
  Sparkles,
  Info,
} from 'lucide-react';

interface BlogFormViewProps {
  initialPost?: BlogPost | null;
  categories: Category[];
  onSave: (postData: Partial<BlogPost>, status: 'Published' | 'Draft') => void;
  onCancel: () => void;
}

export const BlogFormView: React.FC<BlogFormViewProps> = ({
  initialPost,
  categories,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialPost?.id);

  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState(initialPost?.category || (categories.length > 0 ? categories[0].name : ''));
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featuredImage || '');
  const [bodyContent, setBodyContent] = useState(initialPost?.bodyContent || '');
  const [shortSummary, setShortSummary] = useState(initialPost?.shortSummary || '');
  const [targetKeywords, setTargetKeywords] = useState(initialPost?.targetKeywords || '');
  const [readTime, setReadTime] = useState(initialPost?.readTime || '5 minutes');
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || '');
  const [status, setStatus] = useState<'Published' | 'Draft'>(initialPost?.status || 'Draft');
  const [publishDate, setPublishDate] = useState(
    initialPost?.publishDate || new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (!isSlugManuallyEdited && title && !isEditing) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  }, [title, isSlugManuallyEdited, isEditing]);

  const handleInsertTag = (tag: string) => {
    setBodyContent((prev) => prev + `\n${tag} `);
  };

  const handleFormSubmit = (targetStatus: 'Published' | 'Draft') => {
    onSave(
      {
        id: initialPost?.id,
        title,
        slug,
        category,
        featuredImage,
        bodyContent,
        shortSummary,
        targetKeywords,
        readTime,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || shortSummary,
        status: targetStatus,
        publishDate,
        author: initialPost?.author || 'Admin',
      },
      targetStatus
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Edit Post: ${initialPost?.title}` : 'Create New Post'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Fill in post metadata, rich text body, manual read time, and SEO configurations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleFormSubmit('Draft')}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4 text-amber-600" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleFormSubmit('Published')}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#1e3a8a] hover:bg-[#2563eb] transition-colors flex items-center gap-2 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Publish Post</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Post Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to Track International Parcel Customs Clearance"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                  shiptrack.com/blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugManuallyEdited(true);
                  }}
                  placeholder="auto-generated-slug"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Featured Image
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop your hero image here, or paste image URL below
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>

              <div className="mt-4 max-w-lg mx-auto flex items-center gap-2">
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFeaturedImage(
                      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
                    )
                  }
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-medium text-slate-700 transition-colors"
                >
                  Load Sample Image
                </button>
              </div>

              {featuredImage && (
                <div className="mt-4 max-w-sm mx-auto rounded-lg overflow-hidden border border-slate-200 max-h-40">
                  <img
                    src={featuredImage}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Body Content (Rich Text) *
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {bodyContent.length} characters
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-700">
              <button
                type="button"
                onClick={() => handleInsertTag('**Bold Text**')}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('*Italic Text*')}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-300 mx-1" />
              <button
                type="button"
                onClick={() => handleInsertTag('### Subheading')}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Heading"
              >
                <Heading className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('- List Item')}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('> Quote block')}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('[Link Text](https://shiptrack.com)')}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Link"
              >
                <Link className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('```\ncode block\n```')}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={10}
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              placeholder="Write or paste your article content here..."
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-sans text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              required
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Short Summary / Excerpt
                </label>
                <span className={`text-xs ${shortSummary.length > 160 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                  {shortSummary.length} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={shortSummary}
                onChange={(e) => setShortSummary(e.target.value)}
                placeholder="Brief summary used in article preview cards and RSS feeds..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Target Keywords
              </label>
              <input
                type="text"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
                placeholder="e.g. package tracking, customs hold, express delivery"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">Comma-separated key phrases</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              SEO Title & Meta Description Override
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">SEO Title</label>
                <span className="text-[11px] text-slate-400">{seoTitle.length} / 60 chars</span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || 'Custom search engine title...'}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  SEO Meta Description
                </label>
                <span className="text-[11px] text-slate-400">
                  {seoDescription.length} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={shortSummary || 'Custom search engine snippet...'}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Publishing Controls
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                <option value="Published">Published (Live on site)</option>
                <option value="Draft">Draft (Scheduled / Review)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Publish Date
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Author</label>
              <input
                type="text"
                value="Admin"
                disabled
                className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs space-y-3 bg-gradient-to-b from-blue-50/40 to-white">
            <div className="flex items-center gap-2 text-blue-900">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Estimated Read Time (Manual Entry)
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Read Time String *
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 5 minutes"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-blue-100/60 border border-blue-200 text-[11px] text-blue-900 font-medium">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> Read time is manually specified by the admin and will not be auto-calculated.
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <button
              type="button"
              onClick={() => handleFormSubmit('Published')}
              className="w-full py-3 px-4 bg-[#1e3a8a] hover:bg-[#2563eb] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Publish Now</span>
            </button>

            <button
              type="button"
              onClick={() => handleFormSubmit('Draft')}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-600" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 px-4 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors"
            >
              Discard & Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};