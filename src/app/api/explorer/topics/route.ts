import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ResearchTopic, Document } from '@/types';

export async function GET() {
  try {
    const topics: ResearchTopic[] = db.getTopics();
    const docs: Document[] = db.getDocuments();

    // Attach count of related documents to each topic
    const enrichedTopics = topics.map((t: ResearchTopic) => {
      const related = docs.filter((d: Document) =>
        t.keywords.some((kw: string) =>
          d.title.toLowerCase().includes(kw.toLowerCase()) ||
          d.keywords.some((dkw: string) => dkw.toLowerCase().includes(kw.toLowerCase()))
        )
      );
      return {
        ...t,
        documentCount: related.length,
        relatedDocumentIds: related.map((d: Document) => d.id),
      };
    });

    return NextResponse.json(enrichedTopics);
  } catch (err: any) {
    console.error('[API Topics Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
