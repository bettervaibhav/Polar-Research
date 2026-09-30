'use client';

import React, { useMemo } from 'react';
import { BlackboardAction } from '@/types/lesson';
import { Sparkles, Maximize2, Eraser, Activity } from 'lucide-react';

interface BlackboardCanvasProps {
  actions: BlackboardAction[];
  currentActionIndex: number;
  isInterrupted?: boolean;
}

export function BlackboardCanvas({
  actions,
  currentActionIndex,
  isInterrupted,
}: BlackboardCanvasProps) {
  // Actions up to currentActionIndex
  const activeActions = useMemo(() => {
    const sliced = actions.slice(0, currentActionIndex);
    // Find if there's any CLEAR_BOARD action in the active slice
    let lastClearIndex = -1;
    for (let i = sliced.length - 1; i >= 0; i--) {
      if (sliced[i].actionType === 'CLEAR_BOARD') {
        lastClearIndex = i;
        break;
      }
    }
    // If clear board is present, only show actions after the clear board directive
    return lastClearIndex >= 0 ? sliced.slice(lastClearIndex + 1) : sliced;
  }, [actions, currentActionIndex]);

  // Determine coordinate of the latest action to position the subtle chalk cursor
  const latestAction = activeActions[activeActions.length - 1];
  const chalkCursorPos = useMemo(() => {
    if (!latestAction) return null;
    const { payload, actionType } = latestAction;
    if (actionType === 'WRITE_TEXT') {
      const textLen = (payload.text || '').length;
      return { x: (payload.x || 50) + Math.min(textLen * 8.5, 300), y: (payload.y || 100) };
    }
    if (actionType === 'DRAW_ARROW') {
      return { x: payload.to?.x || 200, y: payload.to?.y || 200 };
    }
    if (actionType === 'DRAW_BOX') {
      return { x: (payload.x || 50) + (payload.width || 200), y: (payload.y || 100) + (payload.height || 80) };
    }
    if (actionType === 'DRAW_CIRCLE') {
      return { x: (payload.x || 200) + (payload.radius || 40), y: (payload.y || 200) };
    }
    return null;
  }, [latestAction]);

  return (
    <div
      className="relative w-full h-[520px] rounded-3xl chalkboard-texture border-4 border-slate-800 shadow-2xl overflow-hidden select-none flex flex-col justify-between"
      role="region"
      aria-label="Interactive Digital Blackboard"
    >
      {/* Chalkboard Slate Top Frame */}
      <div className="h-10 bg-slate-900/95 border-b border-slate-700/60 px-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-sm" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-sm" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-sm" />
          <span className="text-[11px] font-mono text-slate-300 ml-2 font-bold tracking-wider hidden sm:inline">
            POLAR SENSE • INTERACTIVE DIGITAL BLACKBOARD
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          {isInterrupted ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              FROZEN (STUDENT INTERRUPTED)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>STROKE {currentActionIndex} OF {actions.length}</span>
            </span>
          )}
        </div>
      </div>

      {/* SVG Canvas for High-Precision Scientific Diagramming & Chalk Handwriting */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        <svg
          viewBox="0 0 920 450"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full p-4"
          style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.18))' }}
        >
          <defs>
            {/* Arrowhead Markers */}
            <marker
              id="arrowhead-cyan"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
            </marker>
            <marker
              id="arrowhead-yellow"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
            </marker>
            <marker
              id="arrowhead-red"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" />
            </marker>
            <marker
              id="arrowhead-emerald"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#34d399" />
            </marker>

            {/* Chalk Texture Filter */}
            <filter id="chalk-roughness">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Grid lines (subtle blueprint/chalkboard coordinates) */}
          <g opacity="0.04" stroke="#ffffff" strokeWidth="0.5">
            {[...Array(9)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="920" y2={i * 50} />
            ))}
            {[...Array(18)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="450" />
            ))}
          </g>

          {/* Render Active Chalk & Diagram Directives */}
          {activeActions.map((action, idx) => {
            const { payload, actionType, id } = action;

            if (actionType === 'WRITE_TEXT') {
              const lines = (payload.text || '').split('\n');
              const fontSize = payload.size || 20;
              return (
                <g key={id} className="animate-chalk-text" style={{ filter: 'url(#chalk-roughness)' }}>
                  {lines.map((line, lineIdx) => (
                    <text
                      key={`${id}-line-${lineIdx}`}
                      x={payload.x || 50}
                      y={(payload.y || 100) + lineIdx * (fontSize + 10)}
                      fill={payload.color || '#f8fafc'}
                      fontSize={fontSize}
                      fontWeight={payload.weight || 'bold'}
                      fontFamily="'JetBrains Mono', 'Caveat', monospace"
                      letterSpacing="0.04em"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            }

            if (actionType === 'DRAW_BOX') {
              return (
                <g key={id} className="animate-chalk-text">
                  <rect
                    x={payload.x || 50}
                    y={payload.y || 100}
                    width={payload.width || 200}
                    height={payload.height || 80}
                    rx="10"
                    ry="10"
                    fill="rgba(11, 20, 38, 0.65)"
                    stroke={payload.color || '#38bdf8'}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    style={{ filter: 'url(#chalk-roughness)' }}
                  />
                  {payload.label && (
                    <text
                      x={(payload.x || 50) + 14}
                      y={(payload.y || 100) + 26}
                      fill={payload.color || '#38bdf8'}
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {payload.label}
                    </text>
                  )}
                </g>
              );
            }

            if (actionType === 'DRAW_ARROW') {
              const fromX = payload.from?.x || 100;
              const fromY = payload.from?.y || 100;
              const toX = payload.to?.x || 200;
              const toY = payload.to?.y || 200;
              const midX = (fromX + toX) / 2;
              const midY = (fromY + toY) / 2;
              const markerId =
                payload.color === '#facc15'
                  ? 'url(#arrowhead-yellow)'
                  : payload.color === '#f43f5e'
                  ? 'url(#arrowhead-red)'
                  : payload.color === '#34d399'
                  ? 'url(#arrowhead-emerald)'
                  : 'url(#arrowhead-cyan)';

              return (
                <g key={id} className="animate-chalk-text">
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke={payload.color || '#38bdf8'}
                    strokeWidth="3.2"
                    markerEnd={markerId}
                    strokeDasharray={payload.dashed ? '6 4' : undefined}
                    style={{ filter: 'url(#chalk-roughness)' }}
                  />
                  {payload.label && (
                    <text
                      x={midX + 10}
                      y={midY}
                      fill="#fef08a"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {payload.label}
                    </text>
                  )}
                </g>
              );
            }

            if (actionType === 'DRAW_CIRCLE') {
              return (
                <g key={id} className="animate-chalk-text">
                  <circle
                    cx={payload.x || 200}
                    cy={payload.y || 200}
                    r={payload.radius || 40}
                    fill="rgba(56, 189, 248, 0.08)"
                    stroke={payload.color || '#38bdf8'}
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    style={{ filter: 'url(#chalk-roughness)' }}
                  />
                  {payload.label && (
                    <text
                      x={payload.x || 200}
                      y={(payload.y || 200) + (payload.radius || 40) + 18}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="11"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {payload.label}
                    </text>
                  )}
                </g>
              );
            }

            if (actionType === 'UNDERLINE') {
              const startX = payload.x || 50;
              const endX = startX + (payload.width || 140);
              const lineY = (payload.y || 100) + 6;
              return (
                <g key={id} className="animate-chalk-text">
                  <line
                    x1={startX}
                    y1={lineY}
                    x2={endX}
                    y2={lineY}
                    stroke={payload.color || '#facc15'}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    style={{ filter: 'url(#chalk-roughness)' }}
                  />
                </g>
              );
            }

            if (actionType === 'HIGHLIGHT') {
              return (
                <g key={id} className="animate-chalk-text">
                  <rect
                    x={payload.x || 650}
                    y={payload.y || 210}
                    width={payload.width || 230}
                    height={payload.height || 85}
                    rx="12"
                    fill={payload.color || 'rgba(234, 179, 8, 0.22)'}
                    stroke="#eab308"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                  />
                </g>
              );
            }

            return null;
          })}

          {/* Subtle Chalk Cursor on active drawing head */}
          {chalkCursorPos && !isInterrupted && (
            <g transform={`translate(${chalkCursorPos.x + 8}, ${chalkCursorPos.y - 12})`} className="animate-pulse">
              <circle cx="0" cy="0" r="4" fill="#00f2fe" opacity="0.8" />
              <circle cx="0" cy="0" r="8" fill="none" stroke="#00f2fe" strokeWidth="1" opacity="0.4" />
            </g>
          )}

          {/* Empty state prompt */}
          {activeActions.length === 0 && (
            <text
              x="460"
              y="225"
              textAnchor="middle"
              fill="#475569"
              fontSize="14"
              fontFamily="'JetBrains Mono', monospace"
            >
              [ Digital Blackboard Initialized • Ready to render progressive visual diagram ]
            </text>
          )}
        </svg>
      </div>

      {/* Chalk tray footer */}
      <div className="h-5 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
          <span>REALTIME VECTOR CHALK ENGINE</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-1.5 rounded-full bg-cyan-400/80 shadow-sm" />
          <div className="w-8 h-1.5 rounded-full bg-amber-300/80 shadow-sm" />
          <div className="w-6 h-1.5 rounded-full bg-emerald-400/80 shadow-sm" />
          <div className="w-8 h-1.5 rounded-full bg-rose-400/80 shadow-sm" />
        </div>
      </div>
    </div>
  );
}
