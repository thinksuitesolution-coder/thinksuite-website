import { RawEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

// HuggingFace has a free public API
const HF_API = 'https://huggingface.co/api';

interface HFModel {
  id: string;
  modelId: string;
  lastModified: string;
  downloads: number;
  likes: number;
  tags: string[];
  cardData?: { language?: string[]; license?: string };
}

export async function fetchHuggingFaceReleases(): Promise<RawEvent[]> {
  try {
    const yesterday = new Date(Date.now() - 864e5).toISOString();
    const res = await fetch(
      `${HF_API}/models?sort=lastModified&direction=-1&limit=20&full=true`,
      { headers: { 'User-Agent': 'ThinkSuite-AI-News-Bot' } }
    );

    if (!res.ok) return [];
    const models: HFModel[] = await res.json();

    const recentPopular = models.filter(m => {
      const isRecent = m.lastModified > yesterday;
      const isPopular = m.downloads > 1000 || m.likes > 50;
      const isLLM = m.tags?.some(t =>
        ['text-generation', 'text2text-generation', 'conversational', 'llm'].includes(t)
      );
      return isRecent && (isPopular || isLLM);
    });

    return recentPopular.slice(0, 8).map(model => ({
      id: uuidv4(),
      source: 'huggingface',
      sourceName: 'HuggingFace',
      title: `New AI Model on HuggingFace: ${model.modelId}`,
      url: `https://huggingface.co/${model.modelId}`,
      content: `Downloads: ${model.downloads.toLocaleString()} | Likes: ${model.likes}\nTags: ${(model.tags || []).slice(0, 6).join(', ')}`,
      publishedAt: model.lastModified,
    }));
  } catch (err) {
    console.error('HuggingFace fetch failed:', (err as Error).message);
    return [];
  }
}

export async function fetchHuggingFaceSpaces(): Promise<RawEvent[]> {
  try {
    const res = await fetch(
      `${HF_API}/spaces?sort=likes&direction=-1&limit=10`,
      { headers: { 'User-Agent': 'ThinkSuite-AI-News-Bot' } }
    );

    if (!res.ok) return [];
    const spaces = await res.json();
    const yesterday = new Date(Date.now() - 864e5).toISOString();

    return spaces
      .filter((s: HFModel) => s.lastModified > yesterday && s.likes > 20)
      .slice(0, 5)
      .map((space: HFModel) => ({
        id: uuidv4(),
        source: 'huggingface-spaces',
        sourceName: 'HuggingFace Spaces',
        title: `Trending AI Demo on HuggingFace Spaces: ${space.id}`,
        url: `https://huggingface.co/spaces/${space.id}`,
        content: `Likes: ${space.likes} | Tags: ${(space.tags || []).slice(0, 5).join(', ')}`,
        publishedAt: space.lastModified,
      }));
  } catch {
    return [];
  }
}
