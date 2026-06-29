import { RawEvent } from '../types';
import { GITHUB_REPOS } from '../sources';
import { v4 as uuidv4 } from 'uuid';

const GITHUB_API = 'https://api.github.com';
const headers: Record<string, string> = {
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'ThinkSuite-AI-News-Bot',
};

if (process.env.GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function getRecentRelease(repo: string): Promise<RawEvent | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${repo}/releases/latest`, { headers });
    if (!res.ok) return null;

    const release = await res.json();
    if (!release.published_at) return null;

    const publishedDate = new Date(release.published_at);
    const hoursAgo = (Date.now() - publishedDate.getTime()) / 36e5;
    if (hoursAgo > 24) return null; // Only last 24h

    const [owner, repoName] = repo.split('/');

    return {
      id: uuidv4(),
      source: 'github',
      sourceName: `GitHub - ${repo}`,
      title: `${repoName} ${release.tag_name} Released, ${release.name || 'New Release'}`,
      url: release.html_url,
      content: (release.body || '').slice(0, 2000),
      publishedAt: release.published_at,
    };
  } catch {
    return null;
  }
}

async function getTrendingAIRepos(): Promise<RawEvent[]> {
  try {
    const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    const res = await fetch(
      `${GITHUB_API}/search/repositories?q=topic:ai+topic:llm+created:>${yesterday}&sort=stars&order=desc&per_page=5`,
      { headers }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data.items || []).map((repo: Record<string, unknown>) => ({
      id: uuidv4(),
      source: 'github-trending',
      sourceName: 'GitHub Trending AI',
      title: `New AI Project Trending on GitHub: ${repo.name}, ${repo.stargazers_count}★`,
      url: repo.html_url as string,
      content: `${repo.description || ''}\n\nStars: ${repo.stargazers_count} | Language: ${repo.language || 'Unknown'}`.slice(0, 1000),
      publishedAt: repo.created_at as string,
    }));
  } catch {
    return [];
  }
}

export async function fetchGitHubEvents(): Promise<RawEvent[]> {
  const [releases, trending] = await Promise.all([
    Promise.allSettled(GITHUB_REPOS.map(getRecentRelease)),
    getTrendingAIRepos(),
  ]);

  const recentReleases = releases
    .filter((r): r is PromiseFulfilledResult<RawEvent | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((r): r is RawEvent => r !== null);

  return [...recentReleases, ...trending];
}
