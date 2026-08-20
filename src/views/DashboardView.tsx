import React from 'react';
import { BlogPost, Category, ActivityLog, Page } from '../types';
import { PublishingChart } from '../components/PublishingChart';
import { FileText, CheckCircle2, FileClock, Tag, Clock, ArrowRight, PlusCircle } from 'lucide-react';

interface DashboardViewProps {
  posts: BlogPost[];
  categories: Category[];
  activityLogs: ActivityLog[];
  onNavigate: (page: Page) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  posts,
  categories,
  activityLogs,
  onNavigate,
}) => {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === 'Published').length;
  const draftPosts = posts.filter((p) => p.status === 'Draft').length;
  const totalCategories = categories.length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, Admin!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Here is an overview of your parcel tracking content repository, active drafts, and recent publishing activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('blog-create')}
            className="px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#2563eb] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
        </div>
      </div>

      {/* Stats Cards (4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Blog Posts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Blog Posts
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{totalPosts}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Articles in CMS</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Published Posts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Published Posts
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">{publishedPosts}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Live on site</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Draft Posts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Draft Posts
            </p>
            <h3 className="text-2xl font-bold text-amber-600 mt-2">{draftPosts}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Scheduled for review</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileClock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Categories */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Categories
            </p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-2">{totalCategories}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Organized topics</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Middle Section: Chart / Visual */}
      <PublishingChart />

      {/* Bottom Section: Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" />
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
          </div>
          <span className="text-xs font-medium text-slate-500">Audit Logs</span>
        </div>

        <div className="divide-y divide-slate-100">
          {activityLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <p className="text-sm font-medium text-slate-800">{log.message}</p>
              </div>
              <span className="text-xs font-mono text-slate-500 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>System activity logged automatically.</span>
          <button
            onClick={() => onNavigate('blog')}
            className="text-[#2563eb] hover:text-[#1e3a8a] font-semibold flex items-center gap-1"
          >
            Go to Blog Management <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
