'use client';

import { useState } from 'react';
import { BlogArticle } from '@/lib/news/types';

interface TranslatedData {
  title: string;
  summary: string;
  content: string;
  keyHighlights: string[];
  whyItMatters: string;
  futurePrediction: string;
}

interface Props {
  article: Partial<BlogArticle>;
  onTranslated: (data: TranslatedData | null) => void;
  isTranslated: boolean;
}

export default function TranslateWidget({ article, onTranslated, isTranslated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleTranslate() {
    if (isTranslated) {
      onTranslated(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/blog/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          summary: article.summary,
          content: article.content,
          keyHighlights: article.keyHighlights,
          whyItMatters: article.whyItMatters,
          futurePrediction: article.futurePrediction,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Translation failed');
      onTranslated(data.translated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="translate-widget">
      <button
        className={`translate-btn ${isTranslated ? 'translated' : ''} ${loading ? 'loading' : ''}`}
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="translate-spinner" />
            Translating to Hinglish...
          </>
        ) : isTranslated ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
            Show Original (English)
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
            Translate to Hinglish
          </>
        )}
      </button>
      {error && <span className="translate-error">{error}</span>}
      {isTranslated && (
        <span className="translate-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Hinglish version
        </span>
      )}
    </div>
  );
}
