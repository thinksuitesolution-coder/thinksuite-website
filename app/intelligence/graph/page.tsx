import type { Metadata } from 'next';
import GraphPageClient from './GraphPageClient';

export const metadata: Metadata = {
  title: 'AI Knowledge Graph: Visual Industry Map | ThinkSuite',
  description: 'Explore an interactive knowledge graph of the AI industry, mapping companies, models, technologies, and people and how they are all interconnected.',
  keywords: [
    'AI knowledge graph',
    'AI industry visual map',
    'AI companies relationship graph',
    'AI models and technologies map',
    'interactive AI graph tool',
    'visualize AI industry connections',
    'AI ecosystem map',
  ],
};

export default function GraphPage() {
  return <GraphPageClient />;
}
