import React, { useState, useEffect } from 'react';
import { BlogPost, Category } from '../types';
import { RichTextEditor } from '../components/RichTextEditor';
import {
  ArrowLeft,
  Save,
  Send,
  UploadCloud,
  Clock,
  Sparkles,
  Info,
  Languages,
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

  // ========== ENGLISH VERSION ==========
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [bodyContent, setBodyContent] = useState(initialPost?.bodyContent || '');
  const [shortSummary, setShortSummary] = useState(initialPost?.shortSummary || '');
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || '');

  // ========== ITALIAN VERSION ==========
  const [titleIt, setTitleIt] = useState(initialPost?.titleIt || '');
  const [slugIt, setSlugIt] = useState(initialPost?.slugIt || '');
  const [isSlugItManuallyEdited, setIsSlugItManuallyEdited] = useState(false);
  const [bodyContentIt, setBodyContentIt] = useState(initialPost?.bodyContentIt || '');
  const [shortSummaryIt, setShortSummaryIt] = useState(initialPost?.shortSummaryIt || '');
  const [seoTitleIt, setSeoTitleIt] = useState(initialPost?.seoTitleIt || '');
  const [seoDescriptionIt, setSeoDescriptionIt] = useState(initialPost?.seoDescriptionIt || '');

  // ========== COMMON FIELDS ==========
  const [category, setCategory] = useState(initialPost?.category || (categories.length > 0 ? categories[0].name : ''));
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featuredImage || '');
  const [targetKeywords, setTargetKeywords] = useState(initialPost?.targetKeywords || '');
  const [readTime, setReadTime] = useState(initialPost?.readTime || '5 minutes');
  const [status, setStatus] = useState<'Published' | 'Draft'>(initialPost?.status || 'Draft');
  const [publishDate, setPublishDate] = useState(
    initialPost?.publishDate || new Date().toISOString().split('T')[0]
  );

  // Auto-generate English slug from English title
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

  // Auto-generate Italian slug from Italian title
  useEffect(() => {
    if (!isSlugItManuallyEdited && titleIt && !isEditing) {
      const generated = titleIt
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlugIt(generated);
    }
  }, [titleIt, isSlugItManuallyEdited, isEditing]);

  const handleFormSubmit = (targetStatus: 'Published' | 'Draft') => {
    console.log('📝 Submitting form with Italian fields:', {
      titleIt,
      slugIt,
      bodyContentIt: bodyContentIt.substring(0, 50) + '...',
      shortSummaryIt,
      seoTitleIt,
      seoDescriptionIt
    });

    onSave(
      {
        id: initialPost?.id,
        // English
        title,
        slug,
        bodyContent,
        shortSummary,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || shortSummary,
        // Italian
        titleIt: titleIt || '',
        slugIt: slugIt || '',
        bodyContentIt: bodyContentIt || '',
        shortSummaryIt: shortSummaryIt || '',
        seoTitleIt: seoTitleIt || titleIt || '',
        seoDescriptionIt: seoDescriptionIt || shortSummaryIt || '',
        // Common
        category,
        featuredImage,
        targetKeywords,
        readTime,
        status: targetStatus,
        publishDate,
        author: initialPost?.author || 'Admin',
      },
      targetStatus
    );
  };

  const countPlainText = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent?.length || 0;
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
              Enter both English and Italian versions of your article.
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
            <span>Publish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* ========== ENGLISH SECTION ========== */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">English Version</h2>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Default</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How to Track International Parcel"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center gap-2 flex-wrap">
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
                    className="flex-1 min-w-[120px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Body Content *
                </label>
                <RichTextEditor
                  value={bodyContent}
                  onChange={setBodyContent}
                  placeholder="Write your English article content here..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Summary
                </label>
                <textarea
                  rows={2}
                  value={shortSummary}
                  onChange={(e) => setShortSummary(e.target.value)}
                  placeholder="Brief English summary..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Custom search engine title...'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={shortSummary || 'Custom search engine snippet...'}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* ========== ITALIAN SECTION ========== */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-5 h-5 text-green-600" />
              <h2 className="text-sm font-bold text-slate-900">Italian Version</h2>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Optional</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titolo
                </label>
                <input
                  type="text"
                  value={titleIt}
                  onChange={(e) => setTitleIt(e.target.value)}
                  placeholder="e.g. Come Tracciare un Pacco Internazionale"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  URL Slug (Italiano)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                    shiptrack.com/blog/it/
                  </span>
                  <input
                    type="text"
                    value={slugIt}
                    onChange={(e) => {
                      setSlugIt(e.target.value);
                      setIsSlugItManuallyEdited(true);
                    }}
                    placeholder="slug-italiano"
                    className="flex-1 min-w-[120px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Leave empty to use English version as fallback</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenuto
                </label>
                <RichTextEditor
                  value={bodyContentIt}
                  onChange={setBodyContentIt}
                  placeholder="Scrivi il contenuto dell'articolo in italiano..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Breve Riassunto
                </label>
                <textarea
                  rows={2}
                  value={shortSummaryIt}
                  onChange={(e) => setShortSummaryIt(e.target.value)}
                  placeholder="Breve riassunto in italiano..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Titolo</label>
                <input
                  type="text"
                  value={seoTitleIt}
                  onChange={(e) => setSeoTitleIt(e.target.value)}
                  placeholder={titleIt || 'Titolo SEO personalizzato...'}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Meta Descrizione</label>
                <textarea
                  rows={2}
                  value={seoDescriptionIt}
                  onChange={(e) => setSeoDescriptionIt(e.target.value)}
                  placeholder={shortSummaryIt || 'Descrizione SEO personalizzata...'}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* ========== COMMON FIELDS ========== */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Common Settings</h2>

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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Drag and drop your hero image here, or paste image URL below
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>

                <div className="mt-4 max-w-lg mx-auto">
                  <input
                    type="url"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
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
          </div>
        </div>

        {/* ========== SIDEBAR ========== */}
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
                Estimated Read Time
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
                <strong>Note:</strong> Read time is manually specified by the admin.
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
              Cancel & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};