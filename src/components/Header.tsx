import React from 'react';
import { Page } from '../types';
import { Package, Menu, X, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  isLoggedIn,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const pageTitles: Record<Page, string> = {
    login: 'Admin Sign In',
    dashboard: 'Dashboard Overview',
    blog: 'Blog Management',
    'blog-create': 'Create New Blog Post',
    'blog-edit': 'Edit Blog Post',
    categories: 'Categories Management',
    seo: 'SEO & Indexing Configurations',
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Branding & Page Title */}
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1e3a8a] flex items-center justify-center text-white shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base">ShipTrack</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs bg-slate-100 text-[#1e3a8a] border border-slate-200">
                  CMS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {pageTitles[currentPage] || 'Admin Panel'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Screen Switcher (for easy previewing as requested in prompt) */}
        <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="px-2 text-slate-400 font-medium text-[11px] uppercase tracking-wider">
            Screen View:
          </span>
          <button
            onClick={() => onNavigate('login')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              currentPage === 'login'
                ? 'bg-white text-[#1e3a8a] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Login
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              currentPage === 'dashboard'
                ? 'bg-white text-[#1e3a8a] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Dashboard
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              currentPage === 'blog' || currentPage === 'blog-edit'
                ? 'bg-white text-[#1e3a8a] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Blog List
          </button>
          <button
            onClick={() => onNavigate('blog-create')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              currentPage === 'blog-create'
                ? 'bg-white text-[#1e3a8a] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Create Post
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              currentPage === 'categories'
                ? 'bg-white text-[#1e3a8a] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5. Categories
          </button>
          <button
            onClick={() => onNavigate('seo')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              currentPage === 'seo'
                ? 'bg-white text-[#1e3a8a] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            6. SEO Settings
          </button>
        </div>

        {/* Right: Admin User Label (NO avatar, NO profile picture, NO dropdown, NO edit options) */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
            <div className="text-right">
              <span className="font-semibold text-slate-800">Admin</span>
              <span className="text-slate-500 text-xs hidden md:inline ml-1">
                (admin@shiptrack.com)
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-medium">
            Secured Session
          </div>
        )}
      </div>
    </header>
  );
};
