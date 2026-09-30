'use client';

import React from 'react';
import { Document } from '@/types';
import {
  FileText,
  ExternalLink,
  BookOpen,
  Sparkles,
  GraduationCap,
  X,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import { getStationBadgeColor } from '@/lib/utils';
import Link from 'next/link';

interface DocumentDetailModalProps {
  document: Document | null;
  onClose: () => void;
  onTeachMe: (topic: string, docId: string) => void;
  onAskAI: (docTitle: string) => void;
}

export function DocumentDetailModal({
  document,
  onClose,
  onTeachMe,
  onAskAI,
}: DocumentDetailModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-3xl rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${getStationBadgeColor(document.stationCode)}`}>
                {document.stationCode || 'POLAR RESEARCH'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {document.docType.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {document.year}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{document.title}</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Authors: {document.authors.join(', ')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abstract */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1.5">Abstract</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{document.abstract}</p>
          </div>

          {/* Extracted Semantic Chunks for RAG */}
          {document.chunks && document.chunks.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Indexed Semantic Chunks for Grounded RAG ({document.chunks.length})</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {document.chunks.map((chunk, i) => (
                  <div
                    key={chunk.id || i}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                      <span>{chunk.sectionTitle}</span>
                      <span className="text-[10px] font-mono text-slate-500">Page {chunk.pageNumber}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {chunk.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {document.doi && (
                <span className="text-[11px] font-mono text-slate-400">
                  DOI: <span className="text-cyan-400">{document.doi}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAskAI(document.title)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-cyan-500/20"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Ask Polar AI</span>
              </button>

              <button
                onClick={() => onTeachMe(document.title, document.id)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Teach Me This in Teaching Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
