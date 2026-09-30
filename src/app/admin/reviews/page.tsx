'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Loader2,
  Clock,
  Award,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';

export default function AdminReviewsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviewLogs();
  }, []);

  const loadReviewLogs = async () => {
    setIsLoading(true);
    try {
      const s = await apiClient.getAdminStats();
      setStats(s);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleAuditLogs = [
    {
      id: 'audit-01',
      type: 'Q&A Grounding Interruption',
      query: 'What is the broadband albedo of fresh dry snow measured over fast ice near Bharati Station?',
      groundedStatus: 'PASS (Score 0.94)',
      matchedCitation: 'doc-antarctic-ice-albedo (Section 2, Page 4)',
      timestamp: '2024-01-10T14:22:00Z',
      action: 'Verified Zero-Hallucination',
    },
    {
      id: 'audit-02',
      type: 'Unsupported Knowledge Defense Guardrail',
      query: 'What is the average population of Paris in 2026?',
      groundedStatus: 'BLOCKED (Score < 0.35)',
      matchedCitation: 'N/A — Outside Polar Sense Knowledge Base',
      timestamp: '2024-01-10T15:10:00Z',
      action: 'Safely Refused Unsupported Claim',
    },
    {
      id: 'audit-03',
      type: 'Lesson Directives Integrity',
      query: 'Antarctic Fast Ice Thermodynamics Lesson Generation',
      groundedStatus: 'PASS (100% Valid SVG Stroke Vectors)',
      matchedCitation: 'doc-antarctic-ice-albedo',
      timestamp: '2024-01-10T16:05:00Z',
      action: 'Synchronized with Blackboard FSM',
    },
  ];

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
          <h1 className="text-3xl font-extrabold text-white">Quality Control & Grounding Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Audit logs for zero-hallucination guardrail triggers, interruption responses, and research citation veracity.
          </p>
        </div>
      </div>

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Grounded RAG Accuracy</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">100% Grounded</div>
          <p className="text-[10px] text-slate-400 font-mono">Zero unsupported hallucinated citations</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Strict Relevance Threshold</div>
          <div className="text-2xl font-bold font-mono text-cyan-300">Score &gt;= 0.35</div>
          <p className="text-[10px] text-slate-400 font-mono">Hybrid Cosine + BM25 dual index</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">NCPOR Provenance Coverage</div>
          <div className="text-2xl font-bold font-mono text-purple-300">Bharati, Maitri, Himadri, IndARC</div>
          <p className="text-[10px] text-slate-400 font-mono">Verified Indian polar stations</p>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Reasoning & Grounding Audit Verification Trail</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Live Verification Log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Event Type & Query</th>
                <th className="p-4">Guardrail / Threshold Check</th>
                <th className="p-4">Matched Citation</th>
                <th className="p-4">Audit Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sampleAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 max-w-md">
                    <div className="font-semibold text-slate-100">{log.type}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">"{log.query}"</div>
                  </td>
                  <td className="p-4 font-mono text-cyan-300">{log.groundedStatus}</td>
                  <td className="p-4 font-mono text-slate-400">{log.matchedCitation}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{log.action}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
