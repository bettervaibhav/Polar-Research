'use client';

import React from 'react';
import { SourceCitation } from '@/types';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface CitationViewerProps {
  citations: SourceCitation[];
}

export function CitationViewer({ citations }: CitationViewerProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Grounded Evidence Citations ({citations.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {citations.map((c, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/30 transition-colors text-xs"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-cyan-300 line-clamp-1">{c.title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
                Match: {Math.round((c.relevanceScore || 0.85) * 100)}%
              </span>
            </div>

            <p className="text-slate-400 text-[11px] italic line-clamp-2 mb-1.5">
              "{c.snippet}"
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-1.5">
              <span>Pg {c.page} • {c.section}</span>
              {c.doi && <span>DOI: {c.doi}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
