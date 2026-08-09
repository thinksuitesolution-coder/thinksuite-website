/**
 * Standalone entry point for the AI-news pipeline.
 *
 * Runs `runNewsPipeline()` outside of Next/Vercel so the scheduled fetch costs
 * nothing: GitHub Actions executes this on its own runners and the articles go
 * straight into Turso. Vercel only ever reads. The old `/api/cron/fetch-news`
 * route still works for manual triggers, but nothing schedules it any more.
 */
import { runNewsPipeline } from '../lib/news/orchestrator';

async function main() {
  const required = ['TURSO_DATABASE_URL', 'GROQ_API_KEY'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }

  const result = await runNewsPipeline();
  console.log('[Pipeline] Done:', JSON.stringify(result));

  // A run that collects nothing means every source failed — surface it as a
  // red build instead of a silent no-op that nobody notices for a week.
  if (result.collected === 0) {
    console.error('[Pipeline] Collected 0 events — every source failed.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Pipeline] Error:', err);
  process.exit(1);
});
