import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface MonthData {
  month: string;
  published: number;
  draft: number;
}

const DATA: MonthData[] = [
  { month: 'Mar', published: 2, draft: 1 },
  { month: 'Apr', published: 3, draft: 1 },
  { month: 'May', published: 4, draft: 2 },
  { month: 'Jun', published: 5, draft: 1 },
  { month: 'Jul', published: 7, draft: 2 },
  { month: 'Aug', published: 8, draft: 3 },
];

export const PublishingChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxY = 8;
  const height = 220;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Blog Publishing & Reader Growth
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Content creation velocity and scheduled draft volume across Q1-Q3 2026
          </p>
        </div>

        {/* Note requirement: "Reader analytics excluded" */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Reader analytics excluded</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-[#2563eb]" />
          <span>Published Articles</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-slate-400" />
          <span>Draft Articles</span>
        </div>
      </div>

      {/* SVG Custom Bar & Area Chart */}
      <div className="relative pt-2">
        <div className="flex items-end h-[220px] gap-3 sm:gap-6 border-b border-slate-200 pb-2 pl-8 pr-2">
          {/* Y-Axis Scale Labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-mono text-slate-400">
            <span>8</span>
            <span>6</span>
            <span>4</span>
            <span>2</span>
            <span>0</span>
          </div>

          {/* Background Grid Lines */}
          <div className="absolute left-8 right-2 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-200 w-full" />
          </div>

          {/* Bars Grid */}
          <div className="w-full h-full flex items-end justify-between gap-2 sm:gap-4 z-10">
            {DATA.map((item, idx) => {
              const pubHeightPct = (item.published / maxY) * 100;
              const draftHeightPct = (item.draft / maxY) * 100;

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  {/* Tooltip */}
                  {hoveredIdx === idx && (
                    <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap border border-slate-700 animate-fade-in pointer-events-none">
                      <span className="font-bold text-blue-300">{item.month} 2026:</span>{' '}
                      {item.published} Published, {item.draft} Drafts
                    </div>
                  )}

                  {/* Dual Bars */}
                  <div className="flex items-end gap-1 sm:gap-1.5 w-full justify-center max-w-[50px]">
                    {/* Published Bar */}
                    <div
                      className="w-1/2 bg-[#2563eb] hover:bg-[#1e3a8a] rounded-t-xs transition-all duration-300 shadow-2xs"
                      style={{ height: `${pubHeightPct}%` }}
                    />
                    {/* Draft Bar */}
                    <div
                      className="w-1/2 bg-slate-300 hover:bg-slate-400 rounded-t-xs transition-all duration-300 shadow-2xs"
                      style={{ height: `${draftHeightPct}%` }}
                    />
                  </div>

                  {/* X-Axis Month Label */}
                  <span className="text-xs font-semibold text-slate-600 mt-3 group-hover:text-[#1e3a8a] transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
