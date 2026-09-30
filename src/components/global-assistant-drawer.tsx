'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  ShieldCheck,
  Bot,
  Minimize2,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { GroundedAnswer } from '@/types';
import { CitationViewer } from '@/components/knowledge/citation-viewer';

export function GlobalAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ q: string; a: GroundedAnswer }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userQuery = query.trim();
    setQuery('');
    setIsLoading(true);

    try {
      const res = await apiClient.askGroundedQuestion(userQuery);
      setHistory((prev) => [...prev, { q: userQuery, a: res }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-2xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 group"
          aria-label="Ask Polar AI Assistant"
        >
          <div className="w-5 h-5 rounded-lg bg-slate-950/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
          </div>
          <span>Ask Polar AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Floating Grounded AI Assistant Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md max-h-[600px] flex flex-col glass-panel-glow rounded-3xl border border-cyan-500/40 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span>Dr. Polara • Grounded Research Assistant</span>
                </h4>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>NCPOR Polar Knowledge Grounded</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[420px] text-xs">
            {history.length === 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <p className="text-slate-300 text-xs">
                  👋 Welcome to Dr. Polara. Ask any scientific inquiry regarding polar research, expeditions, atmospheric telemetry, or cryospheric findings.
                </p>
                <p className="text-slate-500 text-[11px] font-mono">
                  All responses are strictly grounded on indexed research documents.
                </p>
              </div>
            )}

            {history.map((turn, i) => (
              <div key={i} className="space-y-2">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-100 max-w-[85%] text-xs">
                    {turn.q}
                  </div>
                </div>

                {/* AI Grounded Response */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-slate-200">
                  <p className="leading-relaxed whitespace-pre-line text-xs">{turn.a.answer}</p>
                  {turn.a.citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-800">
                      <CitationViewer citations={turn.a.citations} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center gap-2.5 text-slate-300">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs font-mono">Searching peer-reviewed polar repository...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about polar research..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
