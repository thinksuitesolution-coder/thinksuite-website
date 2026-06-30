import { groqJSON, groqJSONFast } from '../../llm';
import { BlogArticle } from '../types';

export type UserRole = 'developer' | 'founder' | 'investor' | 'marketer';

export interface PersonalizedVersion {
  role: UserRole;
  headline: string;
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
  fullSection: string;
}

const ROLE_PROMPTS: Record<UserRole, string> = {
  developer: 'Focus on: APIs, SDKs, code changes, technical architecture, performance benchmarks, integration guides, what code needs to change.',
  founder: 'Focus on: business model implications, market opportunities, competitive threats, product strategy, what to build next, operational impact.',
  investor: 'Focus on: valuation impact, market size, revenue potential, competitive moats, funding implications, M&A angles, portfolio risk.',
  marketer: 'Focus on: messaging opportunities, audience trends, content angles, campaign ideas, brand positioning, customer behavior shifts.',
};

export async function generatePersonalizedVersions(
  article: Partial<BlogArticle>
): Promise<PersonalizedVersion[]> {
  const roles: UserRole[] = ['developer', 'founder', 'investor', 'marketer'];
  const versions: PersonalizedVersion[] = [];

  for (const role of roles) {
    try {
      const prompt = `You are writing a personalized AI news summary for a ${role}.

${ROLE_PROMPTS[role]}

Original article:
Title: ${article.title}
Content: ${article.content?.slice(0, 800)}

Generate a role-specific version as JSON:
{
  "headline": "Role-specific headline that speaks directly to a ${role}",
  "summary": "2-sentence summary from a ${role}'s perspective",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "actionItems": ["What should this ${role} do right now", "Action 2", "Action 3"],
  "fullSection": "150-word section specifically for ${role}s explaining why this matters to them"
}`;

      const data = await groqJSONFast(prompt, 500);
      versions.push({ role, ...data } as PersonalizedVersion);

      await new Promise(r => setTimeout(r, 300));
    } catch {
      versions.push({
        role,
        headline: article.title || '',
        summary: article.summary || '',
        keyTakeaways: article.keyHighlights?.slice(0, 3) || [],
        actionItems: ['Review the full article for implications'],
        fullSection: article.summary || '',
      });
    }
  }

  return versions;
}
