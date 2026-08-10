/**
 * Standalone entry point for the AI-news pipeline.
 *
 * Runs `runNewsPipeline()` outside of Next/Vercel so the scheduled fetch costs
 * nothing: GitHub Actions executes this on its own runners and the articles go
 * straight into Turso. Vercel only ever reads — `/api/cron/fetch-news` is a 410
 * now, precisely so nothing can start this pipeline on a billed function again.
 */
import { runNewsPipeline } from '../lib/news/orchestrator';

async function main() {
  const required = ['TURSO_DATABASE_URL', 'GROQ_API_KEY'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    return 1;
  }

  const result = await runNewsPipeline();
  console.log('[Pipeline] Done:', JSON.stringify(result));

  // A run that collects nothing means every source failed — surface it as a
  // red build instead of a silent no-op that nobody notices for a week.
  if (result.collected === 0) {
    console.error('[Pipeline] Collected 0 events — every source failed.');
    return 1;
  }

  // Collecting fine but publishing nothing means the LLM chain is exhausted or
  // misconfigured. That is the failure that actually starves the site, so it
  // must not pass as a green run.
  if (result.published === 0 && result.afterProcessedFilter > 0) {
    console.error(
      `[Pipeline] Published 0 of ${result.afterProcessedFilter} candidates ` +
        `(${result.failed} failed) — check LLM keys and rate limits.`,
    );
    return 1;
  }

  return 0;
}

// The libSQL client keeps its connection open, so the event loop never drains
// and the process hangs after main() resolves — a finished run then sat idle
// until the job timeout killed it, burning ~7 min of Actions budget per run and
// reporting "cancelled". Exit explicitly on the way out.
main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('[Pipeline] Error:', err);
    process.exit(1);
  });
