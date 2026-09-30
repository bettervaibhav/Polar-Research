'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Layers,
  MapPin,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Document } from '@/types';
import { DocumentDetailModal } from '@/components/knowledge/document-detail-modal';
import { getStationBadgeColor } from '@/lib/utils';

export default function RepositoryPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);

  useEffect(() => {
    loadDocs();
  }, [searchQuery, selectedStation, selectedType]);

  const loadDocs = async () => {
    setIsLoading(true);
    try {
      const docs = await apiClient.getDocuments(searchQuery, selectedType, selectedStation);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeachMe = async (topic: string, docId: string) => {
    try {
      const lesson = await apiClient.generateLesson({
        topic,
        learnerLevel: 'undergraduate',
        targetDurationMin: 10,
        sourceDocumentIds: [docId],
      });
      const session = await apiClient.createTeachingSession(lesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error('Failed to start lesson:', err);
    }
  };

  const handleAskAI = (docTitle: string) => {
    router.push(`/?q=${encodeURIComponent(docTitle)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>MODULE 1 • POLAR KNOWLEDGE HUB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Scientific Research & Expedition Repository</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Peer-reviewed papers, expedition reports, and datasets from Indian polar research stations.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, author (e.g. Albedo, Prydz Bay, IndARC, Limnology)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-400"
            />
          </div>

          {/* Station Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Station:</span>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-cyan-400 font-mono"
            >
              <option value="all">All Stations</option>
              <option value="BHARATI">Bharati (Antarctica)</option>
              <option value="MAITRI">Maitri (Antarctica)</option>
              <option value="HIMADRI">Himadri (Arctic)</option>
              <option value="INDARC">IndARC Mooring (Arctic)</option>
            </select>
          </div>

          {/* Doc Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-cyan-400 font-mono"
            >
              <option value="all">All Document Types</option>
              <option value="peer_reviewed_paper">Peer-Reviewed Paper</option>
              <option value="expedition_report">Expedition Report</option>
              <option value="scientific_dataset">Scientific Dataset</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading verified polar research documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-16 text-center glass-panel rounded-2xl border border-slate-800 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No research documents available</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Upload or ingest research material in the Admin Governance portal to begin building your polar knowledge repository.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 glass-card-hover flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${getStationBadgeColor(doc.stationCode)}`}>
                    {doc.stationCode || 'POLAR RESEARCH'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{doc.year}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-white hover:text-cyan-300 transition-colors cursor-pointer" onClick={() => setActiveDoc(doc)}>
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {doc.abstract}
                </p>

                {/* Keywords & Chunks Count */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {doc.keywords.slice(0, 4).map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      #{kw}
                    </span>
                  ))}
                  {doc.chunks && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 ml-auto flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {doc.chunks.length} RAG Chunks
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveDoc(doc)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700"
                >
                  View Details & Chunks
                </button>

                <button
                  onClick={() => handleTeachMe(doc.title, doc.id)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-cyan-500/40 shadow-sm"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Teach Me This</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Details Modal */}
      <DocumentDetailModal
        document={activeDoc}
        onClose={() => setActiveDoc(null)}
        onTeachMe={handleTeachMe}
        onAskAI={handleAskAI}
      />
    </div>
  );
}
