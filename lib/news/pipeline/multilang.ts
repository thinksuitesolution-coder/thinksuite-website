import OpenAI from 'openai';
import { BlogArticle } from '../types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });

export type SupportedLanguage = 'hi' | 'es' | 'fr' | 'ar' | 'de' | 'ja' | 'pt' | 'zh';

export const LANGUAGE_CONFIG: Record<SupportedLanguage, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  hi: { name: 'Hindi',      nativeName: 'हिंदी',     dir: 'ltr' },
  es: { name: 'Spanish',    nativeName: 'Español',   dir: 'ltr' },
  fr: { name: 'French',     nativeName: 'Français',  dir: 'ltr' },
  ar: { name: 'Arabic',     nativeName: 'العربية',   dir: 'rtl' },
  de: { name: 'German',     nativeName: 'Deutsch',   dir: 'ltr' },
  ja: { name: 'Japanese',   nativeName: '日本語',     dir: 'ltr' },
  pt: { name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  zh: { name: 'Chinese',    nativeName: '中文',       dir: 'ltr' },
};

export interface TranslatedArticle {
  lang: SupportedLanguage;
  langName: string;
  dir: 'ltr' | 'rtl';
  slug: string;          // original-slug-hi, original-slug-es
  title: string;
  summary: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keyHighlights: string[];
  whyItMatters: string;
  faqs: { question: string; answer: string }[];
}

export async function translateArticle(
  article: BlogArticle,
  lang: SupportedLanguage
): Promise<TranslatedArticle | null> {
  const config = LANGUAGE_CONFIG[lang];

  try {
    const prompt = `You are an expert AI news journalist fluent in ${config.name}.

Translate and localize this AI news article into ${config.name}.
Maintain the technical accuracy, journalistic tone, and all key information.
Use natural, native-sounding ${config.name}, not a literal translation.

Original Article:
Title: ${article.title}
Summary: ${article.summary}
Content (first 1500 chars): ${article.content.slice(0, 1500)}
Key Highlights: ${article.keyHighlights?.join(' | ')}
Why It Matters: ${article.whyItMatters}
FAQs: ${JSON.stringify(article.faqs?.slice(0, 3))}

Return ONLY JSON:
{
  "title": "Translated title in ${config.name}",
  "summary": "Translated summary",
  "content": "Full translated content in markdown (keep ## headings, bullet points)",
  "metaTitle": "SEO meta title in ${config.name} (max 60 chars)",
  "metaDescription": "SEO meta description in ${config.name} (max 155 chars)",
  "keyHighlights": ["Highlight 1 in ${config.name}", "Highlight 2", "Highlight 3"],
  "whyItMatters": "Why it matters in ${config.name}",
  "faqs": [{"question": "Q in ${config.name}?", "answer": "A in ${config.name}"}]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content || '{}';
    const data = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());

    return {
      lang,
      langName: config.name,
      dir: config.dir,
      slug: `${article.slug}-${lang}`,
      title: data.title || article.title,
      summary: data.summary || article.summary,
      content: data.content || article.content,
      metaTitle: data.metaTitle || data.title || '',
      metaDescription: data.metaDescription || data.summary || '',
      keyHighlights: data.keyHighlights || article.keyHighlights || [],
      whyItMatters: data.whyItMatters || article.whyItMatters || '',
      faqs: data.faqs || article.faqs || [],
    };
  } catch (err) {
    console.error(`Translation to ${lang} failed:`, (err as Error).message);
    return null;
  }
}

// Translate high-importance articles to priority languages
export async function translateArticleToAllLanguages(
  article: BlogArticle,
  languages: SupportedLanguage[] = ['hi', 'es', 'fr']
): Promise<TranslatedArticle[]> {
  const results = await Promise.allSettled(
    languages.map(lang => translateArticle(article, lang))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<TranslatedArticle | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((r): r is TranslatedArticle => r !== null);
}
