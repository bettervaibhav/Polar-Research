'use client';

import React, { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Play,
  Pause,
  RotateCcw,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Loader2,
  ShieldCheck,
  PanelRightClose,
  PanelRightOpen,
  Keyboard,
  Compass,
} from 'lucide-react';
import { useTeachingRoomStore } from '@/stores/teaching-room-store';
import { useSpeech } from '@/hooks/use-speech';
import { BlackboardCanvas } from '@/components/blackboard/blackboard-canvas';
import { TeacherAvatar } from '@/components/teaching-room/teacher-avatar';
import { SourceDrawer } from '@/components/teaching-room/source-drawer';
import { InterruptionModal } from '@/components/teaching-room/interruption-modal';
import { QuizModal } from '@/components/teaching-room/quiz-modal';

export default function FlagshipTeachingRoomPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();

  const {
    session,
    lesson,
    status,
    currentSectionIndex,
    currentActionIndex,
    isPlaying,
    isInterrupted,
    interruptionLoading,
    activeAnswer,
    activeCitations,
    loadSession,
    togglePlay,
    executeNextAction,
    advanceSection,
    interrupt,
    resume,
    completeLesson,
  } = useTeachingRoomStore();

  const {
    isSupported: isSpeechSupported,
    isSpeaking,
    isListening,
    transcript,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  } = useSpeech();

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [interruptionInputOpen, setInterruptionInputOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mobileActiveTab, setMobileActiveTab] = useState<'classroom' | 'sources' | 'progress'>('classroom');

  // Load session on initial mount
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId, loadSession]);

  // Live session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentSection = lesson?.sections[currentSectionIndex];
  const allActions = currentSection?.blackboardActions || [];

  // Automated playback ticker when isPlaying is active and not interrupted
  useEffect(() => {
    if (!isPlaying || isInterrupted || !currentSection) return;

    // Speak teacher script on section start if voice enabled
    if (voiceEnabled && currentActionIndex === 0 && currentSection.teacherScript) {
      speak(currentSection.teacherScript);
    }

    // Smooth interval to advance blackboard actions
    const timer = setInterval(() => {
      if (currentActionIndex < allActions.length) {
        executeNextAction();
      }
    }, 2900);

    return () => clearInterval(timer);
  }, [
    isPlaying,
    isInterrupted,
    currentSectionIndex,
    currentActionIndex,
    allActions.length,
    voiceEnabled,
    currentSection,
    executeNextAction,
    speak,
  ]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'q') {
        e.preventDefault();
        handleOpenInterruption();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        executeNextAction();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setVoiceEnabled((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, executeNextAction]);

  // Format elapsed time as mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle student interruption
  const handleOpenInterruption = () => {
    stopSpeaking();
    setInterruptionInputOpen(true);
    interrupt('Student paused to ask a question');
  };

  const handleAskQuestion = (question: string) => {
    interrupt(question);
  };

  const handleResume = () => {
    setInterruptionInputOpen(false);
    resume();
    if (voiceEnabled && currentSection) {
      speak(`Continuing from where we left off... ${currentSection.teacherScript}`);
    }
  };

  const handleNextSection = async () => {
    stopSpeaking();
    if (lesson && currentSectionIndex >= lesson.sections.length - 1) {
      completeLesson();
      setShowQuiz(true);
    } else {
      await advanceSection();
    }
  };

  const handlePrevSection = () => {
    stopSpeaking();
    if (currentSectionIndex > 0) {
      useTeachingRoomStore.setState({
        currentSectionIndex: currentSectionIndex - 1,
        currentActionIndex: 0,
      });
    }
  };

  if (!session || !lesson) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
          <Sparkles className="w-4 h-4 text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Initializing AI Teaching Room</h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Restoring session state, blackboard vectors & grounded research papers from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/90 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
              POLAR SENSE • AI TEACHING ROOM
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              OFFLINE SAFE • VERIFIED RAG
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              SESSION #{session.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
              {lesson.learnerLevel.toUpperCase()} LEVEL
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {lesson.title}
          </h1>
        </div>

        {/* Global Classroom Actions & Voice Control */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Session Timer */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Voice Narration Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              voiceEnabled
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Press 'M' to toggle voice"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] font-mono hidden sm:inline">{voiceEnabled ? 'Voice ON' : 'Muted'}</span>
          </button>

          {/* Key Differentiator: Flagship Ask Question Interruption Trigger */}
          <button
            onClick={handleOpenInterruption}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            title="Press 'Q' to interrupt and ask"
          >
            <HelpCircle className="w-4 h-4 fill-slate-950 text-amber-300" />
            <span>✋ Ask Question (Pause)</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden items-center justify-between p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
        <button
          onClick={() => setMobileActiveTab('classroom')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            mobileActiveTab === 'classroom'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Teacher & Board
        </button>
        <button
          onClick={() => setMobileActiveTab('progress')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            mobileActiveTab === 'progress'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Curriculum ({lesson.sections.length})
        </button>
        <button
          onClick={() => setMobileActiveTab('sources')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            mobileActiveTab === 'sources'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Grounded Sources
        </button>
      </div>

      {/* 3-PANEL FLAGSHIP CLASSROOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================================= */}
        {/* PANEL 1 (LEFT, 3 Cols): AI Teacher Avatar, Narration Script & Controls   */}
        {/* ========================================================================= */}
        <div
          className={`space-y-4 lg:col-span-3 ${
            mobileActiveTab !== 'classroom' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Teacher Avatar Card */}
          <TeacherAvatar
            status={isInterrupted ? 'interrupted' : status}
            isSpeaking={isSpeaking}
            currentConcept={currentSection?.concept}
            voiceEnabled={voiceEnabled}
          />

          {/* Live Narration Script Box */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Spoken Script</span>
              </span>
              {isSpeaking && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold animate-pulse">
                  Speaking
                </span>
              )}
            </div>

            <div className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 min-h-[85px] flex items-center">
              "{currentSection?.teacherScript || 'Initializing polar science narration...'}"
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>Section {currentSectionIndex + 1} of {lesson.sections.length}</span>
              <span>{allActions.length} Board Directives</span>
            </div>
          </div>

          {/* Interactive Classroom Controls */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className={`flex-1 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  isPlaying
                    ? 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                }`}
                title="Press Space to Play/Pause"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Lesson' : 'Play / Continue'}</span>
              </button>

              <button
                onClick={executeNextAction}
                disabled={currentActionIndex >= allActions.length}
                className="px-3.5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-mono border border-slate-800 transition-colors"
                title="Press 'N' for next stroke"
              >
                Next Stroke
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={handlePrevSection}
                disabled={currentSectionIndex === 0}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Section</span>
              </button>

              <button
                onClick={handleNextSection}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow flex items-center justify-center gap-1"
              >
                <span>{currentSectionIndex >= lesson.sections.length - 1 ? 'Take Quiz' : 'Next Section'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Keyboard Shortcuts Helper */}
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-1 text-slate-300">
                <Keyboard className="w-3 h-3 text-cyan-400" />
                <span>Shortcuts:</span>
              </div>
              <span>[Space] Play/Pause • [Q] Ask • [N] Stroke</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PANEL 2 (CENTER, 6 Cols): Large Interactive Digital Blackboard            */}
        {/* ========================================================================= */}
        <div
          className={`space-y-3 lg:col-span-6 ${
            mobileActiveTab !== 'classroom' ? 'hidden lg:block' : 'block'
          }`}
        >
          <BlackboardCanvas
            actions={allActions}
            currentActionIndex={currentActionIndex}
            isInterrupted={isInterrupted}
          />

          {/* Sub-Blackboard Guidance Strip */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono px-2 gap-2">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Realistic progressive vector drawing engine</span>
            </div>
            <button
              onClick={() => setShowQuiz(true)}
              className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Take Section Evaluation ({lesson.quiz.length} Questions)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PANEL 3 (RIGHT, 3 Cols): Curriculum Progress & Grounded Source Drawer     */}
        {/* ========================================================================= */}
        <div
          className={`space-y-4 lg:col-span-3 ${
            mobileActiveTab === 'classroom' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Section Progress Stepper */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Curriculum Roadmap</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {currentSectionIndex + 1}/{lesson.sections.length} Complete
              </span>
            </div>

            <div className="space-y-2">
              {lesson.sections.map((sec, idx) => {
                const isCurrent = idx === currentSectionIndex;
                const isPassed = idx < currentSectionIndex;

                return (
                  <button
                    key={sec.id || idx}
                    onClick={() => {
                      stopSpeaking();
                      useTeachingRoomStore.setState({
                        currentSectionIndex: idx,
                        currentActionIndex: 0,
                      });
                    }}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-start gap-2.5 ${
                      isCurrent
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                        : isPassed
                        ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-slate-950/60 border-slate-900 text-slate-500 hover:border-slate-800'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                            isCurrent
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate text-[11px]">{sec.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono line-clamp-1 mt-0.5">
                        {sec.concept}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grounded Source Drawer (Grounded in Polar Sense Repository) */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800">
            <SourceDrawer
              citations={activeCitations}
              sourceDocumentIds={lesson.sourceDocumentIds}
              currentConcept={currentSection?.concept}
            />
          </div>
        </div>
      </div>

      {/* Student Interruption & Grounded RAG Modal */}
      <InterruptionModal
        isOpen={interruptionInputOpen || isInterrupted}
        isLoading={interruptionLoading}
        activeAnswer={activeAnswer}
        citations={activeCitations}
        expectedQuestions={currentSection?.expectedQuestions}
        onSubmitQuestion={handleAskQuestion}
        onResume={handleResume}
        isListening={isListening}
        onStartListening={startListening}
        onStopListening={stopListening}
        voiceTranscript={transcript}
      />

      {/* Post-Lesson Quiz Modal */}
      <QuizModal
        isOpen={showQuiz}
        quiz={lesson.quiz}
        topic={lesson.topic}
        sessionId={session.id}
        onClose={() => setShowQuiz(false)}
      />
    </div>
  );
}
