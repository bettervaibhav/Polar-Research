'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  GraduationCap,
  ExternalLink,
  Loader2,
  FileText,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Document } from '@/types';
import { getStationBadgeColor } from '@/lib/utils';
import { CitationViewer } from '@/components/knowledge/citation-viewer';

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [doc, setDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDoc();
  }, [id]);

  const loadDoc = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDoc(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeachMe = async () => {
    if (!doc) return;
    try {
      const lesson = await apiClient.generateLesson({
        topic: doc.title,
        learnerLevel: 'undergraduate',
        targetDurationMin: 10,
        sourceDocumentIds: [doc.id],
      });
      const session = await apiClient.createTeachingSession(lesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading document details & chunks...</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Document Not Found</h2>
        <p className="text-xs text-slate-400">The requested research document could not be located in the repository.</p>
        <Link href="/repository" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-cyan-300 text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Hub</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <Link
        href="/repository"
        className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Knowledge Hub</span>
      </Link>

      {/* Header Info */}
      <div className="glass-panel-glow p-8 rounded-3xl border border-cyan-500/30 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${getStationBadgeColor(doc.stationCode)}`}>
              {doc.stationCode || 'POLAR RESEARCH'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {doc.docType.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {doc.year}
            </span>
            {doc.isDemo && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                DEMO DOCUMENT
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">{doc.title}</h1>
          <p className="text-xs text-slate-400 font-mono">
            Authors: {doc.authors.join(', ')}
          </p>
          {doc.doi && (
            <p className="text-[11px] font-mono text-cyan-400">
              DOI: {doc.doi}
            </p>
          )}
        </div>

        {/* Abstract */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">Abstract</h3>
          <p className="text-xs text-slate-200 leading-relaxed">{doc.abstract}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap gap-1.5">
            {doc.keywords.map((kw, i) => (
              <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
                #{kw}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/?q=${encodeURIComponent(doc.title)}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-semibold text-xs border border-cyan-500/30"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ask Polar AI</span>
            </Link>

            <button
              onClick={handleTeachMe}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Teach Me This in Teaching Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Semantic Chunks Breakdown */}
      {doc.chunks && doc.chunks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Extracted Semantic Chunks for Grounded RAG ({doc.chunks.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doc.chunks.map((chunk, i) => (
              <div
                key={chunk.id || i}
                className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <span>{chunk.sectionTitle}</span>
                  <span className="text-[10px] font-mono text-slate-500">Page {chunk.pageNumber}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-4">
                  {chunk.content}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                  <span>Tokens: {chunk.tokenCount}</span>
                  <span>Keywords: {chunk.keywords.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
