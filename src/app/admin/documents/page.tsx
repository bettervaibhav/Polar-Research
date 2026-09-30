'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  Layers,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Search,
  Plus,
  FileUp,
  X,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Document } from '@/types';
import { getStationBadgeColor } from '@/lib/utils';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'pdf' | 'text'>('pdf');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // PDF File Form
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common Metadata Form State
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('');
  const [authors, setAuthors] = useState('Dr. Scientist (NCPOR)');
  const [stationCode, setStationCode] = useState('BHARATI');
  const [year, setYear] = useState(2024);
  const [doi, setDoi] = useState('');
  const [keywords, setKeywords] = useState('Antarctica, Fast Ice, Telemetry');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await apiClient.getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      setUploadFeedback('Please select a valid .pdf file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);
      if (title) formData.append('title', title);
      if (stationCode) formData.append('stationCode', stationCode);
      if (authors) formData.append('authors', authors);
      if (year) formData.append('year', String(year));
      if (doi) formData.append('doi', doi);
      if (keywords) formData.append('keywords', keywords);

      const res = await fetch('/api/documents/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to ingest PDF');
      }

      setUploadFeedback(`Successfully extracted ${data.extraction?.totalPages || 1} pages and indexed ${data.extraction?.chunksIndexed || 0} chunks!`);
      setTimeout(() => {
        setShowUploadModal(false);
        setPdfFile(null);
        setTitle('');
        setUploadFeedback(null);
      }, 1500);

      await loadDocuments();
    } catch (err: any) {
      console.error(err);
      setUploadFeedback(err.message || 'Failed to parse and index PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsUploading(true);
    setUploadFeedback(null);

    try {
      await apiClient.uploadDocument({
        title,
        abstract: abstract || content.slice(0, 200),
        content,
        authors: authors.split(',').map((a) => a.trim()),
        stationCode,
        year: Number(year),
        doi: doi || undefined,
        docType: 'peer_reviewed_paper',
        keywords: keywords.split(',').map((k) => k.trim()),
      });

      setUploadFeedback('Document successfully parsed into semantic chunks and indexed!');
      setTimeout(() => {
        setShowUploadModal(false);
        setTitle('');
        setAbstract('');
        setContent('');
        setUploadFeedback(null);
      }, 1200);

      await loadDocuments();
    } catch (err: any) {
      console.error(err);
      setUploadFeedback(err.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.stationCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <h1 className="text-3xl font-extrabold text-white">Research Document Management</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Ingest real binary PDF research papers or raw text sections into the grounded dual-indexed RAG vector store.
          </p>
        </div>

        <button
          onClick={() => {
            setShowUploadModal(true);
            setUploadFeedback(null);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload / Ingest Document</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, keyword, or station code (e.g. Prydz Bay, Maitri, IndARC)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-purple-400"
          />
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          Total: {filteredDocs.length} Papers
        </span>
      </div>

      {/* Documents Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading ingested document registry...</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Document Title & Authors</th>
                <th className="p-4">Station</th>
                <th className="p-4">Year</th>
                <th className="p-4">Indexed Chunks</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 max-w-md">
                    <div className="font-semibold text-slate-100">{doc.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {doc.authors.join(', ')}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${getStationBadgeColor(doc.stationCode)}`}>
                      {doc.stationCode || 'POLAR'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{doc.year}</td>
                  <td className="p-4 font-mono text-cyan-300">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                      {doc.chunks?.length || 0} Chunks
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      {doc.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/repository/${doc.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold border border-slate-700 inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ingestion Modal with Dual Mode (PDF Upload vs Manual Text) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-glow w-full max-w-2xl rounded-3xl p-6 border border-purple-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Ingest Research Document into RAG</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Binary PDFs will be extracted, chunked, and dual-indexed with page/section tracking.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setUploadMode('pdf')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  uploadMode === 'pdf'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Upload Binary PDF (.pdf)</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  uploadMode === 'text'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Manual Text & Sections</span>
              </button>
            </div>

            {/* Feedback alert */}
            {uploadFeedback && (
              <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-xs font-mono text-purple-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0" />
                <span>{uploadFeedback}</span>
              </div>
            )}

            {/* PDF Mode Form */}
            {uploadMode === 'pdf' ? (
              <form onSubmit={handlePdfUploadSubmit} className="space-y-4">
                {/* File picker */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-slate-700 hover:border-purple-400 rounded-2xl bg-slate-900/60 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                >
                  <FileUp className="w-8 h-8 text-purple-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200">
                      {pdfFile ? pdfFile.name : 'Click to select or drop research PDF file'}
                    </span>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Accepts scientific papers, expedition reports, datasets up to 25MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPdfFile(e.target.files[0]);
                        if (!title) {
                          setTitle(e.target.files[0].name.replace(/\.pdf$/i, ''));
                        }
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Station Association:</label>
                    <select
                      value={stationCode}
                      onChange={(e) => setStationCode(e.target.value)}
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
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Document Title Override (Optional):</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Leave blank to auto-detect title from PDF header"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Authors (Optional):</label>
                    <input
                      type="text"
                      value={authors}
                      onChange={(e) => setAuthors(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">DOI (Optional):</label>
                    <input
                      type="text"
                      value={doi}
                      onChange={(e) => setDoi(e.target.value)}
                      placeholder="10.1016/j.polar..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !pdfFile}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                    <span>{isUploading ? 'Extracting & Indexing PDF...' : 'Ingest Binary PDF'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Manual Text Mode */
              <form onSubmit={handleManualTextSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Document Title:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Thermodynamic Flux Measurements over Prydz Bay Fast Ice"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Station:</label>
                    <select
                      value={stationCode}
                      onChange={(e) => setStationCode(e.target.value)}
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
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Authors (comma separated):</label>
                  <input
                    type="text"
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Full Text / Sections (for chunking):</label>
                  <textarea
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste research sections (e.g. 1. INTRODUCTION ... 2. OBSERVATIONS ...)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-400 resize-none font-sans"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
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
                    <span>{isUploading ? 'Chunking & Indexing...' : 'Upload & Index Chunks'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
