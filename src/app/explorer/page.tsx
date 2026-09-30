'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Thermometer,
  Radio,
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  Activity,
  Wind,
  Globe,
  Loader2,
  Calendar,
  Users,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Ship,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { ResearchStation, Expedition, ResearchTopic } from '@/types';
import { getStationBadgeColor } from '@/lib/utils';

export default function PolarExplorerPage() {
  const router = useRouter();

  const [stations, setStations] = useState<ResearchStation[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'stations' | 'expeditions' | 'topics' | 'map'>('map');
  const [mapRegion, setMapRegion] = useState<'Antarctica' | 'Arctic'>('Antarctica');
  const [selectedStation, setSelectedStation] = useState<ResearchStation | null>(null);

  useEffect(() => {
    loadAllExplorerData();
  }, []);

  const loadAllExplorerData = async () => {
    setIsLoading(true);
    try {
      const [stationList, expeditionList, topicList] = await Promise.all([
        apiClient.getStations(),
        apiClient.getExpeditions(),
        apiClient.getTopics(),
      ]);
      setStations(stationList);
      setExpeditions(expeditionList);
      setTopics(topicList);
      if (stationList.length > 0) setSelectedStation(stationList[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeachMeStation = async (station: ResearchStation) => {
    try {
      const lesson = await apiClient.generateLesson({
        topic: `${station.name} — Cryosphere Dynamics & Field Telemetry`,
        learnerLevel: 'undergraduate',
        targetDurationMin: 10,
      });
      const session = await apiClient.createTeachingSession(lesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTeachMeTopic = async (topicTitle: string, docIds: string[] = []) => {
    try {
      const lesson = await apiClient.generateLesson({
        topic: topicTitle,
        learnerLevel: 'undergraduate',
        targetDurationMin: 10,
        sourceDocumentIds: docIds,
      });
      const session = await apiClient.createTeachingSession(lesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTeachMeExpedition = async (exp: Expedition) => {
    try {
      const lesson = await apiClient.generateLesson({
        topic: `${exp.title} — Mission Objectives & Findings`,
        learnerLevel: 'undergraduate',
        targetDurationMin: 10,
      });
      const session = await apiClient.createTeachingSession(lesson.id);
      router.push(`/teaching-room/${session.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter stations based on map projection
  const visibleMapStations = stations.filter((s) => s.region.toLowerCase() === mapRegion.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
            <Compass className="w-4 h-4" />
            <span>MODULE 2 • POLAR EXPLORER & GEOSPATIAL REPOSITORY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Interactive Polar Science Explorer</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Explore Indian research stations, polar expeditions, scientific topics, and sensor instrumentation.
          </p>
        </div>

        {/* Explorer Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'map'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2D Polar Map</span>
          </button>
          <button
            onClick={() => setActiveTab('stations')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'stations'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Stations ({stations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('expeditions')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'expeditions'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Expeditions ({expeditions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'topics'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Research Topics ({topics.length})</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading Geospatial Polar Network...</p>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* TAB 1: 2D POLAR PROJECTION MAP VIEW                                       */}
          {/* ========================================================================= */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              {/* Region Selector Bar */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Projection Hemispheric View:
                  </span>
                  <button
                    onClick={() => {
                      setMapRegion('Antarctica');
                      const firstAnt = stations.find((s) => s.region.toLowerCase() === 'antarctica');
                      if (firstAnt) setSelectedStation(firstAnt);
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      mapRegion === 'Antarctica'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    🇦🇶 Antarctica (South Pole Stereographic)
                  </button>
                  <button
                    onClick={() => {
                      setMapRegion('Arctic');
                      const firstArc = stations.find((s) => s.region.toLowerCase() === 'arctic');
                      if (firstArc) setSelectedStation(firstArc);
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      mapRegion === 'Arctic'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    ❄️ Arctic (North Pole Stereographic)
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Telemetry Live</span>
                </div>
              </div>

              {/* Map & Station Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 2D Polar Projection SVG Canvas */}
                <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-cyan-500/30 relative overflow-hidden shadow-2xl bg-[#060c18]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      {mapRegion === 'Antarctica' ? 'South Polar Coordinate Grid' : 'North Polar / Svalbard Archipelago'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Projection: Polar Azimuthal Equidistant
                    </span>
                  </div>

                  {/* SVG Polar Map */}
                  <div className="relative w-full aspect-square max-h-[500px] flex items-center justify-center">
                    <svg
                      viewBox="0 0 500 500"
                      className="w-full h-full drop-shadow-[0_0_20px_rgba(0,242,254,0.15)]"
                    >
                      <defs>
                        <radialGradient id="polar-sea" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#0a192f" />
                          <stop offset="70%" stopColor="#071224" />
                          <stop offset="100%" stopColor="#040914" />
                        </radialGradient>
                        <radialGradient id="ice-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.25)" />
                          <stop offset="80%" stopColor="rgba(56, 189, 248, 0.05)" />
                          <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                      </defs>

                      {/* Polar Sea Circle */}
                      <circle cx="250" cy="250" r="235" fill="url(#polar-sea)" stroke="#1e293b" strokeWidth="1.5" />

                      {/* Coordinate Rings */}
                      <circle cx="250" cy="250" r="190" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.25" />
                      <circle cx="250" cy="250" r="130" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.3" />
                      <circle cx="250" cy="250" r="70" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.35" />

                      {/* Crosshairs */}
                      <line x1="250" y1="15" x2="250" y2="485" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.2" />
                      <line x1="15" y1="250" x2="485" y2="250" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.2" />

                      {/* Coordinate Degree Labels */}
                      <text x="250" y="55" fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">0° Meridian</text>
                      <text x="250" y="455" fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">180° Meridian</text>
                      <text x="445" y="254" fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">90°E</text>
                      <text x="55" y="254" fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">90°W</text>

                      {/* Map Landmass Silhouette based on Region */}
                      {mapRegion === 'Antarctica' ? (
                        <g>
                          {/* Antarctic Ice Sheet Contour */}
                          <path
                            d="M 250 110 C 310 115, 390 170, 380 260 C 370 330, 310 400, 240 390 C 180 380, 120 310, 130 230 C 140 160, 190 105, 250 110 Z"
                            fill="url(#ice-glow)"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            opacity="0.85"
                          />
                          {/* Antarctic Peninsula Extension */}
                          <path
                            d="M 170 190 Q 130 140 110 100 Q 125 110 160 170 Z"
                            fill="#38bdf8"
                            opacity="0.4"
                          />
                          {/* Larsemann Hills & Amery Ice Shelf Bay */}
                          <path
                            d="M 340 230 Q 370 240 355 270 Q 330 250 340 230 Z"
                            fill="#00f2fe"
                            opacity="0.3"
                          />
                          {/* South Pole Centre Marker */}
                          <circle cx="250" cy="250" r="3" fill="#facc15" />
                          <text x="250" y="265" fill="#facc15" fontSize="8" fontFamily="monospace" textAnchor="middle">90°S South Pole</text>

                          {/* Station 1: Bharati Station (Larsemann Hills, East Antarctica - Approx 69.4°S, 76.2°E) */}
                          <g
                            className="cursor-pointer group"
                            onClick={() => {
                              const st = stations.find((s) => s.code === 'BHARATI');
                              if (st) setSelectedStation(st);
                            }}
                          >
                            <circle cx="345" cy="235" r="14" fill="rgba(0, 242, 254, 0.2)" className="animate-ping" />
                            <circle cx="345" cy="235" r="7" fill="#00f2fe" stroke="#ffffff" strokeWidth="2" />
                            <text x="360" y="232" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">BHARATI</text>
                            <text x="360" y="244" fill="#00f2fe" fontSize="8" fontFamily="monospace">69.4°S, 76.2°E (Active)</text>
                          </g>

                          {/* Station 2: Maitri Station (Schirmacher Oasis - Approx 70.8°S, 11.7°E) */}
                          <g
                            className="cursor-pointer group"
                            onClick={() => {
                              const st = stations.find((s) => s.code === 'MAITRI');
                              if (st) setSelectedStation(st);
                            }}
                          >
                            <circle cx="275" cy="155" r="14" fill="rgba(56, 189, 248, 0.2)" className="animate-ping" />
                            <circle cx="275" cy="155" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                            <text x="290" y="152" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">MAITRI</text>
                            <text x="290" y="164" fill="#38bdf8" fontSize="8" fontFamily="monospace">70.8°S, 11.7°E (Active)</text>
                          </g>

                          {/* Station 3: Dakshin Gangotri (Historical - Approx 70.1°S, 12.0°E) */}
                          <g
                            className="cursor-pointer group"
                            onClick={() => {
                              const st = stations.find((s) => s.code === 'DAKSHIN_GANGOTRI');
                              if (st) setSelectedStation(st);
                            }}
                          >
                            <circle cx="278" cy="140" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                            <text x="290" y="137" fill="#fbbf24" fontSize="9" fontWeight="bold" fontFamily="monospace">DAKSHIN GANGOTRI</text>
                            <text x="290" y="146" fill="#f59e0b" fontSize="7" fontFamily="monospace">(Historic 1983-1989)</text>
                          </g>
                        </g>
                      ) : (
                        <g>
                          {/* Arctic Svalbard / Kongsfjorden Contour */}
                          <path
                            d="M 230 180 C 280 170, 320 220, 290 280 C 260 320, 210 310, 190 260 C 180 210, 210 185, 230 180 Z"
                            fill="url(#ice-glow)"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            opacity="0.85"
                          />
                          {/* Spitsbergen Main Island */}
                          <path
                            d="M 225 210 Q 260 220 250 265 Q 220 255 225 210 Z"
                            fill="#38bdf8"
                            opacity="0.4"
                          />
                          {/* North Pole Marker */}
                          <circle cx="250" cy="250" r="3" fill="#facc15" />
                          <text x="250" y="265" fill="#facc15" fontSize="8" fontFamily="monospace" textAnchor="middle">90°N Geographic North Pole</text>

                          {/* Station 4: Himadri (Ny-Ålesund, Svalbard: 78.9°N, 11.9°E) */}
                          <g
                            className="cursor-pointer group"
                            onClick={() => {
                              const st = stations.find((s) => s.code === 'HIMADRI');
                              if (st) setSelectedStation(st);
                            }}
                          >
                            <circle cx="238" cy="225" r="14" fill="rgba(0, 242, 254, 0.25)" className="animate-ping" />
                            <circle cx="238" cy="225" r="7" fill="#00f2fe" stroke="#ffffff" strokeWidth="2" />
                            <text x="255" y="222" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">HIMADRI</text>
                            <text x="255" y="234" fill="#00f2fe" fontSize="8" fontFamily="monospace">Ny-Ålesund, Svalbard 78.9°N</text>
                          </g>

                          {/* Station 5: IndARC (Kongsfjorden Mooring: 78.98°N, 12.02°E) */}
                          <g
                            className="cursor-pointer group"
                            onClick={() => {
                              const st = stations.find((s) => s.code === 'INDARC');
                              if (st) setSelectedStation(st);
                            }}
                          >
                            <circle cx="248" cy="210" r="14" fill="rgba(16, 185, 129, 0.25)" className="animate-ping" />
                            <circle cx="248" cy="210" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                            <text x="265" y="207" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">IndARC MOORING</text>
                            <text x="265" y="219" fill="#34d399" fontSize="8" fontFamily="monospace">Fjord Depth -192m (MoES/NCPOR)</text>
                          </g>
                        </g>
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                    <span>Click any station marker above to inspect live telemetry and research</span>
                    <span className="text-cyan-400">NCPOR Polar Network</span>
                  </div>
                </div>

                {/* Right Side: Selected Station Telemetry Card */}
                {selectedStation && (
                  <div className="lg:col-span-5 glass-panel-glow p-6 rounded-3xl border border-cyan-500/30 space-y-5 shadow-2xl">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${getStationBadgeColor(selectedStation.code)}`}>
                            {selectedStation.code}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                            <Radio className="w-3 h-3 animate-pulse" />
                            {selectedStation.status.toUpperCase()}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-white">{selectedStation.name}</h2>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          Region: {selectedStation.region} • Est. {selectedStation.establishedYear} • Elev. {selectedStation.elevationMeters}m
                        </p>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-center flex-shrink-0">
                        <div className="text-[9px] font-mono text-slate-400 uppercase">Field Temp</div>
                        <div className="text-lg font-bold font-mono text-cyan-300">
                          {selectedStation.currentTempC}°C
                        </div>
                      </div>
                    </div>

                    {/* Mission Overview */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                        Mission & Installation Profile
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedStation.description}
                      </p>
                    </div>

                    {/* Scientific Focus Areas */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Primary Scientific Focus
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStation.focusAreas.map((area, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1"
                          >
                            <Layers className="w-3 h-3 text-cyan-400" />
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Active Payloads */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Active In-Situ Sensor Payloads
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {selectedStation.activeInstruments.map((inst, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-2"
                          >
                            <Activity className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span className="truncate">{inst}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/explorer/stations/${selectedStation.id}`}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Station Dossier & Timeline</span>
                      </Link>

                      <button
                        onClick={() => handleTeachMeStation(selectedStation)}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Teach Me This Station</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: STATIONS LIST VIEW                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'stations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations.map((st) => (
                <div
                  key={st.id}
                  className="glass-panel p-6 rounded-3xl border border-slate-800 glass-card-hover flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${getStationBadgeColor(st.code)}`}>
                        {st.code}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Established {st.establishedYear}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-white">{st.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {st.description}
                    </p>

                    <div className="space-y-1 text-xs font-mono text-slate-400">
                      <div>Coordinates: <span className="text-cyan-300">{st.latitude.toFixed(4)}°N, {st.longitude.toFixed(4)}°E</span></div>
                      <div>Elevation: <span className="text-slate-300">{st.elevationMeters} meters</span></div>
                      <div>Current Field Temp: <span className="text-cyan-400 font-bold">{st.currentTempC}°C</span></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      href={`/explorer/stations/${st.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700"
                    >
                      Dossier
                    </Link>

                    <button
                      onClick={() => handleTeachMeStation(st)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Teach Me This</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: EXPEDITIONS LIST VIEW                                              */}
          {/* ========================================================================= */}
          {activeTab === 'expeditions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expeditions.map((exp) => (
                  <div
                    key={exp.id}
                    className="glass-panel p-6 rounded-3xl border border-slate-800 glass-card-hover flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                          EXPEDITION YEAR {exp.year}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {exp.season}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white leading-snug">{exp.title}</h3>
                      <p className="text-xs font-mono text-cyan-400">
                        Expedition Leader: {exp.leader}
                      </p>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {exp.summary}
                      </p>

                      {/* Objectives */}
                      <div className="space-y-1.5 pt-2">
                        <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                          Key Scientific Objectives:
                        </h5>
                        <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                          {exp.objectives.map((obj, i) => (
                            <li key={i} className="line-clamp-1">{obj}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <Link
                        href={`/explorer/expeditions/${exp.id}`}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700"
                      >
                        Expedition Log
                      </Link>

                      <button
                        onClick={() => handleTeachMeExpedition(exp)}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Teach This Expedition</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: RESEARCH TOPICS BROWSER                                            */}
          {/* ========================================================================= */}
          {activeTab === 'topics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {topics.map((t) => (
                <div
                  key={t.id}
                  className="glass-panel p-6 rounded-3xl border border-slate-800 glass-card-hover flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                        {t.category.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {t.documentCount || 1} Linked Papers
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{t.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {t.keywords.map((kw: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <Link
                      href={`/?q=${encodeURIComponent(t.title)}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold border border-cyan-500/20 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </Link>

                    <button
                      onClick={() => handleTeachMeTopic(t.title, t.relatedDocumentIds)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Teach Me This Topic</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
