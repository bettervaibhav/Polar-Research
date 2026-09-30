import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export interface SearchResultItem {
  id: string;
  type: 'document' | 'station' | 'expedition' | 'topic' | 'lesson';
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
  badgeColor?: string;
  matchSnippet?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], query });
    }

    const results: SearchResultItem[] = [];

    // 1. Search Documents
    const docs = db.getDocuments();
    for (const doc of docs) {
      if (
        doc.title.toLowerCase().includes(query) ||
        doc.abstract.toLowerCase().includes(query) ||
        doc.keywords.some((k) => k.toLowerCase().includes(query)) ||
        doc.authors.some((a) => a.toLowerCase().includes(query)) ||
        doc.stationCode?.toLowerCase().includes(query)
      ) {
        results.push({
          id: doc.id,
          type: 'document',
          title: doc.title,
          subtitle: `${doc.stationCode || 'NCPOR'} • ${doc.year} • ${doc.authors.slice(0, 2).join(', ')}`,
          url: `/repository/${doc.id}`,
          badge: 'Research Paper',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          matchSnippet: doc.abstract.slice(0, 140) + '...',
        });
      }
    }

    // 2. Search Research Stations
    const stations = db.getStations();
    for (const st of stations) {
      if (
        st.name.toLowerCase().includes(query) ||
        st.code.toLowerCase().includes(query) ||
        st.region.toLowerCase().includes(query) ||
        st.description.toLowerCase().includes(query) ||
        st.focusAreas.some((fa) => fa.toLowerCase().includes(query))
      ) {
        results.push({
          id: st.id,
          type: 'station',
          title: st.name,
          subtitle: `${st.region} • Est. ${st.establishedYear} • Field Temp: ${st.currentTempC}°C`,
          url: `/explorer/stations/${st.id}`,
          badge: 'Station',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          matchSnippet: st.description.slice(0, 140) + '...',
        });
      }
    }

    // 3. Search Expeditions
    const expeditions = db.getExpeditions();
    for (const exp of expeditions) {
      if (
        exp.title.toLowerCase().includes(query) ||
        exp.leader.toLowerCase().includes(query) ||
        exp.summary.toLowerCase().includes(query) ||
        exp.objectives.some((obj) => obj.toLowerCase().includes(query))
      ) {
        results.push({
          id: exp.id,
          type: 'expedition',
          title: exp.title,
          subtitle: `Year ${exp.year} • Leader: ${exp.leader} • ${exp.season}`,
          url: `/explorer/expeditions/${exp.id}`,
          badge: 'Expedition',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          matchSnippet: exp.summary.slice(0, 140) + '...',
        });
      }
    }

    // 4. Search Research Topics
    const topics = db.getTopics();
    for (const top of topics) {
      if (
        top.title.toLowerCase().includes(query) ||
        top.category.toLowerCase().includes(query) ||
        top.description.toLowerCase().includes(query) ||
        top.keywords.some((kw) => kw.toLowerCase().includes(query))
      ) {
        results.push({
          id: top.id,
          type: 'topic',
          title: top.title,
          subtitle: `Category: ${top.category} • Keywords: ${top.keywords.slice(0, 3).join(', ')}`,
          url: `/explorer?tab=topics`,
          badge: 'Research Topic',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          matchSnippet: top.description.slice(0, 140) + '...',
        });
      }
    }

    // 5. Search Curriculum Lessons
    const lessons = db.getLessons();
    for (const les of lessons) {
      if (
        les.title.toLowerCase().includes(query) ||
        les.topic.toLowerCase().includes(query) ||
        les.summary.toLowerCase().includes(query)
      ) {
        results.push({
          id: les.id,
          type: 'lesson',
          title: les.title,
          subtitle: `${les.learnerLevel.toUpperCase()} Level • ${les.sections.length} Animated Sections`,
          url: `/teaching-room`,
          badge: 'Interactive Lesson',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          matchSnippet: les.summary.slice(0, 140) + '...',
        });
      }
    }

    return NextResponse.json({
      query,
      count: results.length,
      results: results.slice(0, 20),
    });
  } catch (err: any) {
    console.error('[API Search Error]', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
