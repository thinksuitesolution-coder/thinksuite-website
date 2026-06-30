import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/aiClient";
import { validateTriggerLeads } from "@/lib/triggerLeadValidator";
import { verifyUser } from "@/lib/authUtils";
import { checkLeadQuota, incrementLeadQuota, saveLeadHistory } from "@/lib/leadGenQuota";

const client = getAIClient();

const JOB_TO_SERVICE_MAP = {
  "digital-marketing-manager": { service: "Digital Marketing / SEO / Ads", pitch: "hiring a Digital Marketing Manager they clearly need agency-level expertise", budget: "₹15,000-50,000/month" },
  "social-media-manager": { service: "Social Media Management", pitch: "hiring in-house social media pitch your managed social services as a cost-effective alternative", budget: "₹10,000-30,000/month" },
  "react-developer": { service: "Web App / SaaS Development", pitch: "building a React product they need a dev partner for faster delivery", budget: "₹30,000-1,50,000/project" },
  "nodejs-developer": { service: "Backend API / SaaS Development", pitch: "scaling their backend position your team as their dev agency", budget: "₹25,000-1,00,000/month" },
  "graphic-designer": { service: "Branding / Creative Design", pitch: "hiring a designer offer agency branding at lower cost than full-time employee", budget: "₹8,000-25,000/month" },
  "content-writer": { service: "Content Marketing / Blogging", pitch: "investing in content pitch SEO content + distribution bundle", budget: "₹10,000-35,000/month" },
  "sales-executive": { service: "CRM / Lead Generation / Sales Automation", pitch: "scaling their sales team offer CRM setup + lead gen to supercharge their reps", budget: "₹5,000-20,000/month" },
  "hr-manager": { service: "HRMS Software / Payroll", pitch: "hiring HR pitch automated payroll + HRMS to save 60% of HR time", budget: "₹3,000-15,000/month" },
  "accountant": { service: "GST Software / Accounting Automation", pitch: "hiring an accountant pitch automated GST + accounting at fraction of salary cost", budget: "₹2,000-8,000/month" },
  "customer-support": { service: "WhatsApp Chatbot / Helpdesk Software", pitch: "scaling support offer AI chatbot that handles 80% of queries automatically", budget: "₹5,000-20,000/month" },
  "ecommerce-manager": { service: "E-commerce / Shopify / Website", pitch: "building ecommerce presence pitch full ecomm setup + digital marketing", budget: "₹20,000-80,000/month" },
  "data-analyst": { service: "Business Intelligence / Analytics Dashboard", pitch: "investing in data offer custom analytics dashboard + automated reporting", budget: "₹15,000-60,000/month" },
  "seo-specialist": { service: "SEO / Content Marketing", pitch: "hiring in-house SEO pitch agency SEO with 3x more resources at same cost", budget: "₹10,000-40,000/month" },
  "ui-ux-designer": { service: "UI/UX Design / Website Revamp", pitch: "investing in UX offer full design system + implementation", budget: "₹20,000-80,000/project" },
  "business-development": { service: "Lead Generation / CRM / Outbound Sales", pitch: "scaling BD team offer automated outbound + lead enrichment platform", budget: "₹10,000-40,000/month" },
};

export async function POST(req) {
  try {
    const userId = await verifyUser(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const quota = await checkLeadQuota(userId);
    if (!quota.ok) {
      return NextResponse.json({ quotaExceeded: true, walletBalance: quota.walletBalance, walletPerLeadCost: quota.walletPerLeadCost, walletMinTopup: quota.walletMinTopup, needsTopup: quota.needsTopup }, { status: 402 });
    }

    const { jobRole, city, state, industry, count = 12 } = await req.json();

    if (!jobRole) return NextResponse.json({ error: "Job role required" }, { status: 400 });
    if (!state) return NextResponse.json({ error: "State required" }, { status: 400 });

    const roleData = JOB_TO_SERVICE_MAP[jobRole] || {
      service: "Digital Services / Software",
      pitch: "actively hiring they're growing and need tech/marketing support",
      budget: "₹10,000-50,000/month",
    };

    const location = city ? `${city}, ${state}` : state;
    const jobRoleLabel = jobRole.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    const prompt = `You are a B2B sales intelligence AI. Companies posting job ads = buying signal.

A company posting "${jobRoleLabel}" job = they are growing and need: ${roleData.service}

Return ${count} company records as a JSON array. These are Indian companies in ${location} that have active job postings for "${jobRoleLabel}"${industry ? ` in the ${industry} industry` : ""}.

CRITICAL RULES every field must have real values:
1. Return ONLY valid JSON array. No markdown, no text.
2. companyName: real Indian company name style (e.g. "Nexgen Retail Solutions Pvt Ltd", "Skyline Edu Tech", "Shree Balaji Traders").
3. estimatedPhone: EXACTLY 10 digits. First digit must be 6, 7, 8, or 9. All remaining 9 digits must be random and unique per record do NOT copy example numbers, generate distinct values each time.
4. companyWebsite: realistic domain like "www.nexgenretail.in" or "skylineedutech.com".
5. jobPostedDaysAgo: a number between 1 and 14.
6. salaryOffered: real range like "₹3.5-6 LPA" or "₹25,000-40,000/month".
7. employeeCount: one of "10-50", "51-200", "201-500".
8. founded: a year between 2015 and 2023.
9. jobPortal: one of "Naukri.com", "LinkedIn", "Indeed", "Internshala", "Shine.com".
10. contactPerson: real Indian name (first + last name like "Anjali Verma", "Suresh Patel").
11. aiPitch: 2 punchy sentences in English - mention their company, the job they posted, why your service is better/complementary.
12. callScript: 15-second phone opener in English mentioning the specific job posting.

JSON format (return array, all fields required):
[{"companyName":"","industry":"","employeeCount":"","founded":"","city":"${city || state}","state":"${state}","jobPortal":"","jobTitle":"","jobPostedDaysAgo":0,"salaryOffered":"","jobDescription":"","contactPerson":"","contactDesignation":"","estimatedPhone":"","companyWebsite":"","growthSignal":"","whyTheyNeedUs":"","aiPitch":"","callScript":"","urgency":"high","estimatedBudget":"${roleData.budget}","serviceToSell":"${roleData.service}"}]`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0]?.text?.trim() || "[]";
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

    let companies;
    try {
      companies = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Parse failed", raw }, { status: 500 });
    }

    const leads = companies.map((c, i) => ({
      id: `job-${Date.now()}-${i}`,
      source: "job_intent",
      type: "domestic",
      businessName: c.companyName,
      industry: c.industry,
      companySize: c.employeeCount,
      city: c.city,
      state: c.state,
      website: c.companyWebsite,
      directorName: c.contactPerson,
      directorDesignation: c.contactDesignation,
      phone: /^[6-9]\d{9}$/.test(String(c.estimatedPhone)) ? String(c.estimatedPhone) : null,
      jobTitle: c.jobTitle,
      jobPortal: c.jobPortal,
      jobPostedDaysAgo: c.jobPostedDaysAgo,
      salaryOffered: c.salaryOffered,
      jobDescription: c.jobDescription,
      growthSignal: c.growthSignal,
      whyTheyNeedUs: c.whyTheyNeedUs,
      aiPitch: c.aiPitch,
      callScript: c.callScript || null,
      urgency: "high",
      estimatedBudget: c.estimatedBudget,
      serviceToSell: c.serviceToSell,
      triggerType: "job_posting",
      triggerSignal: `Hiring "${c.jobTitle}" on ${c.jobPortal} ${c.jobPostedDaysAgo} days ago`,
      status: "raw",
    }));

    // AI middleware: validate + clean leads before returning
    const validated = await validateTriggerLeads(leads, "job", location);

    if (validated.length === 0) {
      return NextResponse.json({ error: "AI validation failed no quality leads found. Please try again." }, { status: 422 });
    }

    const { granted, used: quotaUsed, remaining: quotaRemaining, limit: quotaLimit } = await incrementLeadQuota(userId, validated.length);
    const finalLeads = validated.slice(0, granted);
    await saveLeadHistory(userId, { type: "job-intent", niche: jobRoleLabel, location, leadCount: finalLeads.length, leads: finalLeads.slice(0, 50) });

    return NextResponse.json({
      success: true,
      leads: finalLeads,
      total: finalLeads.length,
      location,
      jobRole: jobRoleLabel,
      serviceToSell: roleData.service,
      quotaUsed,
      quotaRemaining,
      quotaLimit,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
