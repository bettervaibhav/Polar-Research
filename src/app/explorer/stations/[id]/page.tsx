'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  MapPin,
  Thermometer,
  Radio,
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  Activity,
  Calendar,
  Building2,
  ExternalLink,
  Loader2,
  Ship,
  Image as ImageIcon,
  CheckCircle2,
  Search,
  Send,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { ResearchStation, Document, Expedition, MediaAsset, GroundedAnswer } from '@/types';
import { getStationBadgeColor } from '@/lib/utils';
import { CitationViewer } from '@/components/knowledge/citation-viewer';

export default function StationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [data, setData] = useState<{
    station: ResearchStation;
    relatedDocuments: Document[];
    relatedExpeditions: Expedition[];
    relatedMedia: MediaAsset[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Grounded Q&A State
  const [askQuery, setAskQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [groundedAnswer, setGroundedAnswer] = useState<GroundedAnswer | null>(null);

  useEffect(() => {
    loadStationDetails();
  }, [id]);

  const loadStationDetails = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getStationDetail(id);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeachMeStation = async () => {
    if (!data?.station) return;
    try {
      const lesson = await apiClient.generateLesson({
        topic: `${data.station.name} — Scientific Research & Meteorological Observations`,
        learnerLevel: 'undergraduate',
        targetDurationMin: 10,
        sourceDocumentIds: data.relatedDocuments.map((d) => d.id),
      });
      const session = await apiClient.createTeachingSession(lesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAskAIStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim() || !data?.station) return;

    setIsAsking(true);
    try {
      const res = await apiClient.askGroundedQuestion(
        `At ${data.station.name} (${data.station.code}): ${askQuery}`,
        data.station.code
      );
      setGroundedAnswer(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading station dossier & telemetry archives...</p>
      </div>
    );
  }

  if (!data || !data.station) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Station Not Found</h2>
        <p className="text-xs text-slate-400">The requested polar research station record could not be found.</p>
        <Link href="/explorer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-cyan-300 text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Polar Explorer</span>
        </Link>
      </div>
    );
  }

  const { station, relatedDocuments, relatedExpeditions, relatedMedia } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Navigation */}
      <Link
        href="/explorer"
        className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Polar Explorer & Map</span>
      </Link>

      {/* Main Station Header & Hero Card */}
      <div className="glass-panel-glow p-8 rounded-3xl border border-cyan-500/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono px-3 py-0.5 rounded-full border font-bold ${getStationBadgeColor(station.code)}`}>
                {station.code}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {station.region.toUpperCase()} REGION
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                STATUS: {station.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{station.name}</h1>
            <p className="text-xs font-mono text-slate-400">
              Established {station.establishedYear} • National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Live Surface Temp</div>
              <div className="text-2xl font-bold font-mono text-cyan-300">{station.currentTempC}°C</div>
            </div>
            <Thermometer className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        {/* Location & Geospatial Summary Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[10px]">Latitude</div>
            <div className="text-slate-200 font-bold">{station.latitude.toFixed(4)}°</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">Longitude</div>
            <div className="text-slate-200 font-bold">{station.longitude.toFixed(4)}°</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">Elevation</div>
            <div className="text-slate-200 font-bold">{station.elevationMeters} meters</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">Linked Research</div>
            <div className="text-cyan-400 font-bold">{relatedDocuments.length} Papers</div>
          </div>
        </div>

        {/* Overview Narrative */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Station Profile & Operational Capabilities
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">{station.description}</p>
        </div>

        {/* Focus Areas & Payloads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Scientific Focus Areas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {station.focusAreas.map((area, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1"
                >
                  <Layers className="w-3 h-3 text-cyan-400" />
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Active In-Situ Sensor Payloads
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {station.activeInstruments.map((inst, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1.5"
                >
                  <Activity className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{inst}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <span className="text-[11px] font-mono text-slate-400">
            Station data verified by NCPOR Official Databases
          </span>

          <button
            onClick={handleTeachMeStation}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teach Me This Station in Teaching Room</span>
          </button>
        </div>
      </div>

      {/* Grounded AI Query Panel for This Station */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">
            Ask Polar AI About {station.name}
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Queries will be answered by searching indexed research documents specific to {station.code}.
        </p>

        <form onSubmit={handleAskAIStation} className="flex gap-2">
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            placeholder={`Ask a question (e.g. What studies are conducted in ${station.code} on ice dynamics?)...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={isAsking || !askQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Ask AI</span>
          </button>
        </form>

        {/* Grounded Answer Display */}
        {groundedAnswer && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 mt-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Grounded AI Analysis</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Grounded: {groundedAnswer.citations && groundedAnswer.citations.length > 0 ? 'Yes (NCPOR Repository)' : 'No'}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{groundedAnswer.answer}</p>
            {groundedAnswer.citations.length > 0 && (
              <CitationViewer citations={groundedAnswer.citations} />
            )}
          </div>
        )}
      </div>

      {/* Linked Peer-Reviewed Research Papers */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Peer-Reviewed Documents Linked to {station.code} ({relatedDocuments.length})</span>
        </h3>

        {relatedDocuments.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800 text-xs text-slate-400 font-mono">
            No specific documents assigned to this station yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                      {doc.docType.replace('_', ' ').toUpperCase()}
                    </span>
                    <span>{doc.year}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{doc.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{doc.abstract}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/repository/${doc.id}`}
                    className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => {
                      apiClient.generateLesson({
                        topic: doc.title,
                        learnerLevel: 'undergraduate',
                        targetDurationMin: 10,
                        sourceDocumentIds: [doc.id],
                      }).then((les) => apiClient.createTeachingSession(les.id))
                        .then((s) => router.push(`/teaching-room/${s.id}`));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30"
                  >
                    Teach Me
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Linked Expeditions */}
      {relatedExpeditions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Ship className="w-4 h-4 text-blue-400" />
            <span>Associated Expeditions ({relatedExpeditions.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedExpeditions.map((exp) => (
              <div
                key={exp.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    YEAR {exp.year}
                  </span>
                  <span>{exp.season}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{exp.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2">{exp.summary}</p>
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/explorer/expeditions/${exp.id}`}
                    className="text-xs font-semibold text-blue-400 hover:underline"
                  >
                    View Expedition Log →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
