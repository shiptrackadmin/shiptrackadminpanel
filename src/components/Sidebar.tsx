import React from 'react';
import { Page } from '../types';
import { LayoutDashboard, FileText, Tag, Settings, LogOut, Package } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navItems = [
    {
      id: 'dashboard' as Page,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'blog' as Page,
      label: 'Blog Posts',
      icon: FileText,
      badge: 'Manage',
    },
    {
      id: 'categories' as Page,
      label: 'Categories',
      icon: Tag,
      badge: null,
    },
    {
      id: 'seo' as Page,
      label: 'SEO Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-md">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight leading-none">
                  ShipTrack
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">Content Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Navigation Menu
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (item.id === 'blog' && (currentPage === 'blog-create' || currentPage === 'blog-edit'));

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#1e3a8a] text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold bg-blue-900/60 text-blue-200 border border-blue-700/50 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900/80 rounded-xl p-3 mb-3 border border-slate-800/80">
            <p className="text-xs font-medium text-slate-300">Signed in as:</p>
            <p className="text-xs text-blue-400 font-mono truncate font-semibold">
              admin@shiptrack.com
            </p>
          </div>

          <button
            onClick={() => {
              onLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-sm text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
