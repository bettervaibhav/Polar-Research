import { AIProvider } from './ai-provider';
import { DemoProvider } from './demo-provider';
import { GeminiProvider } from './gemini-provider';
import { OpenAIProvider } from './openai-provider';

let cachedProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const configuredProvider = (process.env.AI_PROVIDER || 'demo').toLowerCase();
  const appMode = (process.env.APP_MODE || 'demo').toLowerCase();

  if (appMode === 'demo' || configuredProvider === 'demo') {
    cachedProvider = new DemoProvider();
    return cachedProvider;
  }

  if (configuredProvider === 'gemini') {
    const gemini = new GeminiProvider();
    if (gemini.isAvailable()) {
      cachedProvider = gemini;
      return cachedProvider;
    }
  }

  if (configuredProvider === 'openai') {
    const openai = new OpenAIProvider();
    if (openai.isAvailable()) {
      cachedProvider = openai;
      return cachedProvider;
    }
  }

  // Default fallback
  cachedProvider = new DemoProvider();
  return cachedProvider;
}

export interface SystemAIStatus {
  appMode: 'demo' | 'live';
  requestedProvider: string;
  activeProvider: string;
  model: string;
  apiKeyConfigured: boolean;
  rag: 'operational' | 'degraded';
  database: 'local' | 'postgresql';
  fallback: boolean;
}

export function getSystemAIStatus(): SystemAIStatus {
  const configuredProvider = (process.env.AI_PROVIDER || 'demo').toLowerCase();
  const appMode = (process.env.APP_MODE || (configuredProvider === 'demo' ? 'demo' : 'live')).toLowerCase() as 'demo' | 'live';
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let activeProvider = 'demo';
  let model = 'DemoProvider-Deterministic-v1';
  let apiKeyConfigured = false;
  let fallback = false;

  if (configuredProvider === 'gemini') {
    apiKeyConfigured = Boolean(geminiKey && geminiKey.trim().length > 0);
    if (apiKeyConfigured && appMode !== 'demo') {
      activeProvider = 'gemini';
      model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
    } else {
      activeProvider = 'demo';
      fallback = true;
    }
  } else if (configuredProvider === 'openai') {
    apiKeyConfigured = Boolean(openaiKey && openaiKey.trim().length > 0);
    if (apiKeyConfigured && appMode !== 'demo') {
      activeProvider = 'openai';
      model = 'gpt-4o-mini';
    } else {
      activeProvider = 'demo';
      fallback = true;
    }
  }

  return {
    appMode,
    requestedProvider: configuredProvider,
    activeProvider,
    model,
    apiKeyConfigured,
    rag: 'operational',
    database: 'local',
    fallback: configuredProvider !== 'demo' && activeProvider === 'demo',
  };
}
