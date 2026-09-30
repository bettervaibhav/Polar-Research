import { getAIProvider } from '../ai/provider-factory';
import { GeneratedContentItem, ContentType } from '@/types/media';
import { db } from '@/lib/db';

export interface GenerateMediaRequest {
  topic: string;
  documentIds: string[];
  targetFormats: ContentType[];
}

export class MediaGenerator {
  public async generateMedia(req: GenerateMediaRequest): Promise<GeneratedContentItem[]> {
    const aiProvider = getAIProvider();
    const allDocs = db.getDocuments();
    const sourceDocs = allDocs
      .filter((d) => req.documentIds.includes(d.id))
      .map((d) => ({
        id: d.id,
        title: d.title,
        abstract: d.abstract,
        content: d.content,
      }));

    const items = await aiProvider.generateMediaContent({
      topic: req.topic,
      sourceDocuments: sourceDocs.length > 0 ? sourceDocs : allDocs.slice(0, 2),
      targetFormats: req.targetFormats,
    });

    // Save generated media artifacts to database
    items.forEach((item) => db.saveGeneratedContent(item));

    return items;
  }

  public getGeneratedItems(): GeneratedContentItem[] {
    return db.getGeneratedContent();
  }

  public updateStatus(id: string, status: GeneratedContentItem['status']): GeneratedContentItem | undefined {
    return db.updateContentStatus(id, status);
  }
}

export const mediaGenerator = new MediaGenerator();
