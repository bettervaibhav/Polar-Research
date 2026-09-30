'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  FileText,
  Building2,
  Ship,
  Tag,
  GraduationCap,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  type: 'document' | 'station' | 'expedition' | 'topic' | 'lesson';
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
  badgeColor?: string;
  matchSnippet?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'station':
        return <Building2 className="w-4 h-4 text-indigo-400" />;
      case 'expedition':
        return <Ship className="w-4 h-4 text-blue-400" />;
      case 'topic':
        return <Tag className="w-4 h-4 text-purple-400" />;
      case 'lesson':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl rounded-3xl p-5 border border-cyan-500/40 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
        {/* Search Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents, stations, expeditions, topics, or lessons (e.g. Albedo, Maitri, IndARC)..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-sans"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="text-xs font-mono text-slate-400">Searching all polar database records...</span>
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item.url)}
                className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400 line-clamp-1">
                  {item.subtitle}
                </div>

                {item.matchSnippet && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic">
                    "{item.matchSnippet}"
                  </p>
                )}
              </div>
            ))
          ) : query.trim().length >= 2 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400">
              No polar database records matching "{query}".
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-slate-500 space-y-1">
              <p>Type keywords to query research papers, Arctic/Antarctic stations, and lessons.</p>
              <p className="text-[10px] text-cyan-400">Try: "Bharati", "Albedo", "Priyadarshini", "IndARC"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Press ESC or click anywhere outside to close</span>
          <span>Polar Science Knowledge Repository</span>
        </div>
      </div>
    </div>
  );
}
