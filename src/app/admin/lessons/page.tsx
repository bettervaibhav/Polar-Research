'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  Play,
  Loader2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Lesson } from '@/types/lesson';

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    setIsLoading(true);
    try {
      const stats = await apiClient.getAdminStats();
      // Fetch flagship and generated lessons
      const res = await fetch('/api/teaching/session');
      if (res.ok) {
        const data = await res.json();
        // Extract unique lessons from sessions or default flagship
        const lessonList = data.map((s: any) => s.lesson).filter(Boolean);
        setLessons(lessonList);
      }
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
          <h1 className="text-3xl font-extrabold text-white">Lesson Curriculum & Directives Governance</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Inspect pedagogical structures, blackboard SVG action vectors, teacher scripts, and quiz evaluations.
          </p>
        </div>

        <Link
          href="/teaching-room"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Launch Teaching Room</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading lesson curriculum catalog...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Flagship & AI-Synthesized Curriculum Catalog</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flagship Lesson Card */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                      FLAGSHIP LESSON • UNDERGRADUATE
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      10 Min Duration
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">
                    Antarctic Sea Ice Dynamics & The Ice-Albedo Feedback Loop
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pedagogical lesson covering thermodynamic boundary conditions, fast-ice thickness (1.8m), and summer melt pond albedo drops (0.84 to 0.48) observed at Bharati Station.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                    <div>• Sections: 2 Structured Modules</div>
                    <div>• Blackboard Directives: 9 Animated Vector Strokes</div>
                    <div>• Evaluation: 2 In-Situ Quiz Questions</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>RAG Grounded in doc-antarctic-ice-albedo</span>
                  </span>
                  <Link
                    href="/teaching-room"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow transition-all"
                  >
                    Enter Room
                  </Link>
                </div>
              </div>

              {/* IndARC Arctic Lesson Card */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                      ARCTIC CURRICULUM
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      10 Min Duration
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">
                    Arctic Warming & Teleconnections with the Indian Summer Monsoon
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Explores Atlantic Water intrusion into Kongsfjorden recorded by the IndARC mooring and circum-polar Rossby wave linkages to Indian precipitation.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                    <div>• Sections: 2 Structured Modules</div>
                    <div>• Blackboard Directives: 8 Animated Vector Strokes</div>
                    <div>• Evaluation: 2 Knowledge Checks</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>RAG Grounded in IndARC mooring data</span>
                  </span>
                  <Link
                    href="/teaching-room"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all"
                  >
                    Enter Room
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
