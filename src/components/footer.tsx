import Link from 'next/link';
import { Shield, Snowflake } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white tracking-wider">POLAR SENSE AI</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            An integrated polar science knowledge platform, grounded research assistant, and interactive AI teaching environment.
          </p>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
            <Shield className="w-3.5 h-3.5" />
            <span>Strict Citation & Grounding Protocol</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Polar Stations & Observatories</h4>
          <ul className="space-y-2 text-slate-400 text-xs">
            <li><Link href="/explorer?station=BHARATI" className="hover:text-cyan-400 transition-colors">Bharati Station (Larsemann Hills, Antarctica)</Link></li>
            <li><Link href="/explorer?station=MAITRI" className="hover:text-cyan-400 transition-colors">Maitri Station (Schirmacher Oasis, Antarctica)</Link></li>
            <li><Link href="/explorer?station=HIMADRI" className="hover:text-cyan-400 transition-colors">Himadri Station (Ny-Ålesund, Arctic)</Link></li>
            <li><Link href="/explorer?station=INDARC" className="hover:text-cyan-400 transition-colors">IndARC Mooring (Kongsfjorden Fjord, Arctic)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Platform Capabilities</h4>
          <ul className="space-y-2 text-slate-400 text-xs">
            <li><Link href="/repository" className="hover:text-cyan-400 transition-colors">Grounded Research Repository</Link></li>
            <li><Link href="/teaching-room" className="hover:text-cyan-400 transition-colors">Interactive AI Teaching Room</Link></li>
            <li><Link href="/tutor" className="hover:text-cyan-400 transition-colors">AI Lesson Generator</Link></li>
            <li><Link href="/media-studio" className="hover:text-cyan-400 transition-colors">Media Outreach Studio</Link></li>
            <li><Link href="/admin" className="hover:text-cyan-400 transition-colors">Admin Governance & Telemetry</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Scientific Provenance</h4>
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            Grounded on peer-reviewed research papers and expedition logs published by polar research institutions and observatories.
          </p>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
            Status: <span className="text-emerald-400">Verified Grounding Active</span><br />
            Hallucination Guardrails: <span className="text-cyan-400">Enforced</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
        <div>© 2026 Polar Sense AI. All rights reserved.</div>
        <div className="flex items-center gap-1 mt-2 sm:mt-0">
          <span>Polar Research & Learning Platform</span>
        </div>
      </div>
    </footer>
  );
}
