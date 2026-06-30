/**
 * Support Responses Runner
 * Handles customer support agents across all industries.
 * Generates: FAQ answers, complaint response templates, appointment confirmation scripts.
 */

import { getAIClient } from "@/lib/aiClient";

export async function run(agent, config) {
  const businessName = config.businessName || "Our Business";
  const city         = config.city         || "India";
  const services     = config.services     || config.products || "";
  const timings      = config.timings      || "9 AM – 9 PM";

  const prompt = `You are a customer support expert for "${businessName}" in ${city}.
${services ? `Services: ${services}` : ""}
Business hours: ${timings}

Generate a complete support response template kit. Return ONLY valid JSON, no markdown:
{
  "results": [
    {
      "type": "content",
      "title": "Appointment Confirmation Message",
      "content": "WhatsApp message confirming an appointment. Include date/time placeholder, location, what to bring. Friendly and professional."
    },
    {
      "type": "content",
      "title": "Appointment Reminder (Day Before)",
      "content": "Reminder sent 1 day before appointment. Short, warm, includes cancellation instructions."
    },
    {
      "type": "content",
      "title": "Complaint Acknowledgment",
      "content": "Response to a customer complaint. Empathetic, professional, commits to resolution timeline."
    },
    {
      "type": "content",
      "title": "Service Unavailability Response",
      "content": "Polite message when a service is not available. Offers alternatives or next steps."
    },
    {
      "type": "content",
      "title": "Positive Feedback Thank You",
      "content": "Response to a customer who gave positive feedback. Genuine, asks for Google review."
    },
    {
      "type": "content",
      "title": "FAQ — Top 5 Questions",
      "content": "The top 5 most common customer questions with brief answers for ${businessName}. Format as Q: A: pairs."
    }
  ]
}`;

  const client = getAIClient();
  const res    = await client.messages.create({
    model:      "claude-fable-5",
    max_tokens: 2000,
    messages:   [{ role: "user", content: prompt }],
  });
  const raw = res.content?.[0]?.text || "";

  try {
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed  = JSON.parse(cleaned);
    return parsed.results || [];
  } catch {
    return [{ type: "content", title: "Support Templates", content: raw }];
  }
}
