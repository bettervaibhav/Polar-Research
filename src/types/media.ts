export type ContentType =
  | 'web_article'
  | 'executive_brief'
  | 'social_thread'
  | 'infographic_spec'
  | 'video_script';

export type ContentStatus = 'draft' | 'under_review' | 'approved' | 'published';

export interface WebArticleContent {
  headline: string;
  subheadline: string;
  readingTimeMin: number;
  body: string;
  keyTakeaways: string[];
}

export interface ExecutiveBriefContent {
  policyTitle: string;
  strategicContext: string;
  keyFindings: string[];
  policyImplications: string[];
  scientificConfidence: string;
}

export interface SocialThreadContent {
  platform: 'twitter' | 'linkedin';
  hook: string;
  posts: string[];
  hashtags: string[];
}

export interface InfographicSpecContent {
  title: string;
  visualTheme: string;
  keyMetrics: { label: string; value: string; unit?: string }[];
  flowchartNodes: { id: string; label: string; subtext?: string }[];
  colorPalette: string[];
}

export interface VideoScriptScene {
  timecode: string;
  visualDescription: string;
  audioNarration: string;
  onScreenText?: string;
  soundEffectCue?: string;
}

export interface VideoScriptContent {
  title: string;
  targetDurationSec: number;
  scenes: VideoScriptScene[];
  callToAction: string;
}

export interface GeneratedContentItem {
  id: string;
  contentType: ContentType;
  title: string;
  data:
    | WebArticleContent
    | ExecutiveBriefContent
    | SocialThreadContent
    | InfographicSpecContent
    | VideoScriptContent;
  sourceDocumentIds: string[];
  sourceTitles: string[];
  modelUsed: string;
  status: ContentStatus;
  createdAt: string;
}
