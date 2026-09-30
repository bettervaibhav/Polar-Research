'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Play,
  Mic,
  MicOff,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { SourceCitation } from '@/types';

interface InterruptionModalProps {
  isOpen: boolean;
  isLoading: boolean;
  activeAnswer: string | null;
  citations: SourceCitation[];
  expectedQuestions?: string[];
  onSubmitQuestion: (question: string) => void;
  onResume: () => void;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  voiceTranscript?: string;
}

export function InterruptionModal({
  isOpen,
  isLoading,
  activeAnswer,
  citations,
  expectedQuestions = [],
  onSubmitQuestion,
  onResume,
  isListening,
  onStartListening,
  onStopListening,
  voiceTranscript,
}: InterruptionModalProps) {
  const [questionText, setQuestionText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = questionText || voiceTranscript;
    if (q && q.trim()) {
      onSubmitQuestion(q.trim());
      setQuestionText('');
    }
  };

  const handleQuickQuestion = (q: string) => {
    onSubmitQuestion(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/10">
              <HelpCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Student Interruption & Grounded Q&A
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                  LESSON FROZEN
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                The AI educator pauses instantly. Your question will be answered using verified polar repository sources.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Body State: Loading / Answer / Question Form */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
              </div>
              <Sparkles className="w-4 h-4 text-cyan-300 absolute -top-1 -right-1 animate-ping" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Searching Polar Sense Knowledge Repository...</p>
              <p className="text-xs text-slate-400 font-mono max-w-md">
                Querying hybrid BM25 + Vector embeddings across Bharati, Maitri, Himadri, and IndARC research papers.
              </p>
            </div>
          </div>
        ) : activeAnswer ? (
          /* Answer Render with Grounded Evidence */
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Dr. Polara's Grounded Explanation</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified RAG</span>
                </div>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {activeAnswer}
              </div>
            </div>

            {/* Citations List */}
            {citations.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified Repository Citations ({citations.length})</span>
                </h4>
                <div className="space-y-2">
                  {citations.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-cyan-300">
                        <span className="line-clamp-1">{c.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0 ml-2">
                          Pg {c.page} • {c.section}
                        </span>
                      </div>
                      <p className="text-slate-400 italic line-clamp-2">
                        "{c.snippet}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Lesson state & blackboard preserved in DB.
              </span>
              <button
                onClick={onResume}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Lesson From Exact Stroke</span>
              </button>
            </div>
          </div>
        ) : (
          /* Question Input Form */
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={questionText || voiceTranscript || ''}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ask any question about this concept (e.g. Wait, how does summer melt pond albedo trigger bottom melting?)..."
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 placeholder-slate-500 text-xs font-sans outline-none resize-none"
                />

                {onStartListening && (
                  <button
                    type="button"
                    onClick={isListening ? onStopListening : onStartListening}
                    className={`absolute right-3.5 bottom-3.5 p-2 rounded-xl text-xs font-medium transition-colors ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                    title={isListening ? 'Stop Mic' : 'Ask via Voice'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onResume}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono border border-slate-800"
                >
                  Never mind, Resume Lesson
                </button>

                <button
                  type="submit"
                  disabled={!questionText.trim() && !voiceTranscript}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Grounded RAG</span>
                </button>
              </div>
            </form>

            {/* Quick Suggested Questions */}
            {expectedQuestions.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80">
                <p className="text-[11px] font-mono text-cyan-300 font-semibold mb-2">
                  Frequently Asked Clarifications for this Concept:
                </p>
                <div className="flex flex-wrap gap-2">
                  {expectedQuestions.map((eq, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickQuestion(eq)}
                      className="text-left text-xs px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-cyan-500/15 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 transition-colors"
                    >
                      "{eq}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
