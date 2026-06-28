import type { Metadata } from 'next';
import GraphPageClient from './GraphPageClient';

export const metadata: Metadata = {
  title: 'AI Knowledge Graph | ThinkSuite Intelligence',
  description: 'Interactive knowledge graph of the AI industry: companies, models, technologies, people, and their interconnections visualized.',
};

export default function GraphPage() {
  return <GraphPageClient />;
}
