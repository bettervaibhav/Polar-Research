'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Compass,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Loader2,
  Snowflake,
  Database,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { GroundedAnswer } from '@/types';
import { CitationViewer } from '@/components/knowledge/citation-viewer';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [groundedResult, setGroundedResult] = useState<GroundedAnswer | null>(null);

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await apiClient.askGroundedQuestion(searchQuery);
      setGroundedResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const pipelineSteps = [
    {
      step: '01',
      title: 'Research',
      desc: 'NCPOR expedition reports, pyranometer telemetry & peer-reviewed papers.',
      icon: Database,
      badge: 'Real Data',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    },
    {
      step: '02',
      title: 'Knowledge',
      desc: 'Binary PDF ingestion, section headers, physical page mapping & vector index.',
      icon: BookOpen,
      badge: 'Dual Index',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    },
    {
      step: '03',
      title: 'Grounded AI',
      desc: 'Hybrid retrieval with cosine & BM25. Zero hallucination guarantee.',
      icon: ShieldCheck,
      badge: 'RAG Guarded',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      step: '04',
      title: 'Teaching',
      desc: 'Synchronized digital blackboard, voice narration & interruption state machine.',
      icon: GraduationCap,
      badge: 'Stateful FSM',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
    {
      step: '05',
      title: 'Outreach',
      desc: 'Dissemination studio converting science into press releases & infographics.',
      icon: Share2,
      badge: 'Multi-Channel',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    },
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Professional Platform Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-6">
          <Snowflake className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
          <span>Polar Research Platform • AI Knowledge System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-5xl mx-auto">
          POLAR SENSE AI
        </h1>

        <p className="mt-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
          "From Polar Research to Public Understanding."
        </p>

        <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          An integrated polar science platform that transforms research from <strong>Bharati</strong>, <strong>Maitri</strong>, <strong>Himadri</strong>, and <strong>IndARC</strong> into verifiable knowledge, interactive AI lessons with animated blackboards, and public outreach media.
        </p>

        {/* Action Pipeline Flow Banner */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
          <span className="text-cyan-400 font-bold">Research</span>
          <span className="text-slate-500">➔</span>
          <span className="text-blue-400 font-bold">Knowledge</span>
          <span className="text-slate-500">➔</span>
          <span className="text-emerald-400 font-bold">Grounded AI</span>
          <span className="text-slate-500">➔</span>
          <span className="text-amber-400 font-bold">Teaching</span>
          <span className="text-slate-500">➔</span>
          <span className="text-purple-400 font-bold">Outreach</span>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/repository"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <BookOpen className="w-5 h-5" />
            <span>Explore Polar Research</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/teaching-room"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-all hover:border-cyan-500/40"
          >
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span>Enter AI Teaching Room</span>
          </Link>
        </div>

        {/* Compact Ask Polar AI Grounded Search Box */}
        <div className="mt-12 max-w-3xl mx-auto">
          <form onSubmit={handleQuickAsk} className="relative">
            <div className="glass-panel-glow rounded-2xl p-2 flex items-center border border-cyan-500/40 shadow-2xl">
              <Search className="w-5 h-5 text-cyan-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask a question about polar research..."
                className="w-full px-4 py-3 bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Ask AI</span>
              </button>
            </div>
          </form>

          {/* Grounded Result Display */}
          {groundedResult && (
            <div className="mt-6 text-left glass-panel-glow p-6 rounded-2xl border border-cyan-500/40 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Grounded Polar AI Answer (100% Provenance)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Confidence: {Math.round(groundedResult.confidenceScore * 100)}%
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {groundedResult.answer}
              </div>

              <CitationViewer citations={groundedResult.citations} />

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <Link
                  href={`/tutor?topic=${encodeURIComponent(searchQuery)}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Generate Full AI Lesson on this Topic</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Visual Platform Pipeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The Verified Polar Intelligence Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every step is connected through relational data provenance and strict RAG grounding
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pipelineSteps.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-gradient-to-b ${p.color} border flex flex-col justify-between transition-all hover:scale-105`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">{p.step}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
                      {p.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1.5">{p.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Modules Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comprehensive Platform Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-mono">
            Explore research, enter classrooms, visualize geography, or generate media
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link href="/repository" className="glass-panel p-6 rounded-2xl border border-cyan-500/20 glass-card-hover group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">1. Polar Knowledge Hub</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated peer-reviewed research papers, expedition reports from Bharati & Maitri, and scientific datasets with full-text chunking.
            </p>
          </Link>

          {/* Card 2 */}
          <Link href="/tutor" className="glass-panel p-6 rounded-2xl border border-blue-500/20 glass-card-hover group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">2. Grounded Polar AI (RAG)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dual-index hybrid retrieval (Cosine + BM25) ensuring all factual claims are backed by verifiable source citations.
            </p>
          </Link>

          {/* Card 3 */}
          <Link href="/tutor" className="glass-panel p-6 rounded-2xl border border-amber-500/20 glass-card-hover group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">3. AI Lesson Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Creates structured lessons with learning objectives, teacher scripts, blackboard drawing commands, and pop quizzes.
            </p>
          </Link>

          {/* Card 4 (Key Differentiator) */}
          <Link href="/teaching-room" className="glass-panel-glow p-6 rounded-2xl border border-cyan-400/40 glass-card-hover group lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold font-mono uppercase">
                Interactive AI Classroom
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-white mb-2">4. AI Teaching Room & Digital Blackboard</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              An actual AI educator executing synchronized board drawings and voice narration. Students can interrupt with questions at any moment — the lesson pauses, RAG retrieves verified answers, and teaching resumes from the exact state.
            </p>
          </Link>

          {/* Card 5 */}
          <Link href="/explorer" className="glass-panel p-6 rounded-2xl border border-indigo-500/20 glass-card-hover group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">5. Polar Explorer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive exploration of Bharati, Maitri, Himadri, and IndARC stations with 1-click "Teach Me This" handoff.
            </p>
          </Link>

          {/* Card 6 */}
          <Link href="/media" className="glass-panel p-6 rounded-2xl border border-emerald-500/20 glass-card-hover group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">6. Media Outreach Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transform research papers into articles, policy briefs, social media threads, infographics, and 60-second video scripts.
            </p>
          </Link>

          {/* Card 7 */}
          <Link href="/admin" className="glass-panel p-6 rounded-2xl border border-purple-500/20 glass-card-hover group lg:col-span-2">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">7. Admin Ingestion & Governance Dashboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ingest new research documents, manage semantic chunks, audit generated media reviews, and monitor real database telemetry.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
