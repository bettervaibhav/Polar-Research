'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  Play,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Clock,
  Award,
  Layers,
  Loader2,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { Lesson } from '@/types/lesson';
import { TeachingSession } from '@/types/teaching';

const SAMPLE_TOPICS = [
  {
    topic: 'Antarctic Sea Ice Dynamics & The Ice-Albedo Feedback Loop',
    station: 'BHARATI',
    duration: 10,
    desc: 'Examines surface reflectivity of dry snow (0.84) vs melt ponds (0.48) and bottom melt rates (>3.4 cm/day) in Prydz Bay.',
  },
  {
    topic: 'Arctic Warming & Teleconnections with the Indian Summer Monsoon',
    station: 'INDARC',
    duration: 10,
    desc: 'Analyzes planetary Rossby wave meandering caused by Barents-Kara Sea ice retreat and its impact on Indian rainfall.',
  },
  {
    topic: 'Psychrophilic Extremophiles in Lake Priyadarshini, Schirmacher Oasis',
    station: 'MAITRI',
    duration: 8,
    desc: 'Studies cold-adapted bacterial isolates producing active enzymes at 4°C to 12°C for low-temperature bioremediation.',
  },
];

export default function TeachingRoomLauncherPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);

  const handleLaunchTopic = async (topic: string) => {
    setIsStarting(true);
    setLoadingTopic(topic);
    try {
      const lesson = await apiClient.generateLesson({
        topic,
        learnerLevel: 'undergraduate',
        targetDurationMin: 10,
      });
      const session = await apiClient.createTeachingSession(lesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error(err);
      setIsStarting(false);
      setLoadingTopic(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>MODULE 4 • AI TEACHING ROOM</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Interactive Polar Science Classroom</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Stateful AI educator with digital blackboard animations, speech narration, and live student interruption & resume.
          </p>
        </div>
      </div>

      {/* Feature Highlight Callout */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>How the Teaching Room Works</span>
            </div>
            <h3 className="text-lg font-bold text-white">Not a chatbot. A persistent, interactive AI teacher.</h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Dr. Polara teaches concept by concept, drawing synchronized diagrams on the blackboard. At any second, click <strong>"Ask Question"</strong> to pause, get a verified grounded answer from the repository, and resume smoothly from the exact timestamp.
            </p>
          </div>

          <button
            onClick={() => handleLaunchTopic(SAMPLE_TOPICS[0].topic)}
            disabled={isStarting}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 flex-shrink-0"
          >
            {isStarting && loadingTopic === SAMPLE_TOPICS[0].topic ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Launching Classroom...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Sea Ice Lesson (Recommended)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommended Lessons Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
          Select a Polar Lesson to Begin:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_TOPICS.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 glass-card-hover flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Station: {item.station}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.duration} Min
                  </span>
                </div>

                <h4 className="font-bold text-base text-white">{item.topic}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleLaunchTopic(item.topic)}
                  disabled={isStarting}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isStarting && loadingTopic === item.topic ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>Enter Teaching Room</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
