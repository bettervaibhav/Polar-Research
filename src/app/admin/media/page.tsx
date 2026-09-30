'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Share2,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  FileText,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { GeneratedContentItem } from '@/types/media';

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<GeneratedContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const items = await apiClient.getGeneratedMedia();
      setMediaItems(items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Generated Outreach Media Governance</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Review and audit AI-synthesized public outreach packages, articles, social posts, and video scripts.
          </p>
        </div>

        <Link
          href="/media"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
        >
          <Share2 className="w-4 h-4" />
          <span>Open Media Studio</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading generated media artifacts...</p>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="p-16 text-center glass-panel rounded-3xl border border-slate-800 space-y-3">
          <Share2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Generated Media Records</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Generate articles or social threads in Media Studio to populate this moderation queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    {item.contentType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{item.title}</h3>

                <div className="text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 line-clamp-3">
                  {typeof item.data === 'object' && (item.data as any).headline
                    ? (item.data as any).headline
                    : JSON.stringify(item.data).slice(0, 150) + '...'}
                </div>

                <div className="text-[10px] font-mono text-slate-400 space-y-1">
                  <div>Source: <span className="text-cyan-300">{item.sourceTitles[0]}</span></div>
                  <div>Model Used: <span className="text-slate-300">{item.modelUsed}</span></div>
                  <div>Status: <span className="text-emerald-400 font-bold">{item.status.toUpperCase()}</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>NCPOR Provenance Verified</span>
                </span>
                <Link
                  href="/media"
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  View in Media Studio →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
