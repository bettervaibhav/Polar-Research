'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  GraduationCap,
  Clock,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { LearnerLevel, Lesson } from '@/types/lesson';

const PRESET_TOPICS = [
  {
    title: 'Antarctic Sea Ice Dynamics & The Ice-Albedo Feedback Loop',
    station: 'BHARATI',
    duration: 10,
    level: 'undergraduate' as LearnerLevel,
    objective: 'Understand how summer melt ponds drop albedo to 0.48, amplifying ocean heat absorption.',
  },
  {
    title: 'Arctic Warming & Teleconnections with the Indian Summer Monsoon',
    station: 'INDARC / HIMADRI',
    duration: 10,
    level: 'undergraduate' as LearnerLevel,
    objective: 'Explore how Rossby wave meandering triggers anomalous rain patterns across central India.',
  },
  {
    title: 'Psychrophilic Extremophiles in Lake Priyadarshini, Schirmacher Oasis',
    station: 'MAITRI',
    duration: 8,
    level: 'undergraduate' as LearnerLevel,
    objective: 'Analyze cold-active enzymes (lipases/proteases) synthesized by Antarctic bacteria at 4°C to 12°C.',
  },
  {
    title: 'Antarctic Bottom Water (AABW) & Global Thermohaline Circulation',
    station: 'BHARATI / AMERY',
    duration: 12,
    level: 'researcher' as LearnerLevel,
    objective: 'Explain brine rejection during sea ice freezing and investigate the 14% decline in AABW ventilation.',
  },
];

export default function LessonStudioPage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [learnerLevel, setLearnerLevel] = useState<LearnerLevel>('undergraduate');
  const [targetDurationMin, setTargetDurationMin] = useState(10);
  const [learningObjective, setLearningObjective] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<Lesson | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const lesson = await apiClient.generateLesson({
        topic,
        learnerLevel,
        targetDurationMin,
        learningObjective,
      });
      setGeneratedLesson(lesson);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartTeachingRoom = async () => {
    if (!generatedLesson) return;
    try {
      const session = await apiClient.createTeachingSession(generatedLesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>MODULE 3 • AI LESSON GENERATOR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Pedagogical Polar Science Lesson Generator</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Creates structured lessons with learning milestones, teacher scripts, digital blackboard commands, and pop quizzes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lesson Configurator Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Configure Lesson Parameters
          </h3>

          {/* Quick Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400">Curated Polar Research Topics:</label>
            <div className="space-y-2">
              {PRESET_TOPICS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(p.title);
                    setLearnerLevel(p.level);
                    setTargetDurationMin(p.duration);
                    setLearningObjective(p.objective);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    topic === p.title
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">
                    Station: {p.station} • {p.duration} min
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 pt-2 border-t border-slate-800">
            {/* Custom Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Lesson Topic:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter scientific topic..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Learner Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Learner Level:</label>
              <select
                value={learnerLevel}
                onChange={(e) => setLearnerLevel(e.target.value as LearnerLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
              >
                <option value="school">School Student (Conceptual & Visual)</option>
                <option value="undergraduate">Undergraduate (Mechanistic & Analytical)</option>
                <option value="researcher">Research Scholar (Mathematical & Methodological)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Target Duration:</span>
                <span className="text-cyan-400 font-bold">{targetDurationMin} Minutes</span>
              </label>
              <input
                type="range"
                min={5}
                max={20}
                step={1}
                value={targetDurationMin}
                onChange={(e) => setTargetDurationMin(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Specific Objective */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Key Learning Objective:</label>
              <textarea
                value={learningObjective}
                onChange={(e) => setLearningObjective(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Pedagogical Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Structured Lesson</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Lesson Preview */}
        <div className="lg:col-span-2 space-y-6">
          {generatedLesson ? (
            <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/30 space-y-6 animate-fadeIn">
              {/* Header Preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase font-semibold">
                      {generatedLesson.learnerLevel} LEVEL
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {generatedLesson.targetDurationMin} MIN
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{generatedLesson.title}</h2>
                </div>

                <button
                  onClick={handleStartTeachingRoom}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 flex-shrink-0"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Launch in Teaching Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Learning Objectives</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {generatedLesson.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-mono">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sequential Section Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sequential Teaching Sections ({generatedLesson.sections.length})</span>
                </h4>

                <div className="space-y-3">
                  {generatedLesson.sections.map((sec, i) => (
                    <div
                      key={sec.id || i}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300">
                          Section {i + 1}: {sec.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {sec.blackboardActions.length} Board Actions • {sec.estimatedDurationSec}s
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 italic">
                        <strong>Concept: </strong> {sec.concept}
                      </p>

                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                        <strong className="text-amber-400">Teacher Script: </strong>
                        "{sec.teacherScript}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz Preview */}
              {generatedLesson.quiz && generatedLesson.quiz.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Included Evaluation Quiz ({generatedLesson.quiz.length} Questions)</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Students will receive these interactive pop-up evaluation questions upon completing all sections.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 text-center glass-panel rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-3">
              <Sparkles className="w-12 h-12 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No Lesson Generated Yet</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Select a preset polar research topic on the left or customize your own, then click "Generate Structured Lesson".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
