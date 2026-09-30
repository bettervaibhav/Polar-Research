import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
}

export function getStationBadgeColor(stationCode?: string): string {
  switch (stationCode?.toUpperCase()) {
    case 'BHARATI':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    case 'MAITRI':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'HIMADRI':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'INDARC':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    case 'DAKSHIN_GANGOTRI':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    default:
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  }
}
