'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  Layers,
  Activity,
  CheckCircle2,
  XCircle,
  Database,
  Users,
  GraduationCap,
  Sparkles,
  Share2,
  Loader2,
  Compass,
  Ship,
  HelpCircle,
  Award,
  ChevronRight,
  Clock,
  Building2,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Document } from '@/types';
import { GeneratedContentItem } from '@/types/media';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [mediaItems, setMediaItems] = useState<GeneratedContentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthors, setNewAuthors] = useState('Dr. Scientist (NCPOR)');
  const [newStation, setNewStation] = useState('BHARATI');
  const [newYear, setNewYear] = useState(2024);
  const [newKeywords, setNewKeywords] = useState('Antarctica, Fast Ice, Telemetry');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const s = await apiClient.getAdminStats();
      setStats(s);
      const docs = await apiClient.getDocuments();
      setDocuments(docs);
      const media = await apiClient.getGeneratedMedia();
      setMediaItems(media);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetConfirm = async () => {
    setIsResetting(true);
    try {
      const res = await apiClient.resetDemoData();
      setResetMessage(res.message || 'Database successfully reset to initial seed state.');
      await loadAdminData();
      setTimeout(() => {
        setShowResetModal(false);
        setResetMessage(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setResetMessage('Failed to reset repository state.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setIsUploading(true);
    try {
      await apiClient.uploadDocument({
        title: newTitle,
        abstract: newAbstract || newContent.slice(0, 150),
        content: newContent,
        authors: newAuthors.split(',').map((a) => a.trim()),
        stationCode: newStation,
        year: Number(newYear),
        docType: 'peer_reviewed_paper',
        keywords: newKeywords.split(',').map((k) => k.trim()),
      });

      setShowUploadModal(false);
      setNewTitle('');
      setNewAbstract('');
      setNewContent('');
      await loadAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>MODULE 7 • ADMIN GOVERNANCE & CONTENT MANAGEMENT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Repository Governance & Telemetry</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Document ingestion pipeline, semantic chunk indexing, lesson oversight, and real database metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-amber-300 font-semibold text-xs shadow-md transition-all hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seed Data</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest New Research Document</span>
          </button>
        </div>
      </div>

      {/* Admin Module Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/documents"
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <FileText className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
          </div>
          <h4 className="font-bold text-sm text-white">/admin/documents</h4>
          <p className="text-[11px] text-slate-400 font-mono">
            Upload, chunk, and index peer-reviewed papers for Grounded RAG.
          </p>
        </Link>

        <Link
          href="/admin/media"
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <Share2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h4 className="font-bold text-sm text-white">/admin/media</h4>
          <p className="text-[11px] text-slate-400 font-mono">
            Review and moderate AI-synthesized public outreach packages.
          </p>
        </Link>

        <Link
          href="/admin/lessons"
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <GraduationCap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </div>
          <h4 className="font-bold text-sm text-white">/admin/lessons</h4>
          <p className="text-[11px] text-slate-400 font-mono">
            Inspect blackboard vector actions, teacher scripts, and quizzes.
          </p>
        </Link>

        <Link
          href="/admin/reviews"
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <ShieldCheck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
          </div>
          <h4 className="font-bold text-sm text-white">/admin/reviews</h4>
          <p className="text-[11px] text-slate-400 font-mono">
            Zero-hallucination audit logs, verification scores, and Q&A logs.
          </p>
        </Link>
      </div>

      {/* 8 Core Database Telemetry Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Total Documents</span>
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalDocuments}</div>
            <div className="text-[10px] text-emerald-400 font-mono">100% Peer-Reviewed</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Indexed Chunks</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalChunks}</div>
            <div className="text-[10px] text-cyan-400 font-mono">Dual-Indexed for RAG</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Research Stations</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalStations || 5}</div>
            <div className="text-[10px] text-indigo-300 font-mono">Antarctic & Arctic</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Expeditions</span>
              <Ship className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalExpeditions || 2}</div>
            <div className="text-[10px] text-amber-300 font-mono">ISEA & IndARC Cycles</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Curriculum Lessons</span>
              <GraduationCap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalLessons || 1}</div>
            <div className="text-[10px] text-purple-300 font-mono">Vector Directives</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Teaching Sessions</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalTeachingSessions}</div>
            <div className="text-[10px] text-cyan-300 font-mono">State Persisted in DB</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Generated Media</span>
              <Share2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalGeneratedMedia}</div>
            <div className="text-[10px] text-emerald-300 font-mono">Outreach Packages</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Q&A Questions Handled</span>
              <HelpCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalQuestionsAnswered || 3}</div>
            <div className="text-[10px] text-rose-300 font-mono">Grounded RAG Answers</div>
          </div>
        </div>
      )}

      {/* Document Ingestion & Moderation Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Ingested Research Documents ({documents.length})</span>
          </h3>
          <Link
            href="/admin/documents"
            className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Full Document Manager</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Title & Authors</th>
                <th className="p-3">Station</th>
                <th className="p-3">Year</th>
                <th className="p-3">RAG Chunks</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 max-w-md">
                    <div className="font-semibold text-slate-100">{doc.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {doc.authors.join(', ')}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-cyan-300">{doc.stationCode || 'NCPOR'}</td>
                  <td className="p-3 font-mono text-slate-400">{doc.year}</td>
                  <td className="p-3 font-mono text-slate-300">{doc.chunks?.length || 0}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      {doc.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingestion Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-glow w-full max-w-2xl rounded-3xl p-6 border border-purple-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Ingest New Polar Science Document</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Document text will be automatically parsed into semantic chunks and indexed into the vector store.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Document Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hydrographic Observations of Kongsfjorden During Winter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Station:</label>
                  <select
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-purple-400 font-mono"
                  >
                    <option value="BHARATI">Bharati (Antarctica)</option>
                    <option value="MAITRI">Maitri (Antarctica)</option>
                    <option value="HIMADRI">Himadri (Arctic)</option>
                    <option value="INDARC">IndARC Mooring (Arctic)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Publication Year:</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Authors (comma separated):</label>
                <input
                  type="text"
                  value={newAuthors}
                  onChange={(e) => setNewAuthors(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Full Text / Sections (for chunking):</label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste paper text, methodology, sections (e.g. 1. INTRODUCTION ... 2. OBSERVATIONS ...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400 resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
                >
                  {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUploading ? 'Chunking & Ingesting...' : 'Upload & Index Chunks'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-glow w-full max-w-md rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Database to Seed State?</h3>
                <p className="text-xs text-slate-400">Restore default seeded polar research data.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              This will restore the 4 research stations (Bharati, Maitri, Himadri, IndARC), seed research papers, and the structured lesson curriculum. Active sessions will be cleanly reset.
            </p>

            {resetMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{resetMessage}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleResetConfirm}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                {isResetting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isResetting ? 'Resetting...' : 'Confirm & Restore Seed State'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
