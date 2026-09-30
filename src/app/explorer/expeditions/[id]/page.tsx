'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Ship,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  MapPin,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Expedition, ResearchStation, Document, MediaAsset } from '@/types';
import { getStationBadgeColor } from '@/lib/utils';

export default function ExpeditionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [data, setData] = useState<{
    expedition: Expedition;
    station: ResearchStation | null;
    relatedDocuments: Document[];
    relatedMedia: MediaAsset[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExpeditionDetails();
  }, [id]);

  const loadExpeditionDetails = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getExpeditionDetail(id);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeachExpedition = async () => {
    if (!data?.expedition) return;
    try {
      const lesson = await apiClient.generateLesson({
        topic: `${data.expedition.title} — Key Scientific Discoveries & Objectives`,
        learnerLevel: 'undergraduate',
        targetDurationMin: 10,
        sourceDocumentIds: data.relatedDocuments.map((d) => d.id),
      });
      const session = await apiClient.createTeachingSession(lesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading expedition archives & voyage logs...</p>
      </div>
    );
  }

  if (!data || !data.expedition) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Expedition Not Found</h2>
        <p className="text-xs text-slate-400">The requested polar scientific expedition could not be located.</p>
        <Link href="/explorer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-cyan-300 text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Polar Explorer</span>
        </Link>
      </div>
    );
  }

  const { expedition, station, relatedDocuments } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Back Nav */}
      <Link
        href="/explorer"
        className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Polar Explorer</span>
      </Link>

      {/* Main Expedition Dossier Card */}
      <div className="glass-panel-glow p-8 rounded-3xl border border-blue-500/30 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              EXPEDITION YEAR {expedition.year}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {expedition.season}
            </span>
            {station && (
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${getStationBadgeColor(station.code)}`}>
                BASE: {station.name}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{expedition.title}</h1>
          <p className="text-xs font-mono text-cyan-300">
            Leader: <strong className="text-white">{expedition.leader}</strong> • Organization: {expedition.organization}
          </p>
        </div>

        {/* Narrative Summary */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Expedition Summary & Log
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">{expedition.summary}</p>
        </div>

        {/* Key Scientific Objectives */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Key Mission Objectives
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {expedition.objectives.map((obj, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <span className="text-[11px] font-mono text-slate-400">
            Verified Indian Scientific Expedition Archives
          </span>

          <button
            onClick={handleTeachExpedition}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teach This Expedition in Teaching Room</span>
          </button>
        </div>
      </div>

      {/* Linked Expedition Papers */}
      {relatedDocuments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Research Publications from this Expedition ({relatedDocuments.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                      {doc.docType.replace('_', ' ').toUpperCase()}
                    </span>
                    <span>{doc.year}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{doc.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{doc.abstract}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <Link
                    href={`/repository/${doc.id}`}
                    className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
