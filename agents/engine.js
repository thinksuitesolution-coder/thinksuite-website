/**
 * Thinksuite Agent Engine — Central Orchestrator
 *
 * Loads the right runner based on the agent's department,
 * executes it, stores results in Firestore, and triggers delivery.
 */

import { getAdminDb } from "@/lib/firebaseAdmin";
import { sendWhatsApp } from "@/lib/integrations/whatsapp";

/* ── Runner registry ──────────────────────────────────────────────────────── */
const RUNNERS = {
  marketing:  () => import("@/agents/runners/content-marketing").then(m => m.run),
  sales:      () => import("@/agents/runners/sales-leads").then(m => m.run),
  support:    () => import("@/agents/runners/support-responses").then(m => m.run),
  hr:         () => import("@/agents/runners/sales-leads").then(m => m.run),     // reuse sales runner for now
  operations: () => import("@/agents/runners/content-marketing").then(m => m.run), // generic content
  finance:    () => import("@/agents/runners/support-responses").then(m => m.run), // generic content
  legal:      () => import("@/agents/runners/support-responses").then(m => m.run), // generic content
};

/**
 * Run a single agent for a single user.
 * @param {string} userId
 * @param {string} agentId  — productId from marketplace catalog
 * @returns {{ success: boolean, resultCount: number, error?: string }}
 */
export async function runAgent(userId, agentId) {
  const db = getAdminDb();

  try {
    // 1. Load agent record
    const agentRef  = db.collection("users").doc(userId).collection("active_agents").doc(agentId);
    const agentSnap = await agentRef.get();

    if (!agentSnap.exists) throw new Error(`Agent ${agentId} not found for user ${userId}`);

    const agent  = { id: agentSnap.id, ...agentSnap.data() };
    const config = agent.config || {};

    if (!config.businessName) {
      return { success: false, error: "Agent not configured — businessName missing", resultCount: 0 };
    }

    // 2. Pick runner
    const getRunner = RUNNERS[agent.department] || RUNNERS.marketing;
    const runner    = await getRunner();

    // 3. Execute
    const results = await runner(agent, config);

    // 4. Store results in Firestore
    const runAt    = Date.now();
    const runRef   = db.collection("users").doc(userId).collection("agent_results").doc();
    const deliveredVia = ["dashboard"];

    // 5. WhatsApp delivery
    if (config.whatsappPhone && process.env.WHATSAPP_PHONE_ID && process.env.WHATSAPP_TOKEN) {
      try {
        const summary = buildWhatsAppSummary(agent, results);
        await sendWhatsApp(config.whatsappPhone, summary);
        deliveredVia.push("whatsapp");
      } catch (e) {
        console.warn("[engine] WhatsApp delivery failed:", e.message);
      }
    }

    await runRef.set({ userId, agentId, agent: { name: agent.productName, icon: agent.icon }, results, runAt, deliveredVia });

    // 6. Update agent run count + lastRunAt
    await agentRef.update({ runCount: (agent.runCount || 0) + 1, lastRunAt: runAt });

    return { success: true, resultCount: results.length };
  } catch (err) {
    console.error("[engine] runAgent error:", err);
    return { success: false, error: err.message, resultCount: 0 };
  }
}

/**
 * Run all active agents for all users — called by Vercel cron.
 * Returns a summary log.
 */
export async function runAllAgents() {
  const db  = getAdminDb();
  const log = [];

  // Get all users who have active agents
  const usersSnap = await db.collection("users").listDocuments();

  for (const userRef of usersSnap) {
    const agentsSnap = await userRef.collection("active_agents")
      .where("status", "==", "active")
      .get();

    for (const agentDoc of agentsSnap.docs) {
      const agent = agentDoc.data();
      // Only run if agent has a schedule matching "morning" (or "daily")
      if (!agent.config?.businessName) continue; // skip unconfigured

      const result = await runAgent(userRef.id, agentDoc.id);
      log.push({ userId: userRef.id, agentId: agentDoc.id, ...result });
    }
  }

  return log;
}

function buildWhatsAppSummary(agent, results) {
  const lines = [
    `🤖 *Thinksuite — ${agent.productName}*`,
    `📅 ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`,
    "",
    `✅ ${results.length} results ready on your dashboard`,
    "",
  ];

  // Add first 2 results inline for quick view
  results.slice(0, 2).forEach((r, i) => {
    lines.push(`*${i + 1}. ${r.title}*`);
    lines.push(r.content.slice(0, 200) + (r.content.length > 200 ? "..." : ""));
    lines.push("");
  });

  if (results.length > 2) {
    lines.push(`_${results.length - 2} more results on dashboard →_`);
  }

  lines.push("Thinksuite.in/dashboard/my-agents");
  return lines.join("\n");
}
