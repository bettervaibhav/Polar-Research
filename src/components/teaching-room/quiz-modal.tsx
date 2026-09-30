'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/types/lesson';
import { CheckCircle2, XCircle, Award, Sparkles, RotateCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface QuizModalProps {
  isOpen: boolean;
  quiz: QuizQuestion[];
  topic: string;
  sessionId?: string;
  onClose: () => void;
}

export function QuizModal({ isOpen, quiz, topic, sessionId, onClose }: QuizModalProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();

  const handleSubmitQuiz = async () => {
    setSubmitted(true);
    if (sessionId) {
      setIsSubmitting(true);
      try {
        await fetch(`/api/teaching/session/${sessionId}/quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score,
            totalQuestions: quiz.length,
            answersMap: selectedAnswers,
          }),
        });
      } catch (err) {
        console.error('[Quiz Submit Error]', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Lesson Evaluation & Knowledge Check</h3>
              <p className="text-xs text-slate-400 font-mono">Topic: {topic}</p>
            </div>
          </div>
          {submitted && (
            <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              Score: {score} / {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
            </div>
          )}
        </div>

        {/* Quiz Questions */}
        <div className="space-y-6">
          {quiz.map((q, qIdx) => {
            const isAnswered = selectedAnswers[qIdx] !== undefined;
            const isCorrect = selectedAnswers[qIdx] === q.correctAnswerIndex;

            return (
              <div
                key={q.id || qIdx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-100 leading-relaxed">
                    <span className="text-cyan-400 mr-1.5 font-mono">{qIdx + 1}.</span>
                    {q.question}
                  </h4>
                  {submitted && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    let style = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-cyan-500/40';

                    if (submitted) {
                      if (optIdx === q.correctAnswerIndex) {
                        style = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold';
                      } else if (isSelected) {
                        style = 'bg-rose-500/20 border-rose-500/60 text-rose-300';
                      }
                    } else if (isSelected) {
                      style = 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(qIdx, optIdx)}
                        className={`text-left p-2.5 rounded-lg border text-xs transition-all ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/80 text-[11px] text-slate-400">
                    <strong className="text-cyan-400">Explanation: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            {!submitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < quiz.length || isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Submit & Record Answers</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setSubmitted(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
                <Link
                  href="/media"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Outreach in Media Studio</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
