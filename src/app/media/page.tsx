'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Sparkles,
  FileText,
  Twitter,
  Video,
  PieChart,
  Shield,
  Layers,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Users,
  RotateCcw,
  Download,
  BookOpen,
  Clock,
  Send,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Document } from '@/types';
import { GeneratedContentItem, ContentType } from '@/types/media';

const TARGET_AUDIENCES = [
  { id: 'school_students', label: 'School Students (K-12)', desc: 'Simplified analogies, engaging tone & fun facts' },
  { id: 'general_public', label: 'General Public', desc: 'Accessible science journalism without heavy jargon' },
  { id: 'policy_makers', label: 'Policy Makers & Govt Officials', desc: 'Actionable executive insights & climate impacts' },
  { id: 'science_journalists', label: 'Science Journalists & Media', desc: 'Press-ready hooks, empirical quotes & stats' },
  { id: 'undergrad_researchers', label: 'Undergraduate Researchers', desc: 'Rigorous methodology & thermodynamic equations' },
];

export default function MediaStudioPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [selectedAudience, setSelectedAudience] = useState<string>('general_public');
  const [selectedFormats, setSelectedFormats] = useState<ContentType[]>([
    'web_article',
    'social_thread',
    'video_script',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<GeneratedContentItem[]>([]);
  const [activeTab, setActiveTab] = useState<ContentType>('web_article');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const docs = await apiClient.getDocuments();
      setDocuments(docs);
      if (docs.length > 0) setSelectedDocId(docs[0].id);

      const existingMedia = await apiClient.getGeneratedMedia();
      if (existingMedia.length > 0) {
        setGeneratedItems(existingMedia);
        setActiveTab(existingMedia[0].contentType);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFormat = (fmt: ContentType) => {
    if (selectedFormats.includes(fmt)) {
      if (selectedFormats.length > 1) {
        setSelectedFormats(selectedFormats.filter((f) => f !== fmt));
      }
    } else {
      setSelectedFormats([...selectedFormats, fmt]);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const matchedDoc = documents.find((d) => d.id === selectedDocId);
    if (!matchedDoc) return;

    setIsGenerating(true);
    try {
      const items = await apiClient.generateMedia({
        topic: matchedDoc.title,
        documentIds: [matchedDoc.id],
        targetFormats: selectedFormats,
        targetAudience: selectedAudience,
      });
      setGeneratedItems(items);
      setActiveTab(items[0].contentType);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveExport = () => {
    const active = generatedItems.find((item) => item.contentType === activeTab);
    if (!active) return;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(active, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `polar_sense_${active.contentType}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const activeItem = generatedItems.find((item) => item.contentType === activeTab);
  const matchedSelectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold mb-1">
            <Share2 className="w-4 h-4" />
            <span>MODULE 6 • OUTREACH MEDIA STUDIO & DISSEMINATION</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Scientific Media & Outreach Studio</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Ground scientific publications into public articles, social threads, infographics, classroom explanations, and video scripts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media Generator Configuration (4 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Outreach Synthesis Parameters
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Grounded AI
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Select Approved Document */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">1. Select Source Research Document:</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-emerald-400 font-sans"
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    [{doc.stationCode || 'NCPOR'}] {doc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="text-xs font-mono text-slate-400">2. Target Audience:</label>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-emerald-400 font-sans"
              >
                {TARGET_AUDIENCES.map((aud) => (
                  <option key={aud.id} value={aud.id}>
                    {aud.label} — {aud.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Media Formats Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-mono text-slate-400">3. Select Target Content Formats:</label>
              <div className="space-y-2">
                {[
                  { id: 'web_article' as ContentType, label: 'Educational / Public Web Article', desc: 'Accessible science journalism narrative' },
                  { id: 'social_thread' as ContentType, label: 'Social Media Thread (Twitter/X/LinkedIn)', desc: 'Multi-post hook, empirical statistics & tags' },
                  { id: 'video_script' as ContentType, label: '60s Short Video / Reel Script', desc: 'Visual storyboard cues & timed voiceover' },
                  { id: 'executive_brief' as ContentType, label: 'Executive Policy Brief & Summary', desc: 'Strategic climate risk for policymakers' },
                  { id: 'infographic_spec' as ContentType, label: 'Infographic Content Spec', desc: 'Key quantitative metrics and graphic themes' },
                ].map((fmt) => (
                  <label
                    key={fmt.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedFormats.includes(fmt.id)
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200 shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(fmt.id)}
                      onChange={() => toggleFormat(fmt.id)}
                      className="mt-0.5 accent-emerald-400"
                    />
                    <div>
                      <div className="text-xs font-semibold">{fmt.label}</div>
                      <div className="text-[10px] font-mono text-slate-400">{fmt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating || !selectedDocId}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Outreach Package...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Outreach Media Package</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Media Preview Tabs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {generatedItems.length > 0 ? (
            <div className="glass-panel-glow p-6 rounded-3xl border border-emerald-500/30 space-y-6 animate-fadeIn">
              {/* Format Switcher Tabs & Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {generatedItems.map((item) => (
                    <button
                      key={item.contentType}
                      onClick={() => setActiveTab(item.contentType)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                        activeTab === item.contentType
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                      }`}
                    >
                      {item.contentType.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 flex items-center gap-1.5"
                    title="Regenerate this output"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Regenerate</span>
                  </button>

                  <button
                    onClick={handleSaveExport}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 flex items-center gap-1.5"
                    title="Save / Export JSON"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">{saveSuccess ? 'Saved!' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Active Tab Body */}
              {activeItem && (
                <div className="space-y-6">
                  {/* Provenance Metadata Capsule */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <Shield className="w-4 h-4" />
                        <span>Provenance: {activeItem.sourceTitles[0]}</span>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Audience: {selectedAudience.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        Generated: {new Date(activeItem.createdAt).toLocaleString()}
                      </span>
                      <span>Model: {activeItem.modelUsed}</span>
                    </div>
                  </div>

                  {/* Web Article Renderer */}
                  {activeItem.contentType === 'web_article' && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-extrabold text-white leading-snug">
                            {(activeItem.data as any).headline}
                          </h2>
                          <p className="text-xs text-slate-300 mt-1 italic">
                            {(activeItem.data as any).subheadline}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy((activeItem.data as any).body, 'article')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 flex-shrink-0"
                        >
                          {copiedId === 'article' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === 'article' ? 'Copied' : 'Copy Body'}</span>
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                        {(activeItem.data as any).body}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                          Key Empirical Takeaways
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {(activeItem.data as any).keyTakeaways?.map((kt: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-mono">•</span>
                              <span>{kt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Social Thread Renderer */}
                  {activeItem.contentType === 'social_thread' && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200">
                        <strong>Thread Hook: </strong> {(activeItem.data as any).hook}
                      </div>

                      <div className="space-y-3">
                        {(activeItem.data as any).posts?.map((post: string, i: number) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start justify-between gap-4"
                          >
                            <p className="leading-relaxed">{post}</p>
                            <button
                              onClick={() => handleCopy(post, `post-${i}`)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex-shrink-0"
                              title="Copy Post"
                            >
                              {copiedId === `post-${i}` ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Script Renderer */}
                  {activeItem.contentType === 'video_script' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-bold text-white">
                          {(activeItem.data as any).title}
                        </h3>
                        <span className="text-xs font-mono text-cyan-400">
                          Target Duration: {(activeItem.data as any).targetDurationSec || 60} Seconds
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(activeItem.data as any).scenes?.map((scene: any, i: number) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                              <span>Scene {i + 1} ({scene.timecode})</span>
                              {scene.onScreenText && (
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                                  Overlay: "{scene.onScreenText}"
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-300">
                              <strong className="text-slate-400 font-mono">Visual: </strong>
                              {scene.visualDescription}
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-cyan-200 font-sans">
                              <strong className="text-amber-300 font-mono">Narration: </strong>
                              "{scene.audioNarration}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Executive Brief Renderer */}
                  {activeItem.contentType === 'executive_brief' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">
                        {(activeItem.data as any).policyTitle}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {(activeItem.data as any).strategicContext}
                      </p>

                      <div className="space-y-2">
                        <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                          Key Empirical Findings & Policy Implications
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {(activeItem.data as any).keyFindings?.map((kf: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-mono">•</span>
                              <span>{kf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Infographic Renderer */}
                  {activeItem.contentType === 'infographic_spec' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">
                        {(activeItem.data as any).title}
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(activeItem.data as any).keyMetrics?.map((m: any, i: number) => (
                          <div key={i} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                            <div className="text-lg font-bold font-mono text-emerald-300">{m.value}</div>
                            <div className="text-[11px] font-semibold text-white mt-0.5">{m.label}</div>
                            {m.unit && <div className="text-[10px] font-mono text-slate-400">{m.unit}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grounded Citations Footer */}
                  {(activeItem as any).citations && (activeItem as any).citations.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Grounded Citations from Repository ({(activeItem as any).citations.length})</span>
                      </h4>
                      <div className="space-y-1.5">
                        {(activeItem as any).citations.map((cit: any, idx: number) => (
                          <div key={idx} className="text-[11px] text-slate-300 font-mono flex items-center justify-between">
                            <span>• {cit.title}</span>
                            <span className="text-cyan-400">Pg {cit.page} ({cit.section})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 text-center glass-panel rounded-3xl border border-slate-800 flex flex-col items-center justify-center gap-3">
              <Share2 className="w-12 h-12 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No Outreach Content Generated Yet</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Select a research document from the left panel and click "Generate Outreach Media Package".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
