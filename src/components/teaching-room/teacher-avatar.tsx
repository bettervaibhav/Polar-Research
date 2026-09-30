'use client';

import React from 'react';
import {
  Bot,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Pause,
  Play,
  Award,
  Radio,
} from 'lucide-react';
import { TeachingStatus } from '@/types/teaching';

interface TeacherAvatarProps {
  status: TeachingStatus;
  isSpeaking: boolean;
  currentConcept?: string;
  currentExplanation?: string;
  voiceEnabled?: boolean;
}

export function TeacherAvatar({
  status,
  isSpeaking,
  currentConcept,
  currentExplanation,
  voiceEnabled = true,
}: TeacherAvatarProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'intro':
        return {
          text: 'Teaching • Introduction',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
        };
      case 'explaining':
        return {
          text: 'Teaching • Explaining Concept',
          color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          dot: 'bg-cyan-400',
        };
      case 'drawing':
        return {
          text: 'Drawing on Blackboard',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
        };
      case 'interrupted':
        return {
          text: 'Paused • Answering Student Q&A',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
        };
      case 'paused':
        return {
          text: 'Lesson Paused',
          color: 'bg-slate-700/40 text-slate-300 border-slate-600',
          dot: 'bg-slate-400',
        };
      case 'completed':
        return {
          text: 'Lesson Completed',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          dot: 'bg-purple-400',
        };
      default:
        return {
          text: 'Active Teaching Room',
          color: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-cyan-400',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="glass-panel p-5 rounded-3xl border border-cyan-500/25 relative overflow-hidden space-y-4 shadow-xl">
      {/* Background Polar Glow Effect */}
      <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />

      {/* Top Row: Avatar & Status Info */}
      <div className="flex items-center gap-4">
        {/* Avatar Graphic with Dynamic Pulse Ring */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 flex items-center justify-center shadow-xl shadow-cyan-500/25 transition-all duration-300 ${
              isSpeaking
                ? 'scale-105 ring-4 ring-cyan-400/50 shadow-cyan-400/40'
                : 'ring-2 ring-slate-700'
            }`}
          >
            <Bot className="w-8 h-8 text-white" />
          </div>

          {/* Soundwave Pulse Indicator */}
          {isSpeaking && (
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-extrabold text-[9px] font-mono flex items-center gap-1 shadow-lg animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              LIVE
            </div>
          )}
        </div>

        {/* Teacher Title & Role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-extrabold text-white text-sm tracking-wide truncate">
              Dr. Polara
            </h3>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          </div>

          <p className="text-[11px] font-mono text-cyan-300/80 truncate">
            AI Polar Educator • Cryosphere
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${badge.dot} ${isSpeaking ? 'animate-ping' : ''}`} />
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${badge.color}`}>
              {badge.text}
            </span>
          </div>
        </div>
      </div>

      {/* Spoken Voice Soundwave Visualizer Bars */}
      <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          {voiceEnabled ? (
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span>{voiceEnabled ? (isSpeaking ? 'AI Voice Active' : 'AI Voice Ready') : 'Voice Muted'}</span>
        </div>

        {/* Audio Wave Visualizer Simulation */}
        <div className="flex items-center gap-1 h-4">
          {[40, 75, 95, 60, 85, 100, 50, 70, 90, 35].map((height, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? 'bg-gradient-to-t from-cyan-500 to-blue-400'
                  : 'bg-slate-700 h-1.5'
              }`}
              style={{
                height: isSpeaking ? `${Math.max(4, (height * ((i % 3) + 1)) % 16)}px` : '4px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Current Active Concept Capsule */}
      {currentConcept && (
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Active Focus
          </div>
          <p className="text-slate-200 text-xs font-medium leading-snug">
            {currentConcept}
          </p>
        </div>
      )}
    </div>
  );
}
