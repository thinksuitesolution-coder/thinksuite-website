"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ToolShell, {
  ToolCard, ToolHeading, PrimaryButton, ErrorBanner, T,
} from "@/app/dashboard/lead-generation/_shell";
import { useAuth } from "@/lib/auth-context";
import { usePlan } from "@/app/contexts/PlanContext";
import { safeJson, leadPost, walletErrMsg } from "@/lib/frontend/api";
import { getSeenIds, saveSeenIds, lsKey } from "@/lib/frontend/localStorage";
import {
  exportEximCSV,
  exportTCSV, downloadWord,
} from "@/lib/frontend/exporters";
import { formatCopySection } from "@/lib/frontend/leadHelpers";
import { STATES, STATE_CITIES } from "@/lib/frontend/constants";
import { McaCompaniesInput, McaCompaniesResults } from "./features/MCACompanies";
import { IntlCompaniesInput, IntlCompaniesResults } from "./features/GlobalCompanies";
import { HISTORY_TYPE_OPTIONS, SearchHistoryView } from "./features/SearchHistory";
import { SaveLeadButton } from "./features/SaveLeadButton";
import { OutreachSequenceInput, OutreachSequenceResults, OutreachHistoryView } from "./features/OutreachSequences";
import { StepInputGoogleMap, StepProcessing, StepResults } from "./features/GoogleMaps";
import { WebsiteLeadsInput, WebsiteLeadsProcessing, WebsiteLeadsResults } from "./features/WebsiteLeads";
import { InstagramBotInput, InstagramInputIndia, InstagramInput, InstagramInsightModal, InstagramProcessing, InstagramResults } from "./features/Instagram";
import { LinkedInBotInput, LinkedInInputIndia, LinkedInInput, LinkedInProcessing, LinkedInResults } from "./features/LinkedIn";
import { ExportImportInput, ExportImportProcessing, ExportImportResults, LeadAdvisor, EximSuggestionBot } from "./features/ExportImport";
import { IntlMapInput, IntlWebInput, IntlEximInput, IntlEximProcessing } from "./features/IntlLeads";
import { CopyInput, CopySpinner, CopyResult } from "./features/CopyGen";
import { TenderCard, TenderSummaryBar } from "./features/Tenders";
import { ProjectsInput, FreelancerLeadsInput, StartupFounderInput, GlobalSourceProcessing, GlobalSourceResults } from "./features/Projects";
import { SavedLeadsView } from "./features/SavedLeads";
import { PipelineCRMView } from "./features/PipelineCRM";
import { TriggerLeadsInput, TriggerLeadsResults } from "./features/TriggerLeads";
import { LeadGuideBot } from "./features/LeadGuideBot";
import { GroupFinderPanel } from "./features/GroupFinder";
import { COPY_SECTIONS } from "@/lib/frontend/constants";

/* ── Google Map Leads (first feature) ────────────────────────────────────── */
const GOOGLE_MAP_FEATURE = { id: "google-map-leads", icon: "🗺️", label: "Google Map Leads" };


/* ── Copy Gen platforms ───────────────────────────────────────────────────── */

/* ── Sidebar features: google-map + website-leads + copy-gen + platforms ─── */
const WEBSITE_LEADS_FEATURE  = { id: "website-leads",   icon: "🌐", label: "Website Leads" };
const INSTAGRAM_FEATURE      = { id: "instagram-leads", icon: "📸", label: "Instagram Leads" };
const LINKEDIN_FEATURE       = { id: "linkedin-leads",  icon: "💼", label: "LinkedIn Leads" };
const COPY_FEATURE  = { id: "__copy__", icon: "✨", label: "AI Ad Campaign Builder" };
const TRIGGER_LEADS_FEATURE = { id: "trigger-leads", icon: "🔥", label: "Trigger Leads" };
const COPY_PLATFORM_FEATURES = COPY_SECTIONS.map(s => ({ id: `__copy_${s.key}__`, icon: s.icon, label: s.label }));
const DOMESTIC_HEADER       = { id: "__domestic__",    icon: "", label: "Domestic Lead" };
const INTL_HEADER           = { id: "__intl__",        icon: "", label: "International Lead" };
const EXIM_DOMESTIC_FEATURE      = { id: "exim-domestic",      icon: "🚢", label: "Exporter / Importer",    testing: true };
const INSTAGRAM_DOMESTIC_FEATURE = { id: "instagram-india",    icon: "📸", label: "Instagram Leads" };
const LINKEDIN_DOMESTIC_FEATURE  = { id: "linkedin-india",     icon: "💼", label: "LinkedIn Leads" };
const TENDER_DOMESTIC_FEATURE    = { id: "tender-india",       icon: "📋", label: "Government Tenders",     testing: true };
const INTL_MAP_FEATURE           = { id: "intl-map-leads",     icon: "🗺️", label: "Google Map Leads" };
const INTL_WEB_FEATURE           = { id: "intl-web-leads",     icon: "🌐", label: "Website Leads" };
const EXIM_INTL_FEATURE          = { id: "exim-intl",          icon: "🚢", label: "Exporters / Importers",  testing: true };
const TENDER_INTL_FEATURE        = { id: "tender-intl",        icon: "📋", label: "Government Tenders",     testing: true };
const GROUP_DOMESTIC_FEATURE     = { id: "group-domestic",     icon: "👥", label: "Group Finder",           testing: true };
const GROUP_INTL_FEATURE         = { id: "group-intl",         icon: "👥", label: "Group Finder",           testing: true };
const FREELANCER_FEATURE         = { id: "freelancer-leads",    icon: "📋", label: "Projects" };
const STARTUP_FOUNDERS_FEATURE   = { id: "startup-founders",   icon: "🚀", label: "Startup Founders", hidden: true }; // merged into Projects
const MCA_COMPANIES_FEATURE      = { id: "mca-companies",      icon: "🏛️", label: "MCA Fresh Companies", isNew: true };
const INTL_COMPANIES_FEATURE     = { id: "intl-companies",     icon: "🌍", label: "Global Companies",   isNew: true };
const SAVED_LEADS_FEATURE        = { id: "saved-leads",         icon: "📂", label: "Saved Leads" };
const PIPELINE_FEATURE           = { id: "pipeline-crm",         icon: "📊", label: "Pipeline CRM",    isNew: true };
const HISTORY_FEATURE            = { id: "search-history",       icon: "🕓", label: "Search History" };
const OUTREACH_FEATURE           = { id: "outreach-sequences",   icon: "📧", label: "AI Outreach",      isNew: true };
const ALL_FEATURES = [
  DOMESTIC_HEADER, GOOGLE_MAP_FEATURE, WEBSITE_LEADS_FEATURE, EXIM_DOMESTIC_FEATURE, INSTAGRAM_DOMESTIC_FEATURE, LINKEDIN_DOMESTIC_FEATURE, GROUP_DOMESTIC_FEATURE, MCA_COMPANIES_FEATURE,
  INTL_HEADER, INTL_MAP_FEATURE, INTL_WEB_FEATURE, EXIM_INTL_FEATURE, INSTAGRAM_FEATURE, LINKEDIN_FEATURE, GROUP_INTL_FEATURE, INTL_COMPANIES_FEATURE,
  COPY_FEATURE,
  SAVED_LEADS_FEATURE,
  PIPELINE_FEATURE,
  OUTREACH_FEATURE,
  HISTORY_FEATURE,
];

// STATES, STATE_CITIES — moved to lib/frontend/constants.js


const inp = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", colorScheme: "dark",
};

const ghostBtn = {
  fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 10, cursor: "pointer",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.6)",
};

/* ── LocalStorage helpers: track seen leads so user gets fresh results ───── */
// getSeenIds, saveSeenIds — moved to lib/frontend/localStorage.js









// exportTCSV — moved to lib/frontend/exporters.js



// McaCompaniesInput, McaCompaniesResults — moved to features/MCACompanies.js

// IntlCompaniesInput, IntlCompaniesResults — moved to features/GlobalCompanies.js

// HISTORY_TYPE_OPTIONS, SearchHistoryView — moved to features/SearchHistory.js

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════════════════ */
export default function LeadGenPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSubscribe } = usePlan();

  // Lead Finder state
  const [step,           setStep]           = useState(1);
  const [nicheLabel,     setNicheLabel]     = useState("");
  const [city,           setCity]           = useState("");
  const [leads,          setLeads]          = useState([]);
  const [error,          setError]          = useState("");
  const [aiFilterStats,  setAiFilterStats]  = useState(null); // { matched, total, requirement }
  // Google Map load-more params (saved from last search)
  const [gmLoadingMore,  setGmLoadingMore]  = useState(false);
  const [gmCategory,     setGmCategory]     = useState("");
  const [gmArea,         setGmArea]         = useState("");
  const [gmState,        setGmState]        = useState("");
  const [gmCountry,      setGmCountry]      = useState("India");
  const [gmIsIntl,       setGmIsIntl]       = useState(false);
  const [gmSuggestion,   setGmSuggestion]   = useState(null);
  const [gmSugLoading,   setGmSugLoading]   = useState(false);

  // Copy Gen state
  const [copyStep,     setCopyStep]     = useState(1); // 1=input 2=loading 3=result
  const [copyResult,   setCopyResult]   = useState(null);
  const [copyProduct,  setCopyProduct]  = useState("");
  const [copyModel,    setCopyModel]    = useState("openai");
  const [copyError,    setCopyError]    = useState("");

  // Website Leads state
  const [wlStep,        setWlStep]        = useState(1); // 1=input 2=loading 3=result
  const [wlLeads,       setWlLeads]       = useState([]);
  const [wlQueryLabel,  setWlQueryLabel]  = useState("");
  const [wlNiche,       setWlNiche]       = useState("");
  const [wlState,       setWlState]       = useState("");
  const [wlCity,        setWlCity]        = useState("");
  const [wlArea,        setWlArea]        = useState("");
  const [wlCount,       setWlCount]       = useState(20);
  const [wlSources,     setWlSources]     = useState(0);
  const [wlLoadingMore, setWlLoadingMore] = useState(false);
  const [wlError,       setWlError]       = useState("");
  const [wlAiInsight,   setWlAiInsight]   = useState("");
  const [wlSuggestion,  setWlSuggestion]  = useState(null);
  const [wlSugLoading,  setWlSugLoading]  = useState(false);

  // Instagram Leads state
  const [igStep,        setIgStep]        = useState(1); // 1=input 2=loading 3=result
  const [igLeads,       setIgLeads]       = useState([]);
  const [igNiche,       setIgNiche]       = useState("");
  const [igState,       setIgState]       = useState("");
  const [igCity,        setIgCity]        = useState("");
  const [igArea,        setIgArea]        = useState("");
  const [igCountry,     setIgCountry]     = useState("");
  const [igIsIntl,      setIgIsIntl]      = useState(false);
  const [igQueryLabel,  setIgQueryLabel]  = useState("");
  const [igLoadingMore,  setIgLoadingMore]  = useState(false);
  const [igError,        setIgError]        = useState("");
  const [igAiInsight,    setIgAiInsight]    = useState("");
  const [igAccountType,  setIgAccountType]  = useState("business");
  const [igMinFollowers, setIgMinFollowers] = useState(null);
  const [igMaxFollowers, setIgMaxFollowers] = useState(null);
  const [igSuggestion,   setIgSuggestion]  = useState(null);
  const [igSugLoading,   setIgSugLoading]  = useState(false);

  // LinkedIn Leads state
  const [liStep,        setLiStep]        = useState(1);
  const [liLeads,       setLiLeads]       = useState([]);
  const [liNiche,       setLiNiche]       = useState("");
  const [liState,       setLiState]       = useState("");
  const [liCity,        setLiCity]        = useState("");
  const [liArea,        setLiArea]        = useState("");
  const [liJobTitle,    setLiJobTitle]    = useState("");
  const [liCountry,     setLiCountry]     = useState("");
  const [liIsIntl,      setLiIsIntl]      = useState(false);
  const [liQueryLabel,  setLiQueryLabel]  = useState("");
  const [liLoadingMore,        setLiLoadingMore]        = useState(false);
  const [liError,              setLiError]              = useState("");
  const [liSpecialInstructions,setLiSpecialInstructions]= useState("");
  const [liAiInsight,          setLiAiInsight]          = useState("");
  const [liSuggestion,         setLiSuggestion]         = useState(null);
  const [liSugLoading,         setLiSugLoading]         = useState(false);

  // Export-Import Leads state
  const [eximStep,        setEximStep]        = useState(1);
  const [eximLeads,       setEximLeads]       = useState([]);
  const [eximProduct,     setEximProduct]     = useState("");
  const [eximTradeType,   setEximTradeType]   = useState("exporter");
  const [eximState,       setEximState]       = useState("");
  const [eximCity,        setEximCity]        = useState("");
  const [eximHsCode,      setEximHsCode]      = useState("");
  const [eximLoadingMore, setEximLoadingMore] = useState(false);
  const [eximError,       setEximError]       = useState("");
  const [eximTotalSeen,   setEximTotalSeen]   = useState(0);
  const [eximSuggestion,  setEximSuggestion]  = useState(null); // AI trade advisor suggestion
  const [eximSugLoading,  setEximSugLoading]  = useState(false);
  const [eximFormKey,     setEximFormKey]     = useState(0);   // increment to remount form with new initial values
  const [eximInitProd,    setEximInitProd]    = useState("");
  const [eximInitState,   setEximInitState]   = useState("");

  // International Google Map Leads state
  const [intlMapStep,        setIntlMapStep]        = useState(1);
  const [intlMapLeads,       setIntlMapLeads]       = useState([]);
  const [intlMapNiche,       setIntlMapNiche]       = useState("");
  const [intlMapCountry,     setIntlMapCountry]     = useState("");
  const [intlMapProvince,    setIntlMapProvince]    = useState("");
  const [intlMapCity,        setIntlMapCity]        = useState("");
  const [intlMapQueryLabel,  setIntlMapQueryLabel]  = useState("");
  const [intlMapSources,     setIntlMapSources]     = useState(0);
  const [intlMapLoadingMore,    setIntlMapLoadingMore]    = useState(false);
  const [intlMapError,          setIntlMapError]          = useState("");
  const [intlMapAiFilterStats,  setIntlMapAiFilterStats]  = useState(null);

  // International Website Leads state
  const [intlWebStep,        setIntlWebStep]        = useState(1);
  const [intlWebLeads,       setIntlWebLeads]       = useState([]);
  const [intlWebNiche,       setIntlWebNiche]       = useState("");
  const [intlWebCountry,     setIntlWebCountry]     = useState("");
  const [intlWebCity,        setIntlWebCity]        = useState("");
  const [intlWebCount,       setIntlWebCount]       = useState(20);
  const [intlWebQueryLabel,  setIntlWebQueryLabel]  = useState("");
  const [intlWebSources,     setIntlWebSources]     = useState(0);
  const [intlWebLoadingMore, setIntlWebLoadingMore] = useState(false);
  const [intlWebError,       setIntlWebError]       = useState("");

  // International Export-Import Leads state
  const [intlEximStep,        setIntlEximStep]        = useState(1);
  const [intlEximLeads,       setIntlEximLeads]       = useState([]);
  const [intlEximProduct,     setIntlEximProduct]     = useState("");
  const [intlEximTradeType,   setIntlEximTradeType]   = useState("exporter");
  const [intlEximCountry,     setIntlEximCountry]     = useState("");
  const [intlEximCity,        setIntlEximCity]        = useState("");
  const [intlEximHsCode,      setIntlEximHsCode]      = useState("");
  const [intlEximLoadingMore, setIntlEximLoadingMore] = useState(false);
  const [intlEximError,       setIntlEximError]       = useState("");
  const [intlEximTotalSeen,   setIntlEximTotalSeen]   = useState(0);

  // India Tenders state
  const [indiaTQuery,     setIndiaTQuery]     = useState("");
  const [indiaTState,     setIndiaTState]     = useState("");
  const [indiaTCity,      setIndiaTCity]      = useState("");
  const [indiaTArea,      setIndiaTArea]      = useState("");
  const [indiaTKw,        setIndiaTKw]        = useState("");
  const [indiaTMinVal,    setIndiaTMinVal]    = useState("");
  const [indiaTTenderType, setIndiaTTenderType] = useState("all");
  const [indiaTenders,    setIndiaTenders]    = useState([]);
  const [indiaTLoading,   setIndiaTLoading]   = useState(false);
  const [indiaTError,     setIndiaTError]     = useState("");
  const [indiaTStep,      setIndiaTStep]      = useState(1);
  const [indiaTSummary,   setIndiaTSummary]   = useState(null);
  const [showIndiaTF,     setShowIndiaTF]     = useState(true);
  const [indiaTIntent,    setIndiaTIntent]    = useState(null);
  const [indiaTAnalyzing, setIndiaTAnalyzing] = useState(false);

  // TenderBot chat state
  const TBOT_WELCOME = { id: 0, role: "bot", text: "Hello! 👋 I am your Government Tender AI Assistant.\n\nWhat do you do or what product/service do you supply? Tell me - e.g. 'Solar panel supplier', 'Road construction company', 'IT software development', 'Medical equipment dealer'..." };
  const [tBotMsgs,     setTBotMsgs]     = useState([TBOT_WELCOME]);
  const [tBotPhase,    setTBotPhase]    = useState("welcome");
  const [tBotInput,    setTBotInput]    = useState("");
  const [tBotThinking, setTBotThinking] = useState(false);
  const tBotEndRef = useRef(null);
  const tBotStateRef = useRef({ state: "", type: "all", query: "", intent: null });

  // Intl Tenders state
  const [intlTSector,       setIntlTSector]       = useState("all");
  const [intlTCountry,      setIntlTCountry]      = useState("");
  const [intlTStateProvince,setIntlTStateProvince] = useState("");
  const [intlTFunding,      setIntlTFunding]      = useState("all");
  const [intlTKw,        setIntlTKw]        = useState("");
  const [intlTMinVal,    setIntlTMinVal]    = useState("");
  const [intlTIndOnly,   setIntlTIndOnly]   = useState(false);
  const [intlTTenderType, setIntlTTenderType] = useState("all");
  const [intlTenders,    setIntlTenders]    = useState([]);
  const [intlTLoading,   setIntlTLoading]   = useState(false);
  const [intlTError,     setIntlTError]     = useState("");
  const [intlTStep,      setIntlTStep]      = useState(1);
  const [intlTSummary,   setIntlTSummary]   = useState(null);
  const [showIntlTF,     setShowIntlTF]     = useState(true);

  // IntlTenderBot chat state
  const IBOT_WELCOME = { id: 0, role: "bot", text: "Hello! 👋 I'm your International Tender AI Assistant.\n\nWhat's your business or requirement? Tell me what you supply or what service you provide -e.g. 'Solar panel supply', 'Road construction company', 'IT software development', 'Medical equipment dealer'..." };
  const [iBotMsgs,     setIBotMsgs]     = useState([IBOT_WELCOME]);
  const [iBotPhase,    setIBotPhase]    = useState("welcome");
  const [iBotInput,    setIBotInput]    = useState("");
  const [iBotThinking, setIBotThinking] = useState(false);
  const iBotEndRef  = useRef(null);
  const iBotStateRef = useRef({ country: "", state: "", type: "all", query: "", intent: null });

  // Group Finder state
  const [grpNiche,       setGrpNiche]       = useState("");
  const [grpPlatforms,   setGrpPlatforms]   = useState(["whatsapp"]);
  const [grpCountry,     setGrpCountry]     = useState("");
  const [grpGroups,      setGrpGroups]      = useState([]);
  const [grpLoading,     setGrpLoading]     = useState(false);
  const [grpError,       setGrpError]       = useState("");
  const [grpStep,        setGrpStep]        = useState(1);
  const [grpIsIntl,      setGrpIsIntl]      = useState(false);
  const [grpQuota,       setGrpQuota]       = useState({ used: 0, remaining: 300, limit: 300 });
  const [grpQuotaHit,    setGrpQuotaHit]    = useState(false);
  const [grpLoadingMore, setGrpLoadingMore] = useState(false);
  const [grpRecency,     setGrpRecency]     = useState(null);
  const [grpSearchPage,  setGrpSearchPage]  = useState(1);
  const grpSeenRef = useRef(new Set()); // tracks seen URLs for uniqueness within session
  const [grpSuggestion,  setGrpSuggestion] = useState(null);
  const [grpSugLoading,  setGrpSugLoading] = useState(false);

  // Freelancer Client Leads state
  const [flStep,       setFlStep]       = useState(1);
  const [flLeads,      setFlLeads]      = useState([]);
  const [flError,      setFlError]      = useState("");
  const [flService,    setFlService]    = useState("");
  const [flCountry,    setFlCountry]    = useState("global");
  const [flQueryLabel, setFlQueryLabel] = useState("");
  const [flLoadingMore, setFlLoadingMore] = useState(false);
  const flSeenRef = useRef(new Set());

  // Startup Founder Leads state
  const [sfStep,       setSfStep]       = useState(1);
  const [sfLeads,      setSfLeads]      = useState([]);
  const [sfError,      setSfError]      = useState("");
  const [sfService,    setSfService]    = useState("");
  const [sfCountry,    setSfCountry]    = useState("global");
  const [sfQueryLabel, setSfQueryLabel] = useState("");
  const [sfLoadingMore, setSfLoadingMore] = useState(false);
  const sfSeenRef = useRef(new Set());

  // Lead quota + wallet state
  const [leadQuota,       setLeadQuota]       = useState({ used: 0, remaining: 350, limit: 350, planType: "starter" });
  const [walletTopupOpen, setWalletTopupOpen] = useState(false);
  const [walletTopupAmt,  setWalletTopupAmt]  = useState(500);
  const [walletTopupBusy, setWalletTopupBusy] = useState(false);

  // Saved Leads state
  const [savedLeads,       setSavedLeads]       = useState([]);
  const [savedLeadsStats,  setSavedLeadsStats]  = useState(null);
  const [savedLeadsLoading,setSavedLeadsLoading]= useState(false);
  const [savedLeadIds,     setSavedLeadIds]     = useState(new Set());
  const [savingLeadId,     setSavingLeadId]     = useState(null);
  const [enrichingLeadId,  setEnrichingLeadId]  = useState(null);

  // MCA Companies state
  const [mcaStep,    setMcaStep]    = useState(1);
  const [mcaLeads,   setMcaLeads]   = useState([]);
  const [mcaError,   setMcaError]   = useState("");
  const [mcaParams,  setMcaParams]  = useState({});
  const [mcaLoading, setMcaLoading] = useState(false);

  // International Companies state
  const [intlCoStep,    setIntlCoStep]    = useState(1);
  const [intlCoLeads,   setIntlCoLeads]   = useState([]);
  const [intlCoError,   setIntlCoError]   = useState("");
  const [intlCoParams,  setIntlCoParams]  = useState({});
  const [intlCoLoading, setIntlCoLoading] = useState(false);

  // Trigger Leads (Job Intent) state
  const [triggerStep,   setTriggerStep]   = useState(1);
  const [triggerLeads,  setTriggerLeads]  = useState([]);
  const [triggerError,  setTriggerError]  = useState("");
  const [triggerLoading,setTriggerLoading]= useState(false);
  const [triggerParams, setTriggerParams] = useState({});

  // Search History state
  const [histSessions,     setHistSessions]     = useState([]);
  const [histStats,        setHistStats]        = useState(null);
  const [histLoading,      setHistLoading]      = useState(false);
  const [histCursor,       setHistCursor]       = useState(null);
  const [histHasMore,      setHistHasMore]      = useState(false);
  const [histTypeFilter,   setHistTypeFilter]   = useState("");

  // Outreach Sequences state
  const [orchStep,         setOrchStep]         = useState(1); // 1=input/history, 2=generating, 3=result
  const [orchSequence,     setOrchSequence]     = useState(null);
  const [orchWhatsapp,     setOrchWhatsapp]     = useState(null);
  const [orchLinkedin,     setOrchLinkedin]     = useState(null);
  const [orchPreFillLead,  setOrchPreFillLead]  = useState(null);
  const [orchLeadName,     setOrchLeadName]     = useState("");
  const [orchGoal,         setOrchGoal]         = useState("meeting");
  const [orchTone,         setOrchTone]         = useState("professional");
  const [orchError,        setOrchError]        = useState("");
  const [orchLoading,      setOrchLoading]      = useState(false);
  const [orchSaving,       setOrchSaving]       = useState(false);
  const [orchSaved,        setOrchSaved]        = useState(false);
  const [orchSavedSeqs,    setOrchSavedSeqs]    = useState([]);
  const [orchSeqLoading,   setOrchSeqLoading]   = useState(false);
  const [orchHasMore,      setOrchHasMore]      = useState(false);
  const [orchCursor,       setOrchCursor]       = useState(null);
  const [orchDeletingId,   setOrchDeletingId]   = useState(null);

  // Pipeline CRM state
  const [pipeLeads,        setPipeLeads]        = useState([]);
  const [pipeLoading,      setPipeLoading]      = useState(false);
  const [pipeLeadIds,      setPipeLeadIds]      = useState(new Set()); // Set of savedLeadId values in pipeline

  // Active mode
  const [mode, setMode] = useState("google-map");

  function resetIndiaTenderSearch() {
    setIndiaTIntent(null);
    setIndiaTenders([]);
    setIndiaTSummary(null);
    setIndiaTError("");
    setIndiaTStep(1);
  }

  /* ── TenderBot helpers ────────────────────────────────────────────────── */
  function tBotScroll() { setTimeout(() => tBotEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60); }

  function tBotAdd(msg) { setTBotMsgs(p => [...p, msg]); tBotScroll(); }

  function tBotResolve(id) { setTBotMsgs(p => p.map(m => m.id === id ? { ...m, resolved: true } : m)); }

  function resetTBot() {
    const TBOT_WELCOME = { id: 0, role: "bot", text: "Hello! 👋 I am your Government Tender AI Assistant.\n\nWhat do you do or what product/service do you supply? Tell me - e.g. 'Solar panel supplier', 'Road construction company', 'IT software development', 'Medical equipment dealer'..." };
    setTBotMsgs([TBOT_WELCOME]);
    setTBotPhase("welcome");
    setTBotInput("");
    setTBotThinking(false);
    tBotStateRef.current = { state: "", type: "all", query: "", intent: null };
    resetIndiaTenderSearch();
    setIndiaTQuery("");
    setIndiaTState("");
    setIndiaTTenderType("all");
  }

  async function tBotRunSearch(query, intent, state, tenderType) {
    if (!leadQuota.unlimited && leadQuota.remaining <= 0 && !(leadQuota.useWallet)) {
      tBotAdd({ id: Date.now(), role: "bot", text: "❌ Insufficient wallet balance. Add ₹500 or more to continue.", options: [{ label: "🔄 New Search", value: "reset", action: "reset" }] });
      setTBotPhase("results");
      return;
    }
    setTBotThinking(true);
    setIndiaTLoading(true);
    setIndiaTError("");
    try {
      const keywords = (intent?.keywords || []).join(" ");
      const res = await leadPost("/api/tenders/india-tenders", user, {
        customQuery: query,
        state,
        sector: intent?.sector || "",
        keywords,
        tenderType,
        quantity: 20,
      });
      const text = await res.text();
      let data; try { data = JSON.parse(text); } catch { data = {}; }
      setTBotThinking(false);
      setIndiaTLoading(false);

      if (!res.ok || data.success === false) {
        const errMsg = data.error || "No matching tenders found.";
        setIndiaTError(errMsg);
        tBotAdd({ id: Date.now(), role: "bot", text: `❌ ${errMsg}`, options: [{ label: "🔄 New Search", value: "reset", action: "reset" }] });
        setTBotPhase("results");
        return;
      }

      setIndiaTenders(data.tenders || []);
      setIndiaTSummary({ urgent: data.urgent_count, highest: data.highest_value });
      setIndiaTStep(3);

      const count = (data.tenders || []).length;
      tBotAdd({ id: Date.now(), role: "bot", text: `✅ Found ${count} relevant tenders!\n\nAI has analyzed each tender scroll down to review them. Click "New Search" to start over.` });
      setTBotPhase("results");
    } catch {
      setTBotThinking(false);
      setIndiaTLoading(false);
      tBotAdd({ id: Date.now(), role: "bot", text: "A network error occurred. Please try again.", options: [{ label: "🔄 Retry", value: "reset", action: "reset" }] });
      setTBotPhase("welcome");
    }
  }

  async function handleTBotSend() {
    const txt = tBotInput.trim();
    if (!txt) return;
    tBotAdd({ id: Date.now(), role: "user", text: txt });
    setTBotInput("");

    if (tBotPhase === "welcome") {
      tBotStateRef.current.query = txt;
      setIndiaTQuery(txt);
      setTBotPhase("analyzing");
      setTBotThinking(true);
      try {
        const res  = await fetch("/api/tenders/analyze-intent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessDesc: txt }) });
        const data = await safeJson(res);
        tBotStateRef.current.intent = data;
        setIndiaTIntent(data);
        setTBotThinking(false);

        tBotAdd({ id: Date.now(), role: "bot", text: `Got it! 🎯\n\n${data.english_summary || data.hinglish_summary || ""}\n\nSector: ${data.sector || "General"} | Type: ${data.tender_type || "All"}` });

        setTimeout(() => {
          setTBotThinking(true);
          setTimeout(() => {
            setTBotThinking(false);
            const locId = Date.now();
            tBotAdd({ id: locId, role: "bot", text: "Which area's tenders do you need?", options: [
              { label: "🇮🇳 All India", value: "all", action: "set_location" },
              { label: "📍 Specific State", value: "state", action: "set_location" },
            ]});
            setTBotPhase("ask_location");
          }, 1000);
        }, 500);
      } catch {
        setTBotThinking(false);
        tBotAdd({ id: Date.now(), role: "bot", text: "AI analysis encountered an issue. Searching for tenders directly..." });
        tBotStateRef.current.intent = null;
        await tBotRunSearch(txt, null, "", "all");
      }
    }
  }

  async function handleTBotOption(opt, msgId) {
    tBotResolve(msgId);
    tBotAdd({ id: Date.now(), role: "user", text: opt.label });

    if (opt.action === "reset") { resetTBot(); return; }

    if (opt.action === "set_location") {
      if (opt.value === "all") {
        tBotStateRef.current.state = "";
        setIndiaTState("");
        setTimeout(() => {
          setTBotThinking(true);
          setTimeout(() => {
            setTBotThinking(false);
            const typeId = Date.now();
            tBotAdd({ id: typeId, role: "bot", text: "Which type of tenders do you need?", options: [
              { label: "🔍 All Types",    value: "all",         action: "set_type" },
              { label: "📦 Goods",        value: "goods",       action: "set_type" },
              { label: "🏗️ Works",        value: "works",       action: "set_type" },
              { label: "🛠️ Services",     value: "services",    action: "set_type" },
              { label: "📊 Consultancy",  value: "consultancy", action: "set_type" },
            ]});
            setTBotPhase("ask_type");
          }, 800);
        }, 300);
      } else {
        setTimeout(() => {
          setTBotThinking(true);
          setTimeout(() => {
            setTBotThinking(false);
            tBotAdd({ id: Date.now(), role: "bot", text: "Which state would you like?", type: "state_picker" });
            setTBotPhase("ask_state");
          }, 700);
        }, 300);
      }
    } else if (opt.action === "set_state") {
      tBotStateRef.current.state = opt.value;
      setIndiaTState(opt.value);
      setTimeout(() => {
        setTBotThinking(true);
        setTimeout(() => {
          setTBotThinking(false);
          tBotAdd({ id: Date.now(), role: "bot", text: `${opt.value} ✓\n\nWhich type of tenders do you need?`, options: [
            { label: "🔍 All Types",    value: "all",         action: "set_type" },
            { label: "📦 Goods",        value: "goods",       action: "set_type" },
            { label: "🏗️ Works",        value: "works",       action: "set_type" },
            { label: "🛠️ Services",     value: "services",    action: "set_type" },
            { label: "📊 Consultancy",  value: "consultancy", action: "set_type" },
          ]});
          setTBotPhase("ask_type");
        }, 700);
      }, 300);
    } else if (opt.action === "set_type") {
      tBotStateRef.current.type = opt.value;
      setIndiaTTenderType(opt.value);
      setTBotPhase("searching");
      tBotAdd({ id: Date.now(), role: "bot", text: "🔍 Searching for tenders... just a moment!" });
      await tBotRunSearch(
        tBotStateRef.current.query,
        tBotStateRef.current.intent,
        tBotStateRef.current.state,
        opt.value
      );
    }
  }

  async function analyzeIndiaTenderQuery() {
    if (!indiaTQuery.trim()) {
      setIndiaTError("Please describe your business or requirement what do you supply or what service are you looking for?");
      return;
    }
    setIndiaTAnalyzing(true);
    setIndiaTError("");
    setIndiaTIntent(null);
    setIndiaTenders([]);
    setIndiaTSummary(null);
    setIndiaTStep(1);
    try {
      const res = await fetch("/api/tenders/analyze-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessDesc: indiaTQuery }),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setIndiaTIntent(data);
    } catch (e) {
      setIndiaTError(e.message || "AI analysis failed");
    } finally {
      setIndiaTAnalyzing(false);
    }
  }

  async function doFetchIndiaTenders() {
    if (!indiaTQuery.trim()) {
      setIndiaTError("Please describe your business or requirement what do you supply or what service are you looking for?");
      return;
    }
    if (!indiaTIntent) {
      setIndiaTError("Please run AI Analysis first, then fetch relevant tenders.");
      return;
    }
    setIndiaTLoading(true); setIndiaTError(""); setIndiaTStep(2);
    try {
      const effectiveKeywords = indiaTKw.trim() || (indiaTIntent?.keywords || []).join(" ");
      const effectiveTenderType = indiaTTenderType !== "all"
        ? indiaTTenderType
        : (indiaTIntent?.tender_type ? indiaTIntent.tender_type.toLowerCase() : "all");
      const res  = await fetch("/api/tenders/india-tenders", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          aiQuery: indiaTQuery,
          customQuery: indiaTQuery,
          state: indiaTState,
          city: indiaTCity,
          area: indiaTArea,
          sector: indiaTIntent?.sector || "",
          keywords: effectiveKeywords,
          minValue: indiaTMinVal,
          tenderType: effectiveTenderType,
          quantity: 20,
        }),
      });
      const text = await res.text();
      let data; try { data = JSON.parse(text); } catch { data = {}; }
      if (!res.ok) throw new Error(data.error || `Server error (${res.status}) please try again in a moment`);
      if (data.success === false) throw new Error(data.error || "No matching tenders found.");
      setIndiaTenders(data.tenders || []);
      setIndiaTSummary({ urgent:data.urgent_count, highest:data.highest_value });
      setIndiaTStep(3);
    } catch(e) { setIndiaTError(e.message); setIndiaTStep(1); }
    finally { setIndiaTLoading(false); }
  }

  async function handleTenderFormSubmit() {
    if (!indiaTQuery.trim()) {
      setIndiaTError("Please describe your business or what you supply.");
      return;
    }
    setIndiaTError("");
    setIndiaTenders([]);
    setIndiaTSummary(null);
    setIndiaTStep(2);
    setIndiaTLoading(true);
    let intent = null;
    try {
      const res = await fetch("/api/tenders/analyze-intent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessDesc: indiaTQuery }),
      });
      intent = await safeJson(res);
      setIndiaTIntent(intent);
    } catch { /* continue without intent */ }
    try {
      const effectiveKeywords = (intent?.keywords || []).join(" ");
      const effectiveTenderType = indiaTTenderType !== "all"
        ? indiaTTenderType
        : (intent?.tender_type ? intent.tender_type.toLowerCase() : "all");
      const res = await fetch("/api/tenders/india-tenders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customQuery: indiaTQuery,
          state: indiaTState,
          sector: intent?.sector || "",
          keywords: effectiveKeywords,
          tenderType: effectiveTenderType,
          quantity: 20,
        }),
      });
      const data = await safeJson(res);
      setIndiaTenders(data.tenders || []);
      setIndiaTSummary({ urgent: data.urgent_count, highest: data.highest_value });
      setIndiaTStep(3);
    } catch(e) {
      setIndiaTError(e.message || "Failed to fetch tenders. Please try again.");
      setIndiaTStep(1);
    } finally {
      setIndiaTLoading(false);
    }
  }

  async function doFetchIntlTenders() {
    setIntlTLoading(true); setIntlTError(""); setIntlTStep(2);
    try {
      const res  = await leadPost("/api/tenders/intl-tenders", user, { sector:intlTSector, country:intlTCountry, stateProvince:intlTStateProvince, funding:intlTFunding, keywords:intlTKw, minValue:intlTMinVal, indianFirmsOnly:intlTIndOnly, tenderType:intlTTenderType, quantity:20 });
      const text2 = await res.text();
      let data; try { data = JSON.parse(text2); } catch { data = {}; }
      if (!res.ok) throw new Error(data.error || `Server error (${res.status}) - please try again in a moment`);
      setIntlTenders(data.tenders || []);
      setIntlTSummary({ urgent:data.urgent_count, bestIndia:data.best_for_india });
      setIntlTStep(3);
    } catch(e) { setIntlTError(e.message); setIntlTStep(1); }
    finally { setIntlTLoading(false); }
  }

  /* ── IntlTenderBot helpers ────────────────────────────────────────────── */
  function iBotScroll() { setTimeout(() => iBotEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60); }
  function iBotAdd(msg) { setIBotMsgs(p => [...p, msg]); iBotScroll(); }
  function iBotResolve(id) { setIBotMsgs(p => p.map(m => m.id === id ? { ...m, resolved: true } : m)); }

  function resetIBot() {
    const IBOT_WELCOME = { id: 0, role: "bot", text: "Hello! 👋 I'm your International Tender AI Assistant.\n\nWhat's your business or requirement? Tell me what you supply or what service you provide -e.g. 'Solar panel supply', 'Road construction company', 'IT software development', 'Medical equipment dealer'..." };
    setIBotMsgs([IBOT_WELCOME]);
    setIBotPhase("welcome");
    setIBotInput("");
    setIBotThinking(false);
    iBotStateRef.current = { country: "", state: "", type: "all", query: "", intent: null };
    setIntlTenders([]); setIntlTSummary(null); setIntlTError(""); setIntlTStep(1);
    setIntlTCountry(""); setIntlTStateProvince(""); setIntlTTenderType("all");
  }

  async function iBotRunSearch(query, country, stateProvince, tenderType) {
    if (!leadQuota.unlimited && leadQuota.remaining <= 0 && !(leadQuota.useWallet)) {
      iBotAdd({ id: Date.now(), role: "bot", text: "❌ Insufficient wallet balance. Add ₹500 or more to continue.", options: [{ label: "🔄 New Search", value: "reset", action: "reset" }] });
      setIBotPhase("results");
      return;
    }
    setIBotThinking(true);
    setIntlTLoading(true);
    setIntlTError("");
    try {
      const res = await leadPost("/api/tenders/intl-tenders", user, { country, stateProvince, tenderType, keywords: query, quantity: 20, indianFirmsOnly: intlTIndOnly });
      const txt = await res.text();
      let data; try { data = JSON.parse(txt); } catch { data = {}; }
      setIBotThinking(false);
      setIntlTLoading(false);

      if (!res.ok) {
        const err = data.error || "No tenders found. Please try different filters.";
        setIntlTError(err);
        iBotAdd({ id: Date.now(), role: "bot", text: `❌ ${err}`, options: [{ label: "🔄 New Search", value: "reset", action: "reset" }] });
        setIBotPhase("results");
        return;
      }

      setIntlTenders(data.tenders || []);
      setIntlTSummary({ urgent: data.urgent_count, bestIndia: data.best_for_india });
      setIntlTStep(3);

      const count = (data.tenders || []).length;
      if (count === 0) {
        iBotAdd({ id: Date.now(), role: "bot", text: "No matching tenders found for your search. Try a different country or broader keywords.", options: [{ label: "🔄 New Search", value: "reset", action: "reset" }] });
      } else {
        iBotAdd({ id: Date.now(), role: "bot", text: `✅ Found ${count} international tenders!\n\nAI has analyzed each tender below. Start a new search anytime.` });
      }
      setIBotPhase("results");
    } catch {
      setIBotThinking(false);
      setIntlTLoading(false);
      iBotAdd({ id: Date.now(), role: "bot", text: "Network error. Please try again.", options: [{ label: "🔄 Retry", value: "reset", action: "reset" }] });
      setIBotPhase("welcome");
    }
  }

  async function handleIBotSend() {
    const txt = iBotInput.trim();
    if (!txt) return;
    iBotAdd({ id: Date.now(), role: "user", text: txt });
    setIBotInput("");

    if (iBotPhase === "welcome") {
      iBotStateRef.current.query = txt;
      setIBotPhase("analyzing");
      setIBotThinking(true);
      try {
        const res  = await fetch("/api/tenders/analyze-intent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessDesc: txt }) });
        const data = await safeJson(res);
        iBotStateRef.current.intent = data;
        setIBotThinking(false);
        iBotAdd({ id: Date.now(), role: "bot", text: `Got it! 🎯\n\n${data.english_summary || data.hinglish_summary || data.sector || ""}\nSector: ${data.sector || "General"} | Type: ${data.tender_type || "All"}` });
        setTimeout(() => {
          setIBotThinking(true);
          setTimeout(() => {
            setIBotThinking(false);
            iBotAdd({ id: Date.now(), role: "bot", text: "Which country's tenders do you want?\n\nPro tip: Choose a specific country for targeted results from that country's portal.", type: "country_input", options: [
              { label: "🌍 Any / Global", value: "",               action: "set_country" },
              { label: "🇺🇸 USA",          value: "United States", action: "set_country" },
              { label: "🇬🇧 UK",            value: "United Kingdom",action: "set_country" },
              { label: "🇦🇪 UAE",           value: "UAE",           action: "set_country" },
              { label: "🇦🇺 Australia",     value: "Australia",     action: "set_country" },
              { label: "🇸🇬 Singapore",     value: "Singapore",     action: "set_country" },
              { label: "🇩🇪 Germany/EU",    value: "European Union",action: "set_country" },
              { label: "🌍 Africa/UNDP",    value: "Africa",        action: "set_country" },
              { label: "🏦 World Bank",     value: "World Bank",    action: "set_country" },
              { label: "📍 Other Country...",value: "__type__",     action: "prompt_country" },
            ]});
            setIBotPhase("ask_country");
          }, 900);
        }, 500);
      } catch {
        setIBotThinking(false);
        iBotStateRef.current.intent = null;
        iBotAdd({ id: Date.now(), role: "bot", text: "Which country's tenders do you want?", options: [
          { label: "🌍 Any / Global",  value: "",               action: "set_country" },
          { label: "🇺🇸 USA",           value: "United States",  action: "set_country" },
          { label: "🇬🇧 UK",             value: "United Kingdom", action: "set_country" },
          { label: "🇦🇪 UAE",            value: "UAE",            action: "set_country" },
          { label: "🇦🇺 Australia",      value: "Australia",      action: "set_country" },
          { label: "🏦 World Bank",      value: "World Bank",     action: "set_country" },
          { label: "📍 Other Country...",value: "__type__",       action: "prompt_country" },
        ]});
        setIBotPhase("ask_country");
      }
    } else if (iBotPhase === "type_country") {
      iBotStateRef.current.country = txt;
      setIntlTCountry(txt);
      promptIBotState();
    } else if (iBotPhase === "type_state") {
      iBotStateRef.current.state = txt;
      setIntlTStateProvince(txt);
      promptIBotType();
    }
  }

  function promptIBotState() {
    setIBotThinking(true);
    setTimeout(() => {
      setIBotThinking(false);
      const country = iBotStateRef.current.country;
      iBotAdd({ id: Date.now(), role: "bot", text: `${country || "Any country"} ✓\n\nAny specific state or province? (optional)`, options: [
        { label: "⏭️ Skip", value: "", action: "set_state" },
      ]});
      setIBotPhase("ask_state");
    }, 700);
  }

  function promptIBotType() {
    setIBotThinking(true);
    setTimeout(() => {
      setIBotThinking(false);
      iBotAdd({ id: Date.now(), role: "bot", text: "What type of tender are you looking for?", options: [
        { label: "🔍 All Types",    value: "all",         action: "set_type" },
        { label: "📦 Goods",        value: "goods",       action: "set_type" },
        { label: "🏗️ Works",        value: "works",       action: "set_type" },
        { label: "🛠️ Services",     value: "services",    action: "set_type" },
        { label: "📊 Consultancy",  value: "consultancy", action: "set_type" },
      ]});
      setIBotPhase("ask_type");
    }, 700);
  }

  async function handleIBotOption(opt, msgId) {
    iBotResolve(msgId);

    if (opt.action === "reset") { resetIBot(); return; }

    if (opt.action === "prompt_country") {
      iBotAdd({ id: Date.now(), role: "bot", text: "Please type the country name:" });
      setIBotPhase("type_country");
      return;
    }

    iBotAdd({ id: Date.now(), role: "user", text: opt.label });

    if (opt.action === "set_country") {
      iBotStateRef.current.country = opt.value;
      setIntlTCountry(opt.value);
      promptIBotState();
    } else if (opt.action === "set_state") {
      iBotStateRef.current.state = opt.value;
      setIntlTStateProvince(opt.value);
      if (iBotPhase === "ask_state" && opt.value === "" && opt.label === "⏭️ Skip") {
        // skip -go straight to type
      }
      promptIBotType();
    } else if (opt.action === "set_type") {
      iBotStateRef.current.type = opt.value;
      setIntlTTenderType(opt.value);
      setIBotPhase("searching");
      iBotAdd({ id: Date.now(), role: "bot", text: "🔍 Searching international tenders... please wait!" });
      await iBotRunSearch(
        iBotStateRef.current.query,
        iBotStateRef.current.country,
        iBotStateRef.current.state,
        opt.value
      );
    }
  }

  useEffect(() => {
    if (!user) return;
    // Admin bypass via coupon code — skip quota fetch and grant unlimited access
    if (typeof window !== "undefined" && localStorage.getItem("ts_admin_bypass") === "1") {
      setLeadQuota({ used: 0, remaining: 999999, limit: 999999, planType: "unlimited", unlimited: true });
      return;
    }
    user.getIdToken().then(token =>
      fetch("/api/lead-gen/quota", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      })
    ).then(r => r.json()).then(d => {
      if (d && typeof d.used === "number") {
        setLeadQuota({
          used:              d.used,
          remaining:         d.remaining,
          limit:             d.limit,
          planType:          d.planType          || "starter",
          unlimited:         d.unlimited         || false,
          walletBalance:     d.walletBalance,
          walletPerLeadCost: d.walletPerLeadCost,
          walletMinTopup:    d.walletMinTopup,
          useWallet:         d.useWallet         || false,
          needsTopup:        d.needsTopup        || false,
        });
      }
    }).catch(() => {});
  }, [user]);

  async function saveToHistory(toolSlug, toolLabel, query, details = {}, results = []) {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/search-history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, toolSlug, toolLabel, query, details, results: results.slice(0, 50) }),
      });
      const data = await res.json();
      // history display is on the dashboard page
    } catch {}
  }

  function handleFeatureChange(id) {
    if (id === "__copy__" || id.startsWith("__copy_")) {
      setMode("copy");
      setCopyStep(1); setCopyResult(null); setCopyError("");
    } else if (id === "website-leads") {
      setMode("website-leads");
      setWlStep(1); setWlLeads([]); setWlError(""); setWlNiche(""); setWlState(""); setWlCity(""); setWlArea(""); setWlQueryLabel(""); setWlSources(0); setWlSuggestion(null);
    } else if (id === "instagram-india") {
      setMode("instagram-india");
      setIgStep(1); setIgLeads([]); setIgError(""); setIgNiche(""); setIgState(""); setIgCity(""); setIgArea(""); setIgCountry(""); setIgIsIntl(false); setIgQueryLabel(""); setIgSuggestion(null);
    } else if (id === "linkedin-india") {
      setMode("linkedin-india");
      setLiStep(1); setLiLeads([]); setLiError(""); setLiNiche(""); setLiState(""); setLiCity(""); setLiArea(""); setLiJobTitle(""); setLiCountry(""); setLiIsIntl(false); setLiQueryLabel(""); setLiSuggestion(null);
    } else if (id === "instagram-leads") {
      setMode("instagram");
      setIgStep(1); setIgLeads([]); setIgError(""); setIgNiche(""); setIgState(""); setIgCity(""); setIgArea(""); setIgCountry(""); setIgIsIntl(false); setIgQueryLabel(""); setIgSuggestion(null);
    } else if (id === "linkedin-leads") {
      setMode("linkedin");
      setLiStep(1); setLiLeads([]); setLiError(""); setLiNiche(""); setLiState(""); setLiCity(""); setLiArea(""); setLiJobTitle(""); setLiCountry(""); setLiIsIntl(false); setLiQueryLabel(""); setLiSuggestion(null);
    } else if (id === "exim-domestic") {
      setMode("exim");
      setEximStep(1); setEximLeads([]); setEximError(""); setEximProduct(""); setEximTradeType("exporter"); setEximState(""); setEximCity(""); setEximHsCode(""); setEximTotalSeen(0); setEximSuggestion(null);
    } else if (id === "intl-map-leads") {
      setMode("intl-map");
      setIntlMapStep(1); setIntlMapLeads([]); setIntlMapError(""); setIntlMapNiche(""); setIntlMapCountry(""); setIntlMapProvince(""); setIntlMapCity(""); setIntlMapQueryLabel(""); setIntlMapSources(0);
    } else if (id === "intl-web-leads") {
      setMode("intl-web");
      setIntlWebStep(1); setIntlWebLeads([]); setIntlWebError(""); setIntlWebNiche(""); setIntlWebCountry(""); setIntlWebCity(""); setIntlWebQueryLabel(""); setIntlWebSources(0);
    } else if (id === "exim-intl") {
      setMode("intl-exim");
      setIntlEximStep(1); setIntlEximLeads([]); setIntlEximError(""); setIntlEximProduct(""); setIntlEximTradeType("exporter"); setIntlEximCountry(""); setIntlEximCity(""); setIntlEximHsCode(""); setIntlEximTotalSeen(0);
    } else if (id === "tender-india") {
      setMode("tender-india");
      setIndiaTStep(1); setIndiaTenders([]); setIndiaTError("");
    } else if (id === "tender-intl") {
      setMode("tender-intl");
      setIntlTStep(1); setIntlTenders([]); setIntlTError("");
    } else if (id === "group-domestic") {
      setMode("group-domestic");
      setGrpStep(1); setGrpGroups([]); setGrpError(""); setGrpNiche(""); setGrpCountry(""); setGrpIsIntl(false);
      setGrpPlatforms(["whatsapp"]); setGrpSuggestion(null);
    } else if (id === "group-intl") {
      setMode("group-intl");
      setGrpStep(1); setGrpGroups([]); setGrpError(""); setGrpNiche(""); setGrpCountry(""); setGrpIsIntl(true);
      setGrpPlatforms(["whatsapp"]); setGrpSuggestion(null);
    } else if (id === "freelancer-leads") {
      setMode("freelancer");
      setFlStep(1); setFlLeads([]); setFlError(""); setFlService(""); setFlCountry("global"); setFlQueryLabel(""); flSeenRef.current = new Set();
    } else if (id === "startup-founders") {
      setMode("startup-founders");
      setSfStep(1); setSfLeads([]); setSfError(""); setSfService(""); setSfCountry("global"); setSfQueryLabel(""); sfSeenRef.current = new Set();
    } else if (id === "saved-leads") {
      setMode("saved-leads");
      loadSavedLeads();
      loadPipeline(); // silently populate pipeLeadIds for the "+ Pipeline" button
    } else if (id === "search-history") {
      setMode("search-history");
      setHistSessions([]); setHistCursor(null); setHistHasMore(false); setHistStats(null);
      loadHistory("", null);
    } else if (id === "trigger-leads") {
      setMode("trigger-leads");
      setTriggerStep(1); setTriggerLeads([]); setTriggerError(""); setTriggerParams({});
    } else if (id === "mca-companies") {
      setMode("mca-companies");
      setMcaStep(1); setMcaLeads([]); setMcaError(""); setMcaParams({});
    } else if (id === "intl-companies") {
      setMode("intl-companies");
      setIntlCoStep(1); setIntlCoLeads([]); setIntlCoError(""); setIntlCoParams({});
    } else if (id === "pipeline-crm") {
      setMode("pipeline-crm");
      loadPipeline();
    } else if (id === "outreach-sequences") {
      setMode("outreach-sequences");
      setOrchStep(1); setOrchSequence(null); setOrchError(""); setOrchSaved(false); setOrchPreFillLead(null);
      loadOrchSequences();
    } else {
      // google-map-leads
      setMode("google-map");
      setStep(1); setLeads([]); setError(""); setGmSuggestion(null);
    }
  }

  const handleWebsiteLeadsSearch = async (niche, state, city, area, count = 20, specialInstructions = "") => {
    setWlNiche(niche); setWlState(state); setWlCity(city); setWlArea(area); setWlCount(count);
    setWlError(""); setWlLeads([]); setWlAiInsight(""); setWlStep(2);
    const locationParts = [area, city, state].filter(Boolean);
    const locationStr = locationParts.length ? locationParts.join(", ") : "India";
    const query = `${niche} in ${locationStr}`;
    const previousLeadNames = getSeenIds("wl", niche, state, city);
    try {
      const res  = await leadPost("/api/lead-gen/ai-website-leads", user, { query, previousLeadNames, count, specialInstructions, isInternational: false, country: "India" });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not extract leads");
      const newLeads = data.leads || [];
      saveSeenIds("wl", niche, state, city, newLeads.map(l => l.name).filter(Boolean));
      setWlLeads(newLeads);
      setWlQueryLabel(data.queryLabel || query);
      setWlSources(data.sourcesSearched || 0);
      setWlAiInsight(data.ai_insight || "");
      if (data.quotaUsed !== undefined) setLeadQuota(q => ({ ...q, used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit }));
      setWlStep(3);
      saveToHistory("website-leads", "Website Leads", query, { niche, state, city, resultsCount: newLeads.length }, newLeads);
    } catch (err) {
      setWlError(err.message);
      setWlStep(1);
      fetchAdvisor("website-leads", "no_results", { query: `${niche} in ${locationStr}`, city, state }, setWlSuggestion, setWlSugLoading);
    }
  };

  const handleWebsiteLeadsLoadMore = async () => {
    setWlLoadingMore(true);
    const locationParts = [wlArea, wlCity, wlState].filter(Boolean);
    const locationStr = locationParts.length ? locationParts.join(", ") : "India";
    const query = `${wlNiche} in ${locationStr}`;
    const allSeenNames = getSeenIds("wl", wlNiche, wlState, wlCity);
    try {
      const res = await leadPost("/api/lead-gen/ai-website-leads", user, { query, previousLeadNames: allSeenNames, count: 20, isInternational: false, country: "India" });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load more leads");
      const newLeads = data.leads || [];
      saveSeenIds("wl", wlNiche, wlState, wlCity, newLeads.map(l => l.name).filter(Boolean));
      setWlLeads(prev => [...prev, ...newLeads]);
      setWlSources(data.sourcesSearched || 0);
    } catch (err) {
      setWlError(err.message);
    } finally {
      setWlLoadingMore(false);
    }
  };

  // Instagram Leads search
  const handleInstagramSearch = async (niche, state, city, area, accountType, country = "", isInternational = false, specialInstructions = "", minFollowers = null, maxFollowers = null) => {
    setIgNiche(niche); setIgState(state); setIgCity(city); setIgArea(area);
    setIgCountry(country); setIgIsIntl(isInternational);
    setIgAccountType(accountType || "business");
    setIgMinFollowers(minFollowers); setIgMaxFollowers(maxFollowers);
    setIgError(""); setIgLeads([]); setIgAiInsight(""); setIgStep(2);
    const location = isInternational
      ? [city, country].filter(Boolean).join(", ")
      : [area, city, state, "India"].filter(Boolean).join(", ");
    const seenKey = isInternational ? country : state;
    const previousHandles = getSeenIds("ig", niche, seenKey, city);
    try {
      const res  = await leadPost("/api/lead-gen/instagram-leads", user, { niche, location, accountType, count: 20, previousHandles, isInternational, specialInstructions, minFollowers, maxFollowers });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not fetch Instagram leads");
      if (data.quotaUsed !== undefined) setLeadQuota(q => ({ ...q, used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit }));
      const newLeads = data.leads || [];
      saveSeenIds("ig", niche, seenKey, city, newLeads.map(l => l.handle).filter(Boolean));
      setIgLeads(newLeads);
      setIgAiInsight(data.ai_insight || "");
      setIgQueryLabel(data.queryLabel || `${niche} - ${city}${isInternational ? ", " + country : state ? ", " + state : ""}`);
      setIgStep(3);
      saveToHistory(isInternational ? "instagram-intl" : "instagram", "Instagram Leads", `${niche}${city ? " · " + city : ""}`, { niche, city, country, resultsCount: newLeads.length }, newLeads);
    } catch (err) {
      setIgError(err.message);
      setIgStep(1);
      const igIssue = (minFollowers || maxFollowers) ? "follower_range" : "no_results";
      fetchAdvisor("instagram", igIssue, { niche, city, accountType, minFollowers, maxFollowers }, setIgSuggestion, setIgSugLoading);
    }
  };

  const handleInstagramLoadMore = async () => {
    setIgLoadingMore(true);
    const location = igIsIntl
      ? [igCity, igCountry].filter(Boolean).join(", ")
      : [igArea, igCity, igState, "India"].filter(Boolean).join(", ");
    const seenKey = igIsIntl ? igCountry : igState;
    const allSeenHandles = getSeenIds("ig", igNiche, seenKey, igCity);
    try {
      const res = await leadPost("/api/lead-gen/instagram-leads", user, { niche: igNiche, location, accountType: igAccountType || "business", count: 20, previousHandles: allSeenHandles, isInternational: igIsIntl, minFollowers: igMinFollowers, maxFollowers: igMaxFollowers });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error("No new leads found for this niche/location. Try a different niche or location.");
      const newLeads = data.leads || [];
      saveSeenIds("ig", igNiche, seenKey, igCity, newLeads.map(l => l.handle).filter(Boolean));
      setIgLeads(prev => [...prev, ...newLeads]);
    } catch (err) {
      setIgError(err.message);
    } finally {
      setIgLoadingMore(false);
    }
  };

  // LinkedIn Leads search
  const handleLinkedInSearch = async (niche, state, city, area, jobTitle, country = "", isInternational = false, specialInstructions = "", searchType = "both") => {
    setLiNiche(niche); setLiState(state); setLiCity(city); setLiArea(area); setLiJobTitle(jobTitle);
    setLiSpecialInstructions(specialInstructions);
    setLiCountry(country); setLiIsIntl(isInternational);
    setLiError(""); setLiLeads([]); setLiAiInsight(""); setLiStep(2);
    const location = isInternational
      ? [city, country].filter(Boolean).join(", ")
      : [area, city, state, "India"].filter(Boolean).join(", ") || "India";
    const seenKey = isInternational ? country : state;
    const previousIds = getSeenIds("li", niche, seenKey, city);
    try {
      const res  = await leadPost("/api/lead-gen/linkedin-leads", user, { niche, location, jobTitle, count: 20, previousIds, specialInstructions, searchType });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not fetch LinkedIn leads");
      if (data.quotaUsed !== undefined) setLeadQuota(q => ({ ...q, used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit }));
      const newLeads = data.leads || [];
      saveSeenIds("li", niche, seenKey, city, newLeads.map(l => l.linkedinId).filter(Boolean));
      setLiLeads(newLeads);
      setLiAiInsight(data.ai_insight || "");
      setLiQueryLabel(data.queryLabel || `${niche} - ${city}${isInternational ? ", " + country : state ? ", " + state : ""}`);
      setLiStep(3);
      saveToHistory(isInternational ? "linkedin-intl" : "linkedin", "LinkedIn Leads", `${niche}${city ? " · " + city : ""}`, { niche, city, country, jobTitle, resultsCount: newLeads.length }, newLeads);
    } catch (err) {
      setLiError(err.message);
      setLiStep(1);
      fetchAdvisor("linkedin", "no_results", { niche, city, state, country, jobTitle }, setLiSuggestion, setLiSugLoading);
    }
  };

  const handleLinkedInLoadMore = async () => {
    setLiLoadingMore(true);
    const location = liIsIntl
      ? [liCity, liCountry].filter(Boolean).join(", ")
      : [liArea, liCity, liState, "India"].filter(Boolean).join(", ") || "India";
    const seenKey = liIsIntl ? liCountry : liState;
    const allSeenIds = getSeenIds("li", liNiche, seenKey, liCity);
    try {
      const res = await leadPost("/api/lead-gen/linkedin-leads", user, { niche: liNiche, location, jobTitle: liJobTitle, count: 20, previousIds: allSeenIds });
      const data = await safeJson(res);
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load more leads");
      const newLeads = data.leads || [];
      saveSeenIds("li", liNiche, seenKey, liCity, newLeads.map(l => l.linkedinId).filter(Boolean));
      setLiLeads(prev => [...prev, ...newLeads]);
    } catch (err) {
      setLiError(err.message);
    } finally {
      setLiLoadingMore(false);
    }
  };

  // Google Map Leads search
  const handleGoogleMapSearch = async (category, activeCity, quantity, area = "", state = "", country = "India", isInternational = false, aiFilter = "") => {
    setNicheLabel(category);
    setCity(activeCity);
    setGmCategory(category);
    setGmArea(area);
    setGmState(state);
    setGmCountry(country || "India");
    setGmIsIntl(isInternational || false);
    setError("");
    setAiFilterStats(null);
    setStep(2);
    try {
      // When AI filter is on: fetch max pool (60) across 3 query variations for broader city coverage
      const fetchQuantity = aiFilter ? 60 : quantity;
      const res  = await leadPost("/api/lead-gen/fetch-leads", user, { niche: "google-map-leads", category, city: activeCity, quantity: fetchQuantity, area, state, country, isInternational, aiFilter });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (data.quotaUsed !== undefined) setLeadQuota(q => ({ ...q, used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit }));
      let newLeads = (data.leads || []).map(l => ({ ...l, status: "new" }));

      // AI filter: now has up to 60 leads to filter from (3x pool vs before)
      if (aiFilter && newLeads.length > 0) {
        try {
          const filterRes = await fetch("/api/lead-gen/ai-gmb-filter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leads: newLeads, requirement: aiFilter }),
          });
          const filterData = await filterRes.json();
          if (filterData.filteredIndices) {
            const idxSet = new Set(filterData.filteredIndices);
            const filteredLeads = newLeads.filter((_, i) => idxSet.has(i));
            setAiFilterStats({ matched: filteredLeads.length, total: newLeads.length, requirement: aiFilter });
            newLeads = filteredLeads;
          }
        } catch {
          // AI filter failed silently show all leads
        }
      }

      if (newLeads.length === 0) {
        setError("0 verified leads found. Area specific karo ya Website Leads try karo.");
        setStep(1);
        if (!isInternational) fetchAdvisor("google-map", "no_results", { category, city: activeCity, state }, setGmSuggestion, setGmSugLoading);
      } else {
        setLeads(newLeads);
        setStep(3);
        saveToHistory(isInternational ? "intl-map" : "google-map", isInternational ? "Intl Map Leads" : "Google Map Leads", `${category} · ${activeCity}${country !== "India" ? ", " + country : ""}`, { category, city: activeCity, state, country, resultsCount: newLeads.length }, newLeads);
      }
    } catch (err) {
      setError(err.message);
      setStep(1);
      if (!isInternational) fetchAdvisor("google-map", "no_results", { category, city: activeCity, state }, setGmSuggestion, setGmSugLoading);
    }
  };

  // Google Map Leads - load more (deduplicates via previousPlaceIds)
  const handleGmLoadMore = async () => {
    setGmLoadingMore(true);
    try {
      const currentIds = leads.map(l => l.place_id).filter(Boolean);
      const res = await leadPost("/api/lead-gen/fetch-leads", user, {
        niche: "google-map-leads",
        category: gmCategory,
        city,
        quantity: 20,
        area: gmArea,
        state: gmState,
        country: gmCountry,
        isInternational: gmIsIntl,
        previousPlaceIds: currentIds,
      });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok) throw new Error(data.error || "Could not load more leads");
      const newLeads = (data.leads || []).map(l => ({ ...l, status: "new" }));
      if (data.quotaUsed !== undefined) setLeadQuota(q => ({ ...q, used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit }));
      setLeads(prev => [...prev, ...newLeads]);
    } catch (err) {
      setError(err.message);
    } finally {
      setGmLoadingMore(false);
    }
  };

  // Shared advisor fetch - call on any tool failure
  const fetchAdvisor = (tool, issue, context, setSuggestion, setLoading) => {
    setLoading(true);
    fetch("/api/lead-gen/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool, issue, context }),
    }).then(r => r.json()).then(d => {
      if (d.success) setSuggestion(d);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  // Switch tool from advisor chip - clears current state and navigates
  const switchToTool = (toolId) => {
    if (!toolId) return;
    if (toolId === "website-leads") {
      setMode("website-leads"); setWlStep(1); setWlLeads([]); setWlError(""); setWlSuggestion(null);
    } else if (toolId === "google-map-leads") {
      setMode("google-map"); setStep(1); setLeads([]); setError(""); setGmSuggestion(null);
    } else if (toolId === "instagram-india") {
      setMode("instagram-india"); setIgStep(1); setIgLeads([]); setIgError(""); setIgSuggestion(null);
    } else if (toolId === "linkedin-india") {
      setMode("linkedin-india"); setLiStep(1); setLiLeads([]); setLiError(""); setLiSuggestion(null);
    }
  };

  // Copy Gen generate
  const handleCopyGenerate = async (formData) => {
    setCopyProduct(formData.productName);
    setCopyModel(formData.model || "openai");
    setCopyStep(2);
    setCopyError("");
    try {
      const res  = await fetch("/api/lead-copy/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCopyResult(data.result);
      setCopyStep(3);
    } catch (err) {
      setCopyError(err.message);
      setCopyStep(1);
    }
  };

  // AI Modifier
  const handleCopyModify = async (modificationRequest, currentResult) => {
    const res = await fetch("/api/lead-copy/modify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ existingCampaign: currentResult, modificationRequest, productName: copyProduct, model: copyModel }),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.error || "Modification failed");
    setCopyResult(data.result);
  };

  const handleCopyReset = () => { setCopyStep(1); setCopyResult(null); setCopyError(""); };

  // Export-Import Leads search
  const handleEximSearch = async (product, tradeType, state, city, area, hsCode, specialInstructions = "") => {
    setEximProduct(product); setEximTradeType(tradeType); setEximState(state); setEximCity(city); setEximHsCode(hsCode);
    setEximError(""); setEximLeads([]); setEximTotalSeen(0); setEximSuggestion(null); setEximStep(2);
    try {
      const res = await leadPost("/api/lead-gen/export-import-leads", user, { product, tradeType, state, city, hsCode, specialInstructions });
      const data = await safeJson(res);
      if (!res.ok || !data.success) throw new Error(data.error || "Could not fetch leads");
      setEximLeads(data.leads || []);
      setEximTotalSeen(data.total_seen || (data.leads || []).length);
      setEximStep(3);
      saveToHistory("exim", "Exporter / Importer", product, { product, tradeType, state, city, resultsCount: (data.leads || []).length }, data.leads || []);
    } catch (err) {
      setEximError(err.message);
      setEximStep(1);
      // Fetch AI suggestion when search fails
      if (state || product) {
        setEximSugLoading(true);
        fetch("/api/lead-gen/exim-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product, state, tradeType }),
        }).then(r => r.json()).then(d => {
          if (d.success) setEximSuggestion(d);
        }).catch(() => {}).finally(() => setEximSugLoading(false));
      }
    }
  };

  const handleEximLoadMore = async () => {
    setEximLoadingMore(true);
    try {
      const res = await leadPost("/api/lead-gen/export-import-leads", user, { product:eximProduct, tradeType:eximTradeType, state:eximState, city:eximCity, hsCode:eximHsCode });
      const data = await safeJson(res);
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load more leads");
      setEximLeads(prev => [...prev, ...(data.leads || [])]);
      setEximTotalSeen(data.total_seen || 0);
    } catch (err) {
      setEximError(err.message);
    } finally {
      setEximLoadingMore(false);
    }
  };

  const handleIntlMapSearch = async (niche, country, city, province = "", aiFilter = "") => {
    setIntlMapNiche(niche); setIntlMapCountry(country); setIntlMapCity(city); setIntlMapProvince(province);
    setIntlMapError(""); setIntlMapLeads([]); setIntlMapAiFilterStats(null); setIntlMapStep(2);
    try {
      const fetchQuantity = aiFilter ? 60 : 20;
      const res = await leadPost("/api/lead-gen/fetch-leads", user, { niche: "google-map-leads", category: niche, city, country, state: province, quantity: fetchQuantity, area: "", isInternational: true, aiFilter });
      const data = await safeJson(res);
      if (!res.ok || data.error) throw new Error(data.error || "Could not extract leads");
      let newLeads = (data.leads || []).map(l => ({ ...l, status: "new" }));

      if (aiFilter && newLeads.length > 0) {
        try {
          const filterRes = await fetch("/api/lead-gen/ai-gmb-filter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leads: newLeads, requirement: aiFilter }),
          });
          const filterData = await filterRes.json();
          if (filterData.filteredIndices) {
            const idxSet = new Set(filterData.filteredIndices);
            const filteredLeads = newLeads.filter((_, i) => idxSet.has(i));
            setIntlMapAiFilterStats({ matched: filteredLeads.length, total: newLeads.length, requirement: aiFilter });
            newLeads = filteredLeads;
          }
        } catch {
          // AI filter failed silently, show all leads
        }
      }

      setIntlMapLeads(newLeads);
      setIntlMapStep(3);
      const locationLabel = [city, province, country].filter(Boolean).join(", ");
      saveToHistory("intl-map", "Intl Map Leads", `${niche} · ${locationLabel}`, { niche, city, province, country, resultsCount: newLeads.length }, newLeads);
    } catch (err) {
      setIntlMapError(err.message);
      setIntlMapStep(1);
    }
  };

  const handleIntlMapLoadMore = async () => {
    setIntlMapLoadingMore(true);
    try {
      const res = await leadPost("/api/lead-gen/fetch-leads", user, { niche: "google-map-leads", category: intlMapNiche, city: intlMapCity, country: intlMapCountry, state: intlMapProvince, quantity: 20, area: "", isInternational: true });
      const data = await safeJson(res);
      if (!res.ok || data.error) throw new Error(data.error || "Could not load more leads");
      const newLeads = (data.leads || []).map(l => ({ ...l, status: "new" }));
      setIntlMapLeads(prev => [...prev, ...newLeads]);
    } catch (err) {
      setIntlMapError(err.message);
    } finally {
      setIntlMapLoadingMore(false);
    }
  };

  const handleIntlWebSearch = async (niche, country, city, count = 20, specialInstructions = "") => {
    setIntlWebNiche(niche); setIntlWebCountry(country); setIntlWebCity(city); setIntlWebCount(count);
    setIntlWebError(""); setIntlWebLeads([]); setIntlWebStep(2);
    const query = city ? `${niche} in ${city}, ${country}` : `${niche} in ${country}`;
    const previousLeadNames = getSeenIds("intlweb", niche, country, city);
    try {
      const res = await leadPost("/api/lead-gen/ai-website-leads", user, { query, previousLeadNames, count, isInternational: true, country, specialInstructions });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not extract leads");
      const newLeads = data.leads || [];
      saveSeenIds("intlweb", niche, country, city, newLeads.map(l => l.name).filter(Boolean));
      setIntlWebLeads(newLeads);
      setIntlWebQueryLabel(data.queryLabel || query);
      setIntlWebSources(data.sourcesSearched || 0);
      setIntlWebStep(3);
      saveToHistory("intl-web", "Intl Website Leads", `${niche} · ${country}`, { niche, city, country, resultsCount: newLeads.length }, newLeads);
    } catch (err) {
      setIntlWebError(err.message);
      setIntlWebStep(1);
    }
  };

  const handleIntlWebLoadMore = async () => {
    setIntlWebLoadingMore(true);
    const query = intlWebCity ? `${intlWebNiche} in ${intlWebCity}, ${intlWebCountry}` : `${intlWebNiche} in ${intlWebCountry}`;
    const allSeenNames = getSeenIds("intlweb", intlWebNiche, intlWebCountry, intlWebCity);
    try {
      const res = await leadPost("/api/lead-gen/ai-website-leads", user, { query, previousLeadNames: allSeenNames, count: 20, isInternational: true, country: intlWebCountry });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load more leads");
      const newLeads = data.leads || [];
      saveSeenIds("intlweb", intlWebNiche, intlWebCountry, intlWebCity, newLeads.map(l => l.name).filter(Boolean));
      setIntlWebLeads(prev => [...prev, ...newLeads]);
      setIntlWebSources(data.sourcesSearched || 0);
    } catch (err) {
      setIntlWebError(err.message);
    } finally {
      setIntlWebLoadingMore(false);
    }
  };

  const handleIntlEximSearch = async (product, tradeType, country, city, hsCode, specialInstructions = "") => {
    setIntlEximProduct(product); setIntlEximTradeType(tradeType); setIntlEximCountry(country); setIntlEximCity(city); setIntlEximHsCode(hsCode);
    setIntlEximError(""); setIntlEximLeads([]); setIntlEximTotalSeen(0); setIntlEximStep(2);
    try {
      const res = await leadPost("/api/lead-gen/intl-export-import-leads", user, { product, tradeType, country, city, hsCode, specialInstructions });
      const data = await safeJson(res);
      if (!res.ok || !data.success) throw new Error(data.error || "Could not fetch leads");
      setIntlEximLeads(data.leads || []);
      setIntlEximTotalSeen(data.total_seen || (data.leads || []).length);
      setIntlEximStep(3);
      saveToHistory("intl-exim", "Intl Traders", product, { product, tradeType, country, city, resultsCount: (data.leads || []).length }, data.leads || []);
    } catch (err) {
      setIntlEximError(err.message);
      setIntlEximStep(1);
    }
  };

  const handleIntlEximLoadMore = async () => {
    setIntlEximLoadingMore(true);
    try {
      const res = await leadPost("/api/lead-gen/intl-export-import-leads", user, { product: intlEximProduct, tradeType: intlEximTradeType, country: intlEximCountry, city: intlEximCity, hsCode: intlEximHsCode });
      const data = await safeJson(res);
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load more leads");
      setIntlEximLeads(prev => [...prev, ...(data.leads || [])]);
      setIntlEximTotalSeen(data.total_seen || 0);
    } catch (err) {
      setIntlEximError(err.message);
    } finally {
      setIntlEximLoadingMore(false);
    }
  };

  const handleGroupFinderSearch = async (niche, platforms, country, isIntl, recency = null) => {
    // Reset seen URLs and page only when niche/platform truly changes
    const isNewSearch = grpNiche !== niche || (grpPlatforms?.[0] !== platforms?.[0]);
    let nextPage = 1;
    if (isNewSearch) {
      grpSeenRef.current = new Set();
    } else {
      // Same niche re-search: advance to next page so Redis cache returns different results
      nextPage = grpSearchPage + 1;
    }
    setGrpNiche(niche); setGrpPlatforms(platforms); setGrpCountry(country); setGrpIsIntl(isIntl); setGrpRecency(recency); setGrpSearchPage(nextPage);
    setGrpError(""); setGrpGroups([]); setGrpStep(2); setGrpLoading(true);
    setGrpQuotaHit(false);
    try {
      const res  = await leadPost("/api/lead-gen/group-finder", user, {
        category: niche, platforms, isInternational: isIntl, country,
        excludeUrls: [
          ...grpSeenRef.current,
          ...(() => { try { return JSON.parse(localStorage.getItem("ts_dismissed_groups") || "[]"); } catch { return []; } })(),
        ],
        recency, searchPage: nextPage,
      });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) { setGrpQuotaHit(true); setGrpStep(4); return; }
      if (!res.ok || !data.success) throw new Error(data.error || "Could not find groups");
      const groups = data.groups || [];
      groups.forEach(g => grpSeenRef.current.add(g.url));
      setGrpGroups(groups);
      if (data.quotaUsed !== undefined) setGrpQuota({ used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit });
      setGrpStep(3);
      saveToHistory("group-finder", "Group Finder", niche, { platform: platforms[0], country, isIntl, resultsCount: groups.length }, groups);
    } catch (err) {
      setGrpError(err.message);
      setGrpStep(1);
      fetchAdvisor("group-finder", "no_results", { niche, platforms, country }, setGrpSuggestion, setGrpSugLoading);
    } finally {
      setGrpLoading(false);
    }
  };

  const handleGroupFinderLoadMore = async () => {
    setGrpLoadingMore(true); setGrpError(""); setGrpQuotaHit(false);
    try {
      const res = await leadPost("/api/lead-gen/group-finder", user, {
        category: grpNiche, platforms: grpPlatforms, isInternational: grpIsIntl, country: grpCountry,
        excludeUrls: [
          ...grpSeenRef.current,
          ...(() => { try { return JSON.parse(localStorage.getItem("ts_dismissed_groups") || "[]"); } catch { return []; } })(),
        ],
        recency: grpRecency,
        searchPage: grpSearchPage + 1,
      });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) { setGrpQuotaHit(true); return; }
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load more groups");
      const newGroups = data.groups || [];
      newGroups.forEach(g => grpSeenRef.current.add(g.url));
      setGrpGroups(prev => [...prev, ...newGroups]);
      setGrpSearchPage(p => p + 1);
      if (data.quotaUsed !== undefined) setGrpQuota({ used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit });
    } catch (err) {
      setGrpError(err.message);
    } finally {
      setGrpLoadingMore(false);
    }
  };

  /* ── Freelancer Client Leads handlers ──────────────────────────────────── */
  const handleFreelancerSearch = async (service, country, recency = "day") => {
    setFlService(service); setFlCountry(country);
    setFlError(""); setFlLeads([]); setFlStep(2);
    const alreadySeen = getSeenIds("fl", service, country, "");
    flSeenRef.current = new Set(alreadySeen);
    try {
      const res  = await leadPost("/api/lead-gen/freelancer-leads", user, { service, country, count: 15, previousUrls: alreadySeen, recency });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not find clients");
      if (data.quotaUsed !== undefined) setLeadQuota(q => ({ ...q, used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit }));
      const newLeads = data.leads || [];
      const newUrls  = newLeads.map(l => l.profileUrl).filter(Boolean);
      saveSeenIds("fl", service, country, "", newUrls);
      newUrls.forEach(u => flSeenRef.current.add(u));
      setFlLeads(newLeads);
      setFlQueryLabel(data.queryLabel || `${service} Clients`);
      setFlStep(3);
    } catch (err) { setFlError(err.message); setFlStep(1); }
  };

  const handleFreelancerLoadMore = async () => {
    setFlLoadingMore(true);
    try {
      // Get the full persisted list (includes all sessions) for maximum dedup
      const allSeen = getSeenIds("fl", flService, flCountry, "");
      const res  = await leadPost("/api/lead-gen/freelancer-leads", user, { service: flService, country: flCountry, count: 15, previousUrls: allSeen });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load more leads");
      const newLeads = data.leads || [];
      const newUrls  = newLeads.map(l => l.profileUrl).filter(Boolean);
      saveSeenIds("fl", flService, flCountry, "", newUrls);
      newUrls.forEach(u => flSeenRef.current.add(u));
      setFlLeads(prev => [...prev, ...newLeads]);
    } catch (err) { setFlError(err.message); }
    finally { setFlLoadingMore(false); }
  };

  const handleFreelancerClearSeen = (service, country) => {
    try { localStorage.removeItem(lsKey("fl", service, country, "")); } catch {}
    flSeenRef.current = new Set();
  };

  /* ── Startup Founder Leads handlers ─────────────────────────────────────── */
  const handleStartupFounderSearch = async (service, country) => {
    setSfService(service); setSfCountry(country);
    setSfError(""); setSfLeads([]); setSfStep(2);
    const alreadySeen = getSeenIds("sf", service, country, "");
    sfSeenRef.current = new Set(alreadySeen);
    try {
      const res  = await leadPost("/api/lead-gen/startup-founders", user, { service, country, count: 15, previousUrls: alreadySeen });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not find founders");
      if (data.quotaUsed !== undefined) setLeadQuota(q => ({ ...q, used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit }));
      const newLeads = data.leads || [];
      const newUrls  = newLeads.map(l => l.profileUrl).filter(Boolean);
      saveSeenIds("sf", service, country, "", newUrls);
      newUrls.forEach(u => sfSeenRef.current.add(u));
      setSfLeads(newLeads);
      setSfQueryLabel(data.queryLabel || `${service} Founders`);
      setSfStep(3);
    } catch (err) { setSfError(err.message); setSfStep(1); }
  };

  const handleStartupFounderLoadMore = async () => {
    setSfLoadingMore(true);
    try {
      const allSeen = getSeenIds("sf", sfService, sfCountry, "");
      const res  = await leadPost("/api/lead-gen/startup-founders", user, { service: sfService, country: sfCountry, count: 15, previousUrls: allSeen });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load more leads");
      const newLeads = data.leads || [];
      const newUrls  = newLeads.map(l => l.profileUrl).filter(Boolean);
      saveSeenIds("sf", sfService, sfCountry, "", newUrls);
      newUrls.forEach(u => sfSeenRef.current.add(u));
      setSfLeads(prev => [...prev, ...newLeads]);
    } catch (err) { setSfError(err.message); }
    finally { setSfLoadingMore(false); }
  };

  const handleStartupFounderClearSeen = (service, country) => {
    try { localStorage.removeItem(lsKey("sf", service, country, "")); } catch {}
    sfSeenRef.current = new Set();
  };

  /* ── Outreach Sequences handlers ──────────────────────────────────────── */
  const loadOrchSequences = async (cur = null) => {
    if (!user) return;
    setOrchSeqLoading(true);
    try {
      const token = await user.getIdToken();
      const url   = `/api/leads/outreach-sequences?limit=20${cur ? `&cursor=${cur}` : ""}`;
      const res   = await fetch(url, { headers:{ Authorization:`Bearer ${token}` } });
      const data  = await res.json();
      if (cur) setOrchSavedSeqs(prev => [...prev, ...(data.sequences || [])]);
      else     setOrchSavedSeqs(data.sequences || []);
      setOrchHasMore(data.hasMore || false);
      setOrchCursor(data.nextCursor || null);
    } catch {}
    finally { setOrchSeqLoading(false); }
  };

  const handleOrchGenerate = async ({ lead, senderName, senderCompany, senderProduct, goal, tone, steps }) => {
    if (!user) return;
    setOrchLoading(true); setOrchStep(2); setOrchError(""); setOrchSaved(false);
    setOrchLeadName(lead.businessName); setOrchGoal(goal); setOrchTone(tone);
    try {
      const token = await user.getIdToken();
      const res   = await fetch("/api/leads/outreach", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ lead, senderName, senderCompany, senderProduct, goal, tone, steps }),
      });
      const data = await res.json();
      if (data.sequence) {
        setOrchSequence(data.sequence);
        setOrchWhatsapp(data.whatsapp || null);
        setOrchLinkedin(data.linkedin || null);
        setOrchStep(3);
      } else { setOrchError(data.error || "Generation failed"); setOrchStep(1); }
    } catch (e) { setOrchError(e.message); setOrchStep(1); }
    finally { setOrchLoading(false); }
  };

  const handleOrchSave = async () => {
    if (!user || !orchSequence) return;
    setOrchSaving(true);
    try {
      const token = await user.getIdToken();
      await fetch("/api/leads/outreach-sequences", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ leadName:orchLeadName, goal:orchGoal, tone:orchTone, sequence:orchSequence, status:"draft" }),
      });
      setOrchSaved(true);
      loadOrchSequences();
    } catch {}
    finally { setOrchSaving(false); }
  };

  const handleOrchDelete = async (id) => {
    setOrchDeletingId(id);
    try {
      const token = await user.getIdToken();
      await fetch(`/api/leads/outreach-sequences?id=${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } });
      setOrchSavedSeqs(prev => prev.filter(s => s.id !== id));
    } catch {}
    finally { setOrchDeletingId(null); }
  };

  const handleOrchStatusChange = async (id, status) => {
    try {
      const token = await user.getIdToken();
      await fetch("/api/leads/outreach-sequences", {
        method:"PATCH",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ id, status }),
      });
      setOrchSavedSeqs(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch {}
  };

  /* ── Pipeline CRM handlers ────────────────────────────────────────────── */
  const loadPipeline = async () => {
    if (!user) return;
    setPipeLoading(true);
    try {
      const token = await user.getIdToken();
      const res   = await fetch("/api/leads/pipeline", { headers: { Authorization: `Bearer ${token}` } });
      const data  = await res.json();
      const leads = data.leads || [];
      setPipeLeads(leads);
      // Rebuild set of savedLeadIds already in pipeline
      setPipeLeadIds(new Set(leads.map(l => l.savedLeadId).filter(Boolean)));
    } catch {}
    finally { setPipeLoading(false); }
  };

  const handleAddToPipeline = async (lead) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res   = await fetch("/api/leads/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ leadData: lead, savedLeadId: lead.id, source: "saved-leads" }),
      });
      const data = await res.json();
      if (res.status === 409) return; // already in pipeline — silent
      if (data.added) {
        setPipeLeadIds(prev => new Set([...prev, lead.id]));
      }
    } catch {}
  };

  const handlePipelineUpdate = async (id, fields) => {
    if (!user) return;
    // Optimistic update
    setPipeLeads(prev => prev.map(l => l.id === id ? { ...l, ...fields, updatedAt: Date.now(), ...(fields.stage ? { movedAt: Date.now() } : {}) } : l));
    try {
      const token = await user.getIdToken();
      await fetch("/api/leads/pipeline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, ...fields }),
      });
    } catch {}
  };

  const handlePipelineMarkSent = async (id, lead) => {
    if (!user) return;
    const nextStep    = (lead.currentSequenceStep || 0) + 1;
    const now         = Date.now();
    const newStage    = lead.stage === "new" ? "contacted" : lead.stage;
    const update      = {
      currentSequenceStep: nextStep,
      lastContactedAt:     lead.lastContactedAt || now,
      stage:               newStage,
    };
    setPipeLeads(prev => prev.map(l => l.id === id ? { ...l, ...update, updatedAt: now, movedAt: newStage !== lead.stage ? now : l.movedAt } : l));
    try {
      const token = await user.getIdToken();
      await fetch("/api/leads/pipeline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, ...update }),
      });
    } catch {}
  };

  const handlePipelineDelete = async (id) => {
    if (!user) return;
    setPipeLeads(prev => prev.filter(l => l.id !== id));
    try {
      const token = await user.getIdToken();
      await fetch(`/api/leads/pipeline?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    } catch {}
  };

  const handlePipelineGenerateOutreach = (pipelineLead) => {
    setOrchPreFillLead(pipelineLead.leadData || { businessName: pipelineLead.leadName, email: pipelineLead.leadEmail, phone: pipelineLead.leadPhone, website: pipelineLead.leadWebsite, industry: pipelineLead.leadIndustry, city: pipelineLead.leadCity });
    setOrchStep(1); setOrchSequence(null); setOrchError(""); setOrchSaved(false);
    setMode("outreach-sequences");
    loadOrchSequences();
  };

  /* ── Search History handlers ───────────────────────────────────────────── */
  const loadHistory = async (typeFilter, cursor, append = false) => {
    if (!user) return;
    setHistLoading(true);
    try {
      const token = await user.getIdToken();
      let url = `/api/leads/history?limit=20`;
      if (typeFilter)  url += `&type=${encodeURIComponent(typeFilter)}`;
      if (cursor)      url += `&cursor=${encodeURIComponent(cursor)}`;
      const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.error || "Failed to load history");
      const sessions = data.sessions || [];
      setHistSessions(prev => append ? [...prev, ...sessions] : sessions);
      setHistCursor(data.nextCursor || null);
      setHistHasMore(!!data.nextCursor);
      if (data.stats) setHistStats(data.stats);
    } catch { /* non-fatal */ }
    finally { setHistLoading(false); }
  };

  /* ── Saved Leads handlers ──────────────────────────────────────────────── */
  const loadSavedLeads = async () => {
    if (!user) return;
    setSavedLeadsLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res  = await fetch(`/api/leads/save?idToken=${encodeURIComponent(idToken)}&limit=50`);
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.error || "Failed to load");
      const fetchedLeads = data.leads || [];
      setSavedLeads(fetchedLeads);
      setSavedLeadsStats(data.stats || null);
      // Rebuild the savedLeadIds set from business names / phone (for matching existing leads)
      const ids = new Set(fetchedLeads.map(l => l.businessName).filter(Boolean));
      setSavedLeadIds(prev => new Set([...prev, ...ids]));
    } catch { /* non-fatal */ }
    finally { setSavedLeadsLoading(false); }
  };

  const handleSaveLead = async (lead) => {
    if (!user) return;
    const nameStr = lead.business_name || lead.businessName || lead.name || lead.company || "";
    const tempId  = lead.place_id || nameStr || lead.id;
    setSavingLeadId(tempId);
    try {
      const idToken = await user.getIdToken();
      const sourceStr = lead.source === "mca_real" ? "mca_companies"
        : lead.source === "intl_companies_real" ? "intl_companies"
        : lead.type === "international" ? "intl_companies"
        : lead.source || "google_maps";
      const mapped = {
        name:         nameStr,
        businessName: nameStr,
        phone:        lead.phone        || null,
        email:        lead.email        || null,
        website:      lead.website      || null,
        address:      lead.address      || lead.formatted_address || "",
        city:         lead.city         || "",
        state:        lead.state        || "",
        country:      lead.country      || "India",
        rating:       lead.rating       || null,
        reviewCount:  lead.total_ratings || lead.reviewCount || null,
        industry:     lead.category     || lead.industry     || null,
        source:       sourceStr,
        type:         lead.country && lead.country !== "India" ? "international" : "domestic",
        techStack:    lead.techStack    || [],
        socialLinks:  lead.socialLinks  || {},
        tags:         [],
      };
      const res  = await fetch("/api/leads/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, lead: mapped, action: "save" }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSavedLeadIds(prev => new Set([...prev, tempId, mapped.businessName]));
      }
    } catch { /* non-fatal */ }
    finally { setSavingLeadId(null); }
  };

  const handleEnrichLead = async (lead) => {
    if (!user) return;
    setEnrichingLeadId(lead.id);
    try {
      const idToken = await user.getIdToken();
      const res  = await fetch("/api/leads/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, leadId: lead.id, idToken }),
      });
      const data = await safeJson(res);
      if (data.enrichment) {
        setSavedLeads(prev => prev.map(l => l.id === lead.id ? { ...l, ...{
          aiLeadScore:       data.enrichment.leadScore,
          industry:          data.enrichment.industry          || l.industry,
          companySize:       data.enrichment.companySize,
          aiSummary:         data.enrichment.summary,
          aiPainPoints:      data.enrichment.painPoints,
          aiBestChannel:     data.enrichment.bestChannel,
          aiBestTime:        data.enrichment.bestTime,
          aiOutreachEmail:   data.enrichment.outreachEmail,
          aiOutreachWhatsapp:data.enrichment.outreachWhatsapp,
          aiOutreachLinkedin:data.enrichment.outreachLinkedin,
          tags:              data.enrichment.tags              || l.tags,
          opportunityType:   data.enrichment.opportunityType,
          urgency:           data.enrichment.urgency,
          aiNotes:           data.enrichment.notes,
          status:            "enriched",
        }} : l));
      }
    } catch { /* non-fatal */ }
    finally { setEnrichingLeadId(null); }
  };

  const handleDeleteLead = async (lead) => {
    if (!user || !window.confirm(`Delete "${lead.businessName || lead.name}"?`)) return;
    try {
      const idToken = await user.getIdToken();
      await fetch("/api/leads/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, lead: { id: lead.id }, action: "delete" }),
      });
      setSavedLeads(prev => prev.filter(l => l.id !== lead.id));
      setSavedLeadsStats(prev => prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev);
    } catch { /* non-fatal */ }
  };

  const handleFavoriteLead = async (lead) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res  = await fetch("/api/leads/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, lead: { id: lead.id }, action: "favorite" }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSavedLeads(prev => prev.map(l => l.id === lead.id ? { ...l, isFavorite: data.isFavorite } : l));
      }
    } catch { /* non-fatal */ }
  };

  const handleExportSavedLeads = async (specificIds) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const body = specificIds?.length
        ? { idToken, leadIds: specificIds }
        : { idToken, all: true };
      const res = await fetch("/api/leads/export", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
      if (!res.ok) return;
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = `saved-leads-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* non-fatal */ }
  };

  // MCA Companies handler
  const handleMcaCompaniesSearch = async (params) => {
    setMcaParams(params);
    setMcaError(""); setMcaLeads([]); setMcaStep(2); setMcaLoading(true);
    try {
      const res = await leadPost("/api/leads/mca-companies", user, { ...params });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch MCA companies");
      setMcaLeads(data.leads || []);
      setMcaStep(3);
    } catch (err) { setMcaError(err.message); setMcaStep(1); }
    finally { setMcaLoading(false); }
  };

  // International Companies handler
  const handleIntlCompaniesSearch = async (params) => {
    setIntlCoParams(params);
    setIntlCoError(""); setIntlCoLeads([]); setIntlCoStep(2); setIntlCoLoading(true);
    try {
      const res = await leadPost("/api/leads/intl-companies", user, { ...params });
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch international companies");
      setIntlCoLeads(data.leads || []);
      setIntlCoStep(3);
    } catch (err) { setIntlCoError(err.message); setIntlCoStep(1); }
    finally { setIntlCoLoading(false); }
  };

  // Trigger Leads (Job Intent) handler
  const handleTriggerLeadsSearch = async (params) => {
    setTriggerParams(params);
    setTriggerError(""); setTriggerLeads([]); setTriggerStep(2); setTriggerLoading(true);
    try {
      const res  = await leadPost("/api/leads/job-intent", user, params);
      const data = await safeJson(res);
      if (res.status === 402 || data.quotaExceeded) throw new Error(walletErrMsg(data));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not find trigger leads");
      if (data.quotaUsed !== undefined) setLeadQuota(q => ({ ...q, used: data.quotaUsed, remaining: data.quotaRemaining, limit: data.quotaLimit }));
      setTriggerLeads(data.leads || []);
      setTriggerStep(3);
      saveToHistory("trigger-leads", "Trigger Leads", `${params.jobRole} · ${params.state}`, { jobRole: params.jobRole, state: params.state, resultsCount: (data.leads || []).length }, data.leads || []);
    } catch (err) { setTriggerError(err.message); setTriggerStep(1); }
    finally { setTriggerLoading(false); }
  };

  // Which step to pass to ToolShell (used for progress indicator)
  const shellStep = mode === "tender-india" ? indiaTStep : mode === "tender-intl" ? intlTStep : mode === "copy" ? copyStep : mode === "website-leads" ? wlStep : mode === "instagram" || mode === "instagram-india" ? igStep : mode === "linkedin" || mode === "linkedin-india" ? liStep : mode === "exim" ? eximStep : mode === "intl-map" ? intlMapStep : mode === "intl-web" ? intlWebStep : mode === "intl-exim" ? intlEximStep : (mode === "group-domestic" || mode === "group-intl") ? grpStep : mode === "freelancer" ? flStep : mode === "startup-founders" ? sfStep : mode === "saved-leads" ? 1 : mode === "pipeline-crm" ? 1 : mode === "mca-companies" ? mcaStep : mode === "intl-companies" ? intlCoStep : mode === "trigger-leads" ? triggerStep : mode === "outreach-sequences" ? orchStep : step;
  const activeFeatureId = mode === "tender-india" ? "tender-india" : mode === "tender-intl" ? "tender-intl" : mode === "copy" ? "__copy__" : mode === "website-leads" ? "website-leads" : mode === "instagram" ? "instagram-leads" : mode === "instagram-india" ? "instagram-india" : mode === "linkedin" ? "linkedin-leads" : mode === "linkedin-india" ? "linkedin-india" : mode === "exim" ? "exim-domestic" : mode === "intl-map" ? "intl-map-leads" : mode === "intl-web" ? "intl-web-leads" : mode === "intl-exim" ? "exim-intl" : mode === "group-domestic" ? "group-domestic" : mode === "group-intl" ? "group-intl" : mode === "freelancer" ? "freelancer-leads" : mode === "startup-founders" ? "startup-founders" : mode === "saved-leads" ? "saved-leads" : mode === "pipeline-crm" ? "pipeline-crm" : mode === "mca-companies" ? "mca-companies" : mode === "intl-companies" ? "intl-companies" : mode === "trigger-leads" ? "trigger-leads" : mode === "outreach-sequences" ? "outreach-sequences" : "google-map-leads";

  const isTestingMode = ["exim","tender-india","intl-exim","tender-intl","group-domestic","group-intl"].includes(mode);

  const isUnlimitedPlan = leadQuota.unlimited || leadQuota.planType === "unlimited";
  const _walletBal   = leadQuota.walletBalance ?? null;
  const _perLead     = leadQuota.walletPerLeadCost ?? 18;
  const _quotaDone   = !isUnlimitedPlan && (leadQuota.used || 0) >= (leadQuota.limit || 350);
  const _walletEmpty = _quotaDone && _walletBal !== null && _walletBal < _perLead;

  const sidebarCreditWidget = (
    <div style={{ marginBottom: 8 }}>
      {_walletEmpty && (
        <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.35)", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
          <div style={{ fontSize:11, fontWeight:800, color:"#f87171", marginBottom:3 }}>Monthly Quota Used</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>Add wallet credits to continue generating leads.</div>
        </div>
      )}
      {!isUnlimitedPlan && _walletBal !== null && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, marginBottom:6 }}>
          <div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:1 }}>Wallet Balance</div>
            <div style={{ fontSize:14, fontWeight:900, color: _walletBal >= _perLead ? "#10b981" : "#f87171" }}>₹{_walletBal.toLocaleString("en-IN")}</div>
          </div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textAlign:"right", lineHeight:1.4 }}>₹{_perLead}/lead<br/>extra</div>
        </div>
      )}
      {!isUnlimitedPlan && (
        <button onClick={() => setWalletTopupOpen(true)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 12px", borderRadius:10, marginBottom:6, cursor:"pointer", background: _walletEmpty ? "rgba(239,68,68,0.15)" : "rgba(124,58,237,0.15)", border:`1px solid ${_walletEmpty ? "rgba(239,68,68,0.4)" : "rgba(124,58,237,0.35)"}`, color: _walletEmpty ? "#fca5a5" : "#c4b5fd", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
          <span style={{ fontSize:14 }}>👛</span>{_walletEmpty ? "Add Credits Now" : "Add Credits"}
        </button>
      )}
      {!isUnlimitedPlan && (
        <button onClick={() => showSubscribe("lead-generation","Upgrade to Unlimited for unlimited leads every month")} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 12px", borderRadius:10, cursor:"pointer", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", color:"#fcd34d", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
          <span style={{ fontSize:13 }}>♾️</span> Upgrade to Unlimited
        </button>
      )}
      {isUnlimitedPlan && (
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:10 }}>
          <span style={{ fontSize:14 }}>♾️</span>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:"#34d399" }}>Unlimited Plan</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>No monthly lead cap</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolShell
      title="Lead Generation" icon="🎯" slug="lead-generation"
      step={shellStep} maxWidth={1100}
      features={ALL_FEATURES}
      activeFeature={activeFeatureId}
      onFeatureChange={handleFeatureChange}
      sidebarBottom={null}
    >
      {/* Monthly lead quota - stats bar with wallet support */}
      {(() => {
        const isUnlimited    = leadQuota.unlimited || leadQuota.planType === "unlimited";
        const limit          = isUnlimited ? 0 : (leadQuota.limit || 350);
        const used           = leadQuota.used || 0;
        const pct            = isUnlimited
          ? Math.min(100, Math.round(((used % 350) / 350) * 100))
          : Math.min(100, Math.round((used / (limit || 350)) * 100));
        const color          = isUnlimited ? "#10b981" : pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#7c3aed";
        const r              = 26;
        const circumference  = 2 * Math.PI * r;
        const dashOffset     = circumference - (pct / 100) * circumference;
        const walletBal      = leadQuota.walletBalance;
        const perLeadCost    = leadQuota.walletPerLeadCost ?? 18;
        const walletMinTopup = leadQuota.walletMinTopup ?? 500;
        const showWallet     = !isUnlimited && walletBal !== undefined;

        async function handleWalletTopup() {
          if (!user || walletTopupBusy) return;
          const amt = walletTopupAmt;
          if (!amt || amt < walletMinTopup) {
            alert(`Minimum top-up amount is ₹${walletMinTopup}`);
            return;
          }
          setWalletTopupBusy(true);
          try {
            if (!window.Razorpay) {
              await new Promise((res, rej) => {
                const s = document.createElement("script");
                s.src = "https://checkout.razorpay.com/v1/checkout.js";
                s.onload = res; s.onerror = rej;
                document.body.appendChild(s);
              });
            }
            const res = await fetch("/api/lead-wallet", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "create_topup", userId: user.uid, amount: amt }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Order creation failed");
            const options = {
              key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              order_id: data.orderId,
              amount:   data.amount,
              currency: "INR",
              name:     "My ThinkAI",
              description: `Lead Wallet Top-up ₹${amt}`,
              prefill:  { email: user.email },
              theme:    { color: "#7c3aed" },
              handler: async (resp) => {
                const verRes = await fetch("/api/lead-wallet", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "verify_topup",
                    userId: user.uid,
                    amount: amt,
                    razorpay_payment_id: resp.razorpay_payment_id,
                    razorpay_order_id:   resp.razorpay_order_id,
                    razorpay_signature:  resp.razorpay_signature,
                  }),
                });
                const verData = await verRes.json();
                if (verData.success) {
                  setLeadQuota(q => ({ ...q, walletBalance: verData.balance, needsTopup: false, useWallet: verData.balance >= perLeadCost }));
                  setWalletTopupOpen(false);
                } else {
                  alert(verData.error || "Payment verification failed");
                }
                setWalletTopupBusy(false);
              },
              modal: { ondismiss: () => setWalletTopupBusy(false) },
            };
            new window.Razorpay(options).open();
          } catch (e) {
            alert(e.message || "Wallet top-up failed");
            setWalletTopupBusy(false);
          }
        }

        return (
          <>
            <div style={{ display:"flex", alignItems:"stretch", background:"rgba(124,58,237,0.07)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:12, overflow:"hidden", marginBottom:14, flexWrap:"wrap" }}>
              {/* Plan + quota label */}
              <div style={{ flex:"1 1 160px", display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderRight:"1px solid rgba(124,58,237,0.15)" }}>
                <span style={{ fontSize:20, flexShrink:0 }}>🎯</span>
                <div>
                  {isUnlimited
                    ? <div style={{ fontSize:13, fontWeight:800, color:"#10b981" }}>Unlimited Leads</div>
                    : <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{limit} Monthly Leads</div>
                  }
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:2 }}>
                    {isUnlimited ? "Unlimited plan - no monthly cap" : (mode === "intl-exim" || mode === "exim") ? "Verified importers & exporters" : "Google Maps, LinkedIn, Instagram & more"}
                  </div>
                </div>
              </div>

              {/* Usage ring */}
              <div style={{ flex:"0 0 auto", display:"flex", alignItems:"center", gap:14, padding:"14px 22px", borderRight:"1px solid rgba(124,58,237,0.15)" }}>
                <div style={{ position:"relative", width:58, height:58, flexShrink:0 }}>
                  <svg width="58" height="58" style={{ transform:"rotate(-90deg)" }}>
                    <circle cx="29" cy="29" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                    <circle cx="29" cy="29" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition:"stroke-dashoffset 0.4s ease" }} />
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1 }}>
                    <span style={{ fontSize: used > 9999 ? 8 : used > 999 ? 9 : used > 99 ? 10 : 12, fontWeight:900, color, lineHeight:1, textAlign:"center" }}>
                      {used > 9999 ? `${(used / 1000).toFixed(1)}k` : used}
                    </span>
                    <span style={{ fontSize:7, color:"rgba(255,255,255,0.4)", lineHeight:1, letterSpacing:"0.02em" }}>used</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color }}>{used} Extracted</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>
                    {isUnlimited ? "∞ No limit" : `${leadQuota.remaining} Remaining`}
                  </div>
                </div>
              </div>

              {/* Wallet panel (after quota exhausted) */}
              {showWallet ? (
                <div style={{ flex:"1 1 160px", display:"flex", alignItems:"center", gap:12, padding:"14px 18px" }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>👛</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>Wallet Balance</div>
                    <div style={{ fontSize:15, fontWeight:900, color: walletBal >= perLeadCost ? "#10b981" : "#ef4444", lineHeight:1.2 }}>
                      ₹{(walletBal || 0).toLocaleString("en-IN")}
                    </div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>₹{perLeadCost}/lead beyond {limit}</div>
                  </div>
                  <button onClick={() => setWalletTopupOpen(true)} style={{ padding:"6px 12px", borderRadius:8, background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.4)", color:"#c4b5fd", fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                    + Top Up
                  </button>
                </div>
              ) : (
                <div style={{ flex:"1 1 160px", display:"flex", alignItems:"center", gap:12, padding:"14px 18px" }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>✅</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>100% Verified Leads</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:2 }}>Real, active & Google Maps verified businesses</div>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet top-up modal */}
            {walletTopupOpen && (
              <>
                <div onClick={() => !walletTopupBusy && setWalletTopupOpen(false)} style={{ position:"fixed", inset:0, zIndex:9998, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }} />
                <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:9999, width:"min(400px,92vw)", background:"#0d1f35", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"28px 28px 24px", boxShadow:"0 24px 80px rgba(0,0,0,0.7)", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
                  <div style={{ fontSize:22, textAlign:"center", marginBottom:10 }}>👛</div>
                  <div style={{ fontSize:17, fontWeight:900, color:"#fff", textAlign:"center", marginBottom:6 }}>Top Up Lead Wallet</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", textAlign:"center", marginBottom:20, lineHeight:1.6 }}>
                    Current balance: <strong style={{ color:"#fff" }}>₹{(walletBal || 0).toLocaleString("en-IN")}</strong><br />
                    Each extra lead costs ₹{perLeadCost} · min top-up ₹{walletMinTopup}
                  </div>
                  <div style={{ marginBottom:8 }}>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Amount to add (₹)</div>
                    <input
                      type="number" min={walletMinTopup} step="100"
                      value={walletTopupAmt}
                      onChange={e => setWalletTopupAmt(Number(e.target.value))}
                      style={{ width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"#fff", fontSize:16, fontWeight:700, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                    />
                    {walletTopupAmt >= perLeadCost && (
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:5 }}>
                        = approx {Math.floor(walletTopupAmt / perLeadCost)} extra leads
                      </div>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:10, marginTop:16 }}>
                    <button onClick={() => setWalletTopupOpen(false)} disabled={walletTopupBusy} style={{ flex:1, padding:"11px", borderRadius:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                      Cancel
                    </button>
                    <button onClick={handleWalletTopup} disabled={walletTopupBusy || walletTopupAmt < walletMinTopup} style={{ flex:2, padding:"11px", borderRadius:10, background: walletTopupBusy ? "rgba(124,58,237,0.2)" : "linear-gradient(135deg,#7c3aed,#3b82f6)", border:"none", color:"#fff", cursor: walletTopupBusy ? "not-allowed" : "pointer", fontSize:13, fontWeight:800 }}>
                      {walletTopupBusy ? "Processing..." : `Pay ₹${(walletTopupAmt || 0).toLocaleString("en-IN")}`}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        );
      })()}

      {isTestingMode && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:"rgba(251,146,60,0.08)", border:"1px solid rgba(251,146,60,0.3)", borderRadius:10, padding:"10px 14px", marginBottom:14 }}>
          <span style={{ fontSize:16, flexShrink:0 }}>🧪</span>
          <div>
            <span style={{ fontSize:12, fontWeight:800, color:"#fb923c" }}>Beta Feature</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginLeft:8 }}>
              This feature is currently in beta - results may be accurate but are not 100% guaranteed.
            </span>
          </div>
        </div>
      )}

      {/* AI Lead Guide Bot — shown on step 1 of every tool, auto-contextual */}
      {shellStep === 1 && mode !== "saved-leads" && mode !== "pipeline-crm" && mode !== "copy" && (
        <LeadGuideBot toolId={activeFeatureId} key={activeFeatureId} />
      )}

      {mode === "google-map" && (
        <>
          {step === 1 && (
            <>
              <StepInputGoogleMap onSubmit={handleGoogleMapSearch} />
              {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}
              <LeadAdvisor
                suggestion={gmSuggestion} loading={gmSugLoading}
                onChipClick={chip => {
                  if (chip.action === "switch_tool") switchToTool(chip.value);
                  if (chip.action === "load_more") handleGmLoadMore();
                }}
                onDismiss={() => { setGmSuggestion(null); setError(""); }}
              />
            </>
          )}
          {step === 2 && <StepProcessing niche={nicheLabel} city={city} />}
          {step === 3 && (
            <>
              {aiFilterStats && (
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:10, padding:"10px 16px", marginBottom:4 }}>
                  <span style={{ fontSize:18 }}>🤖</span>
                  <div>
                    <span style={{ fontSize:13, fontWeight:700, color:"#c4b5fd" }}>AI Filter Applied</span>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginLeft:8 }}>
                      "{aiFilterStats.requirement}" <strong style={{ color:"#fff" }}>{aiFilterStats.matched}</strong> of {aiFilterStats.total} leads matched
                    </span>
                  </div>
                </div>
              )}
              <StepResults
                leads={leads} setLeads={setLeads} niche="google-map-leads" city={city}
                nicheLabel={nicheLabel} onReset={() => { setStep(1); setLeads([]); setError(""); setAiFilterStats(null); }}
                onLoadMore={handleGmLoadMore}
                loadingMore={gmLoadingMore}
                onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
              />
            </>
          )}
        </>
      )}

      {mode === "website-leads" && (
        <>
          {wlStep === 1 && (
            <>
              <WebsiteLeadsInput onSubmit={handleWebsiteLeadsSearch} quota={leadQuota} />
              {wlError && <ErrorBanner message={wlError} onDismiss={() => setWlError("")} />}
              <LeadAdvisor
                suggestion={wlSuggestion} loading={wlSugLoading}
                onChipClick={chip => {
                  if (chip.action === "switch_tool") switchToTool(chip.value);
                }}
                onDismiss={() => { setWlSuggestion(null); setWlError(""); }}
              />
            </>
          )}
          {wlStep === 2 && <WebsiteLeadsProcessing niche={wlNiche} city={wlCity} state={wlState} count={wlCount} />}
          {wlStep === 3 && (
            <WebsiteLeadsResults
              leads={wlLeads}
              queryLabel={wlQueryLabel}
              sourcesSearched={wlSources}
              aiInsight={wlAiInsight}
              onReset={() => { setWlStep(1); setWlLeads([]); setWlError(""); setWlNiche(""); setWlState(""); setWlCity(""); setWlArea(""); setWlQueryLabel(""); setWlAiInsight(""); }}
              onLoadMore={handleWebsiteLeadsLoadMore}
              loadingMore={wlLoadingMore}
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "instagram-india" && (
        <>
          {igStep === 1 && (
            <>
              <InstagramInputIndia onSubmit={handleInstagramSearch} onClearError={() => setIgError("")} />
              {igError && <ErrorBanner message={igError} onDismiss={() => setIgError("")} />}
              <LeadAdvisor
                suggestion={igSuggestion} loading={igSugLoading}
                onChipClick={chip => { if (chip.action === "switch_tool") switchToTool(chip.value); }}
                onDismiss={() => { setIgSuggestion(null); setIgError(""); }}
              />
            </>
          )}
          {igStep === 2 && <InstagramProcessing niche={igNiche} city={igCity} state={igState} />}
          {igStep === 3 && (
            <InstagramResults
              leads={igLeads} queryLabel={igQueryLabel} niche={igNiche} aiInsight={igAiInsight}
              onReset={() => { setIgStep(1); setIgLeads([]); setIgError(""); setIgNiche(""); setIgState(""); setIgCity(""); setIgArea(""); setIgCountry(""); setIgIsIntl(false); setIgQueryLabel(""); setIgAiInsight(""); }}
              onLoadMore={handleInstagramLoadMore} loadingMore={igLoadingMore}
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "instagram" && (
        <>
          {igStep === 1 && (
            <>
              <InstagramInput onSubmit={handleInstagramSearch} onClearError={() => setIgError("")} />
              {igError && <ErrorBanner message={igError} onDismiss={() => setIgError("")} />}
              <LeadAdvisor
                suggestion={igSuggestion} loading={igSugLoading}
                onChipClick={chip => { if (chip.action === "switch_tool") switchToTool(chip.value); }}
                onDismiss={() => { setIgSuggestion(null); setIgError(""); }}
              />
            </>
          )}
          {igStep === 2 && <InstagramProcessing niche={igNiche} city={igCity} state={igState} />}
          {igStep === 3 && (
            <InstagramResults
              leads={igLeads} queryLabel={igQueryLabel} niche={igNiche} aiInsight={igAiInsight}
              onReset={() => { setIgStep(1); setIgLeads([]); setIgError(""); setIgNiche(""); setIgState(""); setIgCity(""); setIgArea(""); setIgCountry(""); setIgIsIntl(false); setIgQueryLabel(""); setIgAiInsight(""); }}
              onLoadMore={handleInstagramLoadMore} loadingMore={igLoadingMore}
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "linkedin-india" && (
        <>
          {liStep === 1 && (
            <>
              <LinkedInInputIndia onSubmit={handleLinkedInSearch} onClearError={() => setLiError("")} />
              {liError && <ErrorBanner message={liError} onDismiss={() => setLiError("")} />}
              <LeadAdvisor
                suggestion={liSuggestion} loading={liSugLoading}
                onChipClick={chip => { if (chip.action === "switch_tool") switchToTool(chip.value); }}
                onDismiss={() => { setLiSuggestion(null); setLiError(""); }}
              />
            </>
          )}
          {liStep === 2 && <LinkedInProcessing niche={liNiche} city={liCity} state={liState} />}
          {liStep === 3 && (
            <LinkedInResults
              leads={liLeads} queryLabel={liQueryLabel} niche={liNiche} aiInsight={liAiInsight}
              onReset={() => { setLiStep(1); setLiLeads([]); setLiError(""); setLiNiche(""); setLiState(""); setLiCity(""); setLiArea(""); setLiJobTitle(""); setLiCountry(""); setLiIsIntl(false); setLiQueryLabel(""); setLiAiInsight(""); }}
              onLoadMore={handleLinkedInLoadMore} loadingMore={liLoadingMore}
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "linkedin" && (
        <>
          {liStep === 1 && (
            <>
              <LinkedInInput onSubmit={handleLinkedInSearch} onClearError={() => setLiError("")} />
              {liError && <ErrorBanner message={liError} onDismiss={() => setLiError("")} />}
              <LeadAdvisor
                suggestion={liSuggestion} loading={liSugLoading}
                onChipClick={chip => { if (chip.action === "switch_tool") switchToTool(chip.value); }}
                onDismiss={() => { setLiSuggestion(null); setLiError(""); }}
              />
            </>
          )}
          {liStep === 2 && <LinkedInProcessing niche={liNiche} city={liCity} state={liState} />}
          {liStep === 3 && (
            <LinkedInResults
              leads={liLeads} queryLabel={liQueryLabel} niche={liNiche} aiInsight={liAiInsight}
              onReset={() => { setLiStep(1); setLiLeads([]); setLiError(""); setLiNiche(""); setLiState(""); setLiCity(""); setLiArea(""); setLiJobTitle(""); setLiCountry(""); setLiIsIntl(false); setLiQueryLabel(""); setLiAiInsight(""); }}
              onLoadMore={handleLinkedInLoadMore} loadingMore={liLoadingMore}
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "exim" && (
        <>
          {eximStep === 1 && (
            <>
              <ExportImportInput
                key={eximFormKey}
                onSubmit={handleEximSearch}
                initialProduct={eximInitProd}
                initialState={eximInitState}
              />
              {eximError && <ErrorBanner message={eximError} onDismiss={() => setEximError("")} />}
              <EximSuggestionBot
                suggestion={eximSuggestion}
                loading={eximSugLoading}
                product={eximProduct}
                state={eximState}
                onTryState={targetState => {
                  setEximInitProd(eximProduct);
                  setEximInitState(targetState);
                  setEximSuggestion(null);
                  setEximError("");
                  setEximFormKey(k => k + 1);
                }}
                onTryKeyword={keyword => {
                  setEximInitProd(keyword);
                  setEximInitState(eximState);
                  setEximSuggestion(null);
                  setEximError("");
                  setEximFormKey(k => k + 1);
                }}
                onDismiss={() => { setEximSuggestion(null); setEximError(""); }}
              />
            </>
          )}
          {eximStep === 2 && <ExportImportProcessing product={eximProduct} tradeType={eximTradeType} city={eximCity} />}
          {eximStep === 3 && (
            <ExportImportResults
              leads={eximLeads}
              product={eximProduct}
              tradeType={eximTradeType}
              totalSeen={eximTotalSeen}
              onReset={() => { setEximStep(1); setEximLeads([]); setEximError(""); setEximProduct(""); setEximTradeType("exporter"); setEximState(""); setEximCity(""); setEximHsCode(""); setEximTotalSeen(0); setEximSuggestion(null); setEximInitProd(""); setEximInitState(""); }}
              onLoadMore={handleEximLoadMore}
              loadingMore={eximLoadingMore}
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "copy" && (
        <>
          <ErrorBanner message={copyError} onDismiss={() => setCopyError("")} />
          {copyStep === 1 && <CopyInput onGenerate={handleCopyGenerate} />}
          {copyStep === 2 && <CopySpinner />}
          {copyStep === 3 && copyResult && (
            <CopyResult result={copyResult} productName={copyProduct} onReset={handleCopyReset} onModify={handleCopyModify} />
          )}
        </>
      )}

      

      {mode === "intl-map" && (
        <>
          <ErrorBanner message={intlMapError} onDismiss={() => setIntlMapError("")} />
          {intlMapStep === 1 && <IntlMapInput onSubmit={handleIntlMapSearch} />}
          {intlMapStep === 2 && <StepProcessing niche={intlMapNiche} city={[intlMapCity, intlMapProvince, intlMapCountry].filter(Boolean).join(", ")} />}
          {intlMapStep === 3 && (
            <>
              {intlMapAiFilterStats && (
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:10, padding:"10px 16px", marginBottom:4 }}>
                  <span style={{ fontSize:18 }}>🤖</span>
                  <div>
                    <span style={{ fontSize:13, fontWeight:700, color:"#c4b5fd" }}>AI Filter Applied</span>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginLeft:8 }}>
                      "{intlMapAiFilterStats.requirement}" <strong style={{ color:"#fff" }}>{intlMapAiFilterStats.matched}</strong> of {intlMapAiFilterStats.total} leads matched
                    </span>
                  </div>
                </div>
              )}
              <StepResults
                leads={intlMapLeads} setLeads={setIntlMapLeads} niche="google-map-leads" city={`${intlMapCity}, ${intlMapCountry}`}
                nicheLabel={intlMapNiche}
                onReset={() => { setIntlMapStep(1); setIntlMapLeads([]); setIntlMapError(""); setIntlMapAiFilterStats(null); setIntlMapNiche(""); setIntlMapCountry(""); setIntlMapProvince(""); setIntlMapCity(""); setIntlMapQueryLabel(""); }}
                onLoadMore={handleIntlMapLoadMore}
                loadingMore={intlMapLoadingMore}
                onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
              />
            </>
          )}
        </>
      )}

      {mode === "intl-web" && (
        <>
          <ErrorBanner message={intlWebError} onDismiss={() => setIntlWebError("")} />
          {intlWebStep === 1 && <IntlWebInput onSubmit={handleIntlWebSearch} quota={leadQuota} />}
          {intlWebStep === 2 && <WebsiteLeadsProcessing niche={intlWebNiche} city={intlWebCity} state={intlWebCountry} count={intlWebCount} />}
          {intlWebStep === 3 && (
            <WebsiteLeadsResults
              leads={intlWebLeads}
              queryLabel={intlWebQueryLabel}
              sourcesSearched={intlWebSources}
              onReset={() => { setIntlWebStep(1); setIntlWebLeads([]); setIntlWebError(""); setIntlWebNiche(""); setIntlWebCountry(""); setIntlWebCity(""); setIntlWebQueryLabel(""); }}
              onLoadMore={handleIntlWebLoadMore}
              loadingMore={intlWebLoadingMore}
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "intl-exim" && (
        <>
          <ErrorBanner message={intlEximError} onDismiss={() => setIntlEximError("")} />
          {intlEximStep === 1 && <IntlEximInput onSubmit={handleIntlEximSearch} />}
          {intlEximStep === 2 && <IntlEximProcessing product={intlEximProduct} tradeType={intlEximTradeType} country={intlEximCountry} city={intlEximCity} />}
          {intlEximStep === 3 && (
            <ExportImportResults
              leads={intlEximLeads}
              product={intlEximProduct}
              tradeType={intlEximTradeType}
              totalSeen={intlEximTotalSeen}
              onReset={() => { setIntlEximStep(1); setIntlEximLeads([]); setIntlEximError(""); setIntlEximProduct(""); setIntlEximTradeType("exporter"); setIntlEximCountry(""); setIntlEximCity(""); setIntlEximHsCode(""); setIntlEximTotalSeen(0); }}
              onLoadMore={handleIntlEximLoadMore}
              loadingMore={intlEximLoadingMore}
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {/* ── India Government Tenders ── */}
      {mode === "tender-india" && (
        <div>
          {/* Stats Bar */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            {[
              { icon:"🏛️", value:"12,548", label:"Active Tenders", sub:"Across India", color:"#3b82f6" },
              { icon:"🏢", value:"450+", label:"Departments", sub:"Central & State", color:"#7c3aed" },
              { icon:"💰", value:"₹10K – ₹500Cr+", label:"Tender Value", sub:"From small to mega projects", color:"#3b82f6" },
              { icon:"🌐", value:"GEM + CPPP", label:"Sources", sub:"State Portals & More", color:"#7c3aed" },
            ].map((stat, idx) => (
              <div key={idx} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, background:`${stat.color}18`, border:`1px solid ${stat.color}30`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize:20, fontWeight:900, color:stat.color, lineHeight:1.1 }}>{stat.value}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{stat.label}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.42)" }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main 2-col layout - collapse right panel once results arrive */}
          <div style={{ display:"grid", gridTemplateColumns: indiaTenders.length > 0 ? "1fr" : "1fr 320px", gap:16, alignItems:"start" }}>

            {/* Left: TenderBot Chat UI */}
            <ToolCard style={{ padding:0, overflow:"hidden" }}>
              {/* Bot header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(59,130,246,0.05)" }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(59,130,246,0.15)", border:"2px solid rgba(59,130,246,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🤖</div>
                <div>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14 }}>Tender Discovery Assistant</div>
                  <div style={{ fontSize:11, color:"#3b82f6" }}>GEM • eProcure NIC • 20+ State Portals • Live Data</div>
                </div>
                <span style={{ marginLeft:"auto", background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)", color:"#3b82f6", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6, flexShrink:0 }}>AI BOT</span>
              </div>

              {/* Chat messages */}
              <div style={{ maxHeight:340, minHeight:80, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                {tBotMsgs.map(msg => (
                  <div key={msg.id}>
                    {/* Message bubble */}
                    <div style={{ display:"flex", justifyContent: msg.role==="user" ? "flex-end" : "flex-start", marginBottom:6 }}>
                      {msg.role === "bot" && <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginRight:8, alignSelf:"flex-end" }}>🤖</div>}
                      <div style={{ maxWidth:"80%", padding:"10px 14px", borderRadius: msg.role==="user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                        background: msg.role==="user" ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${msg.role==="user" ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`,
                        fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.6, whiteSpace:"pre-wrap" }}>
                        {msg.text}
                      </div>
                    </div>
                    {/* Options buttons */}
                    {msg.options && !msg.resolved && (
                      <div style={{ paddingLeft:34, display:"flex", flexWrap:"wrap", gap:7, marginBottom:4 }}>
                        {msg.options.map(opt => (
                          <button key={opt.value} onClick={() => handleTBotOption(opt, msg.id)}
                            style={{ fontSize:12, fontWeight:600, padding:"6px 14px", borderRadius:20, cursor:"pointer",
                              background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa",
                              transition:"all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background="rgba(59,130,246,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background="rgba(59,130,246,0.1)"}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* State picker */}
                    {msg.type === "state_picker" && !msg.resolved && (
                      <div style={{ paddingLeft:34 }}>
                        <select onChange={e => e.target.value && handleTBotOption({ label: e.target.value, value: e.target.value, action: "set_state" }, msg.id)}
                          defaultValue=""
                          style={{ ...TINP, maxWidth:240, cursor:"pointer" }}>
                          <option value="">Select State...</option>
                          {T_INDIA_STATES.map(s => <option key={s} value={s} style={{ background:"#0f172a" }}>{s}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
                {tBotThinking && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, paddingLeft:34 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
                    <div style={{ padding:"8px 14px", borderRadius:"4px 14px 14px 14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
                      <span style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>● ● ●</span>
                    </div>
                  </div>
                )}
                <div ref={tBotEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:8 }}>
                <input
                  value={tBotInput}
                  onChange={e => setTBotInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && !e.shiftKey && handleTBotSend()}
                  placeholder={tBotPhase === "welcome" ? "e.g. Solar panel supplier, Road construction..." : "Type your reply..."}
                  disabled={tBotThinking || tBotPhase === "searching" || tBotPhase === "results"}
                  style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none" }}
                  onFocus={e => e.target.style.borderColor="#3b82f6"}
                  onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
                />
                <button onClick={handleTBotSend} disabled={tBotThinking || !tBotInput.trim()}
                  style={{ padding:"10px 16px", borderRadius:10, cursor:"pointer", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#3b82f6", fontSize:13, fontWeight:700 }}>
                  Send
                </button>
              </div>

              {/* Quick category chips */}
              {tBotPhase === "welcome" && (
                <div style={{ padding:"0 16px 14px", display:"flex", flexWrap:"wrap", gap:6 }}>
                  {["Solar Panel Supplier","Road Construction","IT Services","Medical Equipment","Furniture Supply","Electrical Contractor"].map(s => (
                    <button key={s} onClick={() => { setTBotInput(s); }}
                      style={{ fontSize:11, padding:"3px 10px", borderRadius:20, cursor:"pointer",
                        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(59,130,246,0.4)"; e.currentTarget.style.color="#60a5fa"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </ToolCard>


            {/* Right: You'll Get + Sample Results -- hidden once results load */}
            {indiaTenders.length === 0 && <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {/* You'll Get */}
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18 }}>
                <div style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:14 }}>You'll Get</div>
                {["Department Name","Tender Title","Tender Value","Submission Deadline","Tender Document / Link","Contact Details","Location",["Matching Score","NEW"]].map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.35)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:10, color:"#3b82f6" }}>✓</span>
                    </div>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.72)" }}>{Array.isArray(item) ? item[0] : item}</span>
                    {Array.isArray(item) && <span style={{ fontSize:9, fontWeight:700, color:"#3b82f6", background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:4, padding:"1px 6px" }}>{item[1]}</span>}
                  </div>
                ))}
                <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:10, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>🛡️</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#3b82f6" }}>100% Relevant Results</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", lineHeight:1.4, marginTop:2 }}>AI ensures you get highly relevant tenders matching your business</div>
                  </div>
                </div>
              </div>

              {/* Sample Tender Results */}
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:13 }}>Sample Tender Results</div>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>Live Examples</span>
                </div>
                {[
                  { match:95, mc:"#3b82f6", title:"Supply of Solar Street Light System", dept:"UPNEDA", value:"₹48,00,000", deadline:"15 Jun 2025" },
                  { match:82, mc:"#3b82f6", title:"Computer Hardware Supply", dept:"Railways", value:"₹12,00,000", deadline:"20 Jun 2025" },
                  { match:78, mc:"#f59e0b", title:"Construction of RCC Drain", dept:"PWD", value:"₹85,00,000", deadline:"25 Jun 2025" },
                ].map((s, i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px", marginBottom:i < 2 ? 8 : 0 }}>
                    <span style={{ fontSize:9, fontWeight:700, color:s.mc, background:`${s.mc}18`, border:`1px solid ${s.mc}35`, borderRadius:5, padding:"2px 7px", display:"inline-block", marginBottom:5 }}>{s.match}% Match</span>
                    <div style={{ fontSize:11, fontWeight:700, color:"#fff", marginBottom:5 }}>{s.title}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:3 }}>
                      {[["Department",s.dept],["Value",s.value],["Deadline",s.deadline]].map(([l,v]) => (
                        <div key={l}>
                          <div style={{ fontSize:9, color:"rgba(255,255,255,0.32)" }}>{l}</div>
                          <div style={{ fontSize:10, color:l==="Value"?"#3b82f6":"rgba(255,255,255,0.7)", fontWeight:l==="Value"?700:500 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>}
          </div>

          {/* How It Works - hide once results are loaded */}
          {indiaTenders.length === 0 && (
          <ToolCard style={{ marginTop:16 }}>
            <div style={{ fontWeight:800, color:"#fff", fontSize:15, marginBottom:16 }}>How It Works</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {[
                { n:"1", icon:"✏️", title:"Describe", desc:"Tell us what you supply or the service you provide" },
                { n:"2", icon:"🤖", title:"AI Searches", desc:"Our AI searches across multiple government portals" },
                { n:"3", icon:"📋", title:"Get Matched Tenders", desc:"Receive relevant tenders with all details & links" },
                { n:"4", icon:"🏆", title:"Apply & Win", desc:"Download documents and participate in tenders" },
              ].map((step, i, arr) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start" }}>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 10px", background:"rgba(255,255,255,0.03)", borderRadius:12, textAlign:"center" }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(59,130,246,0.12)", border:"2px solid rgba(59,130,246,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginBottom:8 }}>{step.icon}</div>
                    <div style={{ fontSize:20, fontWeight:900, color:"#3b82f6", lineHeight:1, marginBottom:4 }}>{step.n}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#fff", marginBottom:4 }}>{step.title}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.42)", lineHeight:1.5 }}>{step.desc}</div>
                  </div>
                  {i < arr.length - 1 && <div style={{ fontSize:18, color:"rgba(255,255,255,0.18)", margin:"30px 4px 0", flexShrink:0 }}>→</div>}
                </div>
              ))}
            </div>
          </ToolCard>
          )}

          <ErrorBanner message={indiaTError} onDismiss={() => setIndiaTError("")} />

          {indiaTenders.length > 0 && (
            <div style={{ marginTop:16 }}>
              <TenderSummaryBar tenders={indiaTenders} isIndia={true} onExport={() => exportTCSV(indiaTenders, true)} />
              {indiaTenders.map((t, i) => <TenderCard key={i} tender={t} isIndia={true} />)}
            </div>
          )}
        </div>
      )}

      {/* ── International Government Tenders ── */}
      {mode === "tender-intl" && (
        <div>
          {/* Stats Bar */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            {[
              { icon:"🌍", value:"50,000+", label:"Active Tenders", sub:"150+ Countries", color:"#7c3aed" },
              { icon:"🏛️", value:"200+", label:"Funding Agencies", sub:"UN, World Bank, ADB & more", color:"#3b82f6" },
              { icon:"💵", value:"$10K – $500M+", label:"Tender Value", sub:"Small to mega projects", color:"#7c3aed" },
              { icon:"📡", value:"UNGM + EU TED", label:"Sources", sub:"DGMarket, SAM.gov & More", color:"#3b82f6" },
            ].map((stat, idx) => (
              <div key={idx} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, background:`${stat.color}18`, border:`1px solid ${stat.color}30`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize:18, fontWeight:900, color:stat.color, lineHeight:1.1 }}>{stat.value}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{stat.label}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.42)" }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main 2-col layout */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, alignItems:"start" }}>

            {/* Left: IntlTenderBot Chat UI */}
            <ToolCard style={{ padding:0, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(124,58,237,0.05)" }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"2px solid rgba(124,58,237,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🌍</div>
                <div>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14 }}>International Tender Assistant</div>
                  <div style={{ fontSize:11, color:"#7c3aed" }}>USA (SAM.gov) • UK (Find a Tender) • EU (TED) • World Bank • UNGM • ADB • Singapore</div>
                </div>
                <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color:"#7c3aed" }}>AI BOT</span>
              </div>

              {/* Chat messages */}
              <div style={{ height:340, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                {iBotMsgs.map(msg => (
                  <div key={msg.id}>
                    <div style={{ display:"flex", justifyContent: msg.role==="user" ? "flex-end" : "flex-start", marginBottom:6 }}>
                      {msg.role === "bot" && <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginRight:8, alignSelf:"flex-end" }}>🌍</div>}
                      <div style={{ maxWidth:"80%", padding:"10px 14px", borderRadius: msg.role==="user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                        background: msg.role==="user" ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${msg.role==="user" ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.1)"}`,
                        fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.6, whiteSpace:"pre-wrap" }}>
                        {msg.text}
                      </div>
                    </div>
                    {msg.options && !msg.resolved && (
                      <div style={{ paddingLeft:34, display:"flex", flexWrap:"wrap", gap:7, marginBottom:4 }}>
                        {msg.options.map(opt => (
                          <button key={opt.value} onClick={() => handleIBotOption(opt, msg.id)}
                            style={{ fontSize:12, fontWeight:600, padding:"6px 14px", borderRadius:20, cursor:"pointer",
                              background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.3)", color:"#a78bfa" }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.type === "country_input" && !msg.resolved && (
                      <div style={{ paddingLeft:34, marginTop:4 }}>
                        <input
                          placeholder="Or type any country name..."
                          onKeyDown={e => { if (e.key==="Enter" && e.target.value.trim()) { handleIBotOption({ label: e.target.value.trim(), value: e.target.value.trim(), action:"set_country" }, msg.id); e.target.value=""; }}}
                          style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"8px 12px", color:"#fff", fontSize:12, outline:"none", width:"200px" }}
                          onFocus={e => e.target.style.borderColor="#7c3aed"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                      </div>
                    )}
                  </div>
                ))}
                {iBotThinking && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, paddingLeft:34 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🌍</div>
                    <div style={{ padding:"8px 14px", borderRadius:"4px 14px 14px 14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
                      <span style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>● ● ●</span>
                    </div>
                  </div>
                )}
                <div ref={iBotEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:8 }}>
                <input
                  value={iBotInput}
                  onChange={e => setIBotInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && !e.shiftKey && handleIBotSend()}
                  placeholder={iBotPhase === "welcome" ? "e.g. Solar panel supplier, IT services, Road construction..." : "Type your reply..."}
                  disabled={iBotThinking || iBotPhase === "searching" || iBotPhase === "results"}
                  style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none" }}
                  onFocus={e => e.target.style.borderColor="#7c3aed"}
                  onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"}
                />
                <button onClick={handleIBotSend} disabled={iBotThinking || !iBotInput.trim()}
                  style={{ padding:"10px 16px", borderRadius:10, cursor:"pointer", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", color:"#a78bfa", fontSize:13, fontWeight:700 }}>
                  Send
                </button>
              </div>

              {/* Quick chips */}
              {iBotPhase === "welcome" && (
                <div style={{ padding:"0 16px 14px", display:"flex", flexWrap:"wrap", gap:6 }}>
                  {["Solar panel supplier","Road construction","IT services","Medical equipment","Furniture supply","Water treatment"].map(s => (
                    <button key={s} onClick={() => setIBotInput(s)}
                      style={{ fontSize:11, padding:"3px 10px", borderRadius:20, cursor:"pointer",
                        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </ToolCard>

            <ToolCard>
              {/* OLD FORM REMOVED - replaced by bot above */}
              <div style={{ display:"none" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.55)", marginBottom:10 }}>Select Sector <span style={{ fontWeight:400, color:"rgba(255,255,255,0.35)" }}>Click to filter by sector</span></div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                  {[
                    { icon:"☀️", label:"Energy / Solar",  value:"Power Energy Solar" },
                    { icon:"🏗️", label:"Construction",    value:"Construction Civil Works" },
                    { icon:"💻", label:"IT / Software",   value:"IT Software Technology" },
                    { icon:"🏥", label:"Healthcare",      value:"Medical Healthcare Drugs" },
                    { icon:"🌊", label:"Water / Sanitation", value:"Water Sanitation" },
                    { icon:"📚", label:"Education",       value:"Education Training" },
                    { icon:"🚛", label:"Logistics",       value:"Transport Logistics" },
                    { icon:"🌿", label:"Environment",     value:"Environment Waste" },
                  ].map(cat => (
                    <button key={cat.label} onClick={() => setIntlTSector(cat.value)}
                      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"10px 6px", borderRadius:10, background:intlTSector===cat.value?"rgba(124,58,237,0.12)":"rgba(255,255,255,0.04)", border:intlTSector===cat.value?"1px solid rgba(124,58,237,0.4)":"1px solid rgba(255,255,255,0.08)", color:intlTSector===cat.value?"#7c3aed":"rgba(255,255,255,0.75)", fontSize:11, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
                      <span style={{ fontSize:20 }}>{cat.icon}</span>
                      <span style={{ fontWeight:600, textAlign:"center", lineHeight:1.2 }}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Country + State */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Country <span style={{ color:"#7c3aed" }}>*</span></div>
                  <select value={intlTCountry} onChange={e => setIntlTCountry(e.target.value)} style={{ ...TINP, cursor:"pointer", borderColor:intlTCountry?"rgba(124,58,237,0.4)":"rgba(124,58,237,0.25)" }}>
                    <option value="">Select Country</option>
                    {["United States","United Kingdom","UAE","Australia","Canada","Singapore","Germany","France","South Africa","Nigeria","Kenya","Pakistan","Bangladesh","Sri Lanka","Malaysia","Indonesia","Philippines","Thailand","Japan","South Korea","Saudi Arabia","Qatar","Kuwait","Brazil","Mexico","Egypt","Ethiopia","Tanzania","Ghana","Vietnam","Nepal","Rwanda","Uganda","Mozambique","Zambia","Cambodia"].map(c => <option key={c} value={c} style={{ background:"#0f172a" }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>State / Province</div>
                  <input value={intlTStateProvince} onChange={e => setIntlTStateProvince(e.target.value)} placeholder="e.g. Bavaria, Ontario..." style={TINP}
                    onFocus={e => e.target.style.borderColor="#7c3aed"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
                </div>
              </div>

              {/* Funding + Min Value */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Funding Agency</div>
                  <select value={intlTFunding} onChange={e => setIntlTFunding(e.target.value)} style={{ ...TINP, cursor:"pointer" }}>
                    {[{v:"all",l:"All Funding Sources"},{v:"World Bank",l:"World Bank / IDA"},{v:"ADB",l:"ADB"},{v:"UNDP UN",l:"UNDP / UN"},{v:"AfDB",l:"AfDB"},{v:"EU European Union",l:"EU TED"}].map(o => <option key={o.v} value={o.v} style={{ background:"#0f172a" }}>{o.l}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Minimum Value</div>
                  <select value={intlTMinVal} onChange={e => setIntlTMinVal(e.target.value)} style={{ ...TINP, cursor:"pointer" }}>
                    {[{v:"",l:"Any Value"},{v:"$10,000 USD",l:"$10K+"},{v:"$50,000 USD",l:"$50K+"},{v:"$100,000 USD",l:"$100K+"},{v:"$500,000 USD",l:"$500K+"},{v:"$1,000,000 USD",l:"$1M+"}].map(o => <option key={o.v} value={o.v} style={{ background:"#0f172a" }}>{o.l}</option>)}
                  </select>
                </div>
              </div>

              {/* Keywords */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Keywords (optional)</div>
                <input value={intlTKw} onChange={e => setIntlTKw(e.target.value)} placeholder='e.g. "solar", "hospital equipment", "road construction"' style={TINP}
                  onFocus={e => e.target.style.borderColor="#7c3aed"} onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.12)"} />
              </div>

              {/* Indian Firms Toggle */}
              <div onClick={() => setIntlTIndOnly(v => !v)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:intlTIndOnly?"rgba(59,130,246,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${intlTIndOnly?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.08)"}`, borderRadius:10, cursor:"pointer", marginBottom:16, transition:"all 0.2s" }}>
                <div style={{ width:38, height:20, borderRadius:10, background:intlTIndOnly?"#3b82f6":"rgba(255,255,255,0.15)", position:"relative", flexShrink:0, transition:"background 0.2s" }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:intlTIndOnly?20:2, transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)" }} />
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:intlTIndOnly?"#3b82f6":"#fff" }}>🇮🇳 Indian Firms Only</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.42)" }}>Show only tenders where Indian companies can apply</div>
                </div>
              </div>

              <PrimaryButton onClick={doFetchIntlTenders} loading={intlTLoading} disabled={intlTLoading || !intlTCountry} style={{ width:"100%" }}>
                {intlTLoading ? "Searching International Tenders..." : "🌍 Find International Tenders →"}
              </PrimaryButton>
              {!intlTCountry && <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", textAlign:"center", marginTop:8 }}>Please select a country to search</div>}
            </ToolCard>

            {/* Right: You'll Get + Sample Results -- hidden once results load */}
            {intlTenders.length === 0 && <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {/* You'll Get */}
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18 }}>
                <div style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:14 }}>You'll Get</div>
                {["Country & Region","Organization Name","Tender Title","Tender Value (USD)","Submission Deadline","Tender Document / Link","Eligibility for Indian Firms",["AI Match Score","NEW"]].map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.35)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:10, color:"#7c3aed" }}>✓</span>
                    </div>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.72)" }}>{Array.isArray(item) ? item[0] : item}</span>
                    {Array.isArray(item) && <span style={{ fontSize:9, fontWeight:700, color:"#7c3aed", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.3)", borderRadius:4, padding:"1px 6px" }}>{item[1]}</span>}
                  </div>
                ))}
                <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:10, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>🛡️</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#7c3aed" }}>Global Coverage</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", lineHeight:1.4, marginTop:2 }}>Access tenders from UN, World Bank, ADB and 150+ countries</div>
                  </div>
                </div>
              </div>

              {/* Sample Intl Results */}
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:13 }}>Sample Results</div>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>Live Examples</span>
                </div>
                {[
                  { match:94, mc:"#7c3aed", title:"Solar Energy Infrastructure", org:"World Bank / Kenya", value:"$2.4M", deadline:"18 Jun 2025" },
                  { match:88, mc:"#3b82f6", title:"Medical Equipment Supply", org:"UNDP / Nigeria", value:"$850K", deadline:"22 Jun 2025" },
                  { match:76, mc:"#f59e0b", title:"Road Construction Works", org:"ADB / Bangladesh", value:"$5.1M", deadline:"30 Jun 2025" },
                ].map((s, i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px", marginBottom:i < 2 ? 8 : 0 }}>
                    <span style={{ fontSize:9, fontWeight:700, color:s.mc, background:`${s.mc}18`, border:`1px solid ${s.mc}35`, borderRadius:5, padding:"2px 7px", display:"inline-block", marginBottom:5 }}>{s.match}% Match</span>
                    <div style={{ fontSize:11, fontWeight:700, color:"#fff", marginBottom:5 }}>{s.title}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:3 }}>
                      {[["Organization",s.org],["Value",s.value],["Deadline",s.deadline]].map(([l,v]) => (
                        <div key={l}>
                          <div style={{ fontSize:9, color:"rgba(255,255,255,0.32)" }}>{l}</div>
                          <div style={{ fontSize:10, color:l==="Value"?"#7c3aed":"rgba(255,255,255,0.7)", fontWeight:l==="Value"?700:500 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>}
          </div>

          {/* How It Works - Intl */}
          <ToolCard style={{ marginTop:16 }}>
            <div style={{ fontWeight:800, color:"#fff", fontSize:15, marginBottom:16 }}>How It Works</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {[
                { n:"1", icon:"🌍", title:"Select Country", desc:"Choose your target country and sector" },
                { n:"2", icon:"🤖", title:"AI Searches", desc:"AI searches across UN, World Bank, ADB and global portals" },
                { n:"3", icon:"📋", title:"Get Matched Tenders", desc:"Receive international tenders with eligibility analysis" },
                { n:"4", icon:"🏆", title:"Apply & Win", desc:"Access documents, check eligibility and participate" },
              ].map((step, i, arr) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start" }}>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 10px", background:"rgba(255,255,255,0.03)", borderRadius:12, textAlign:"center" }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(124,58,237,0.12)", border:"2px solid rgba(124,58,237,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginBottom:8 }}>{step.icon}</div>
                    <div style={{ fontSize:20, fontWeight:900, color:"#7c3aed", lineHeight:1, marginBottom:4 }}>{step.n}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#fff", marginBottom:4 }}>{step.title}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.42)", lineHeight:1.5 }}>{step.desc}</div>
                  </div>
                  {i < arr.length - 1 && <div style={{ fontSize:18, color:"rgba(255,255,255,0.18)", margin:"30px 4px 0", flexShrink:0 }}>→</div>}
                </div>
              ))}
            </div>
          </ToolCard>

          <ErrorBanner message={intlTError} onDismiss={() => setIntlTError("")} />

          {intlTenders.length > 0 && (
            <div style={{ marginTop:16 }}>
              <TenderSummaryBar tenders={intlTenders} isIndia={false} onExport={() => exportTCSV(intlTenders, false)} />
              {intlTenders.map((t, i) => <TenderCard key={i} tender={t} isIndia={false} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Group Finder (Domestic + International) ── */}
      {(mode === "group-domestic" || mode === "group-intl") && (
        <>
          <GroupFinderPanel
            isIntl={mode === "group-intl"}
            step={grpStep}
            groups={grpGroups}
            loading={grpLoading}
            loadingMore={grpLoadingMore}
            error={grpError}
            niche={grpNiche}
            platforms={grpPlatforms}
            country={grpCountry}
            quota={grpQuota}
            quotaHit={grpQuotaHit}
            onSearch={handleGroupFinderSearch}
            onLoadMore={handleGroupFinderLoadMore}
            onReset={() => {
              setGrpStep(1); setGrpGroups([]); setGrpError(""); setGrpNiche(""); setGrpCountry(""); setGrpLoading(false);
              setGrpPlatforms(["whatsapp"]);
              setGrpQuotaHit(false); setGrpLoadingMore(false); grpSeenRef.current = new Set();
              setGrpSuggestion(null);
            }}
            onDismissError={() => { setGrpError(""); setGrpSuggestion(null); }}
          />
          {grpStep === 1 && (
            <LeadAdvisor
              suggestion={grpSuggestion} loading={grpSugLoading}
              onChipClick={chip => { if (chip.action === "switch_tool") switchToTool(chip.value); }}
              onDismiss={() => { setGrpSuggestion(null); setGrpError(""); }}
            />
          )}
        </>
      )}

      {/* ── Freelancer Client Leads ── */}
      {mode === "freelancer" && (
        <>
          <ErrorBanner message={flError} onDismiss={() => setFlError("")} />
          {flStep === 1 && <FreelancerLeadsInput onSubmit={handleFreelancerSearch} onClearSeen={handleFreelancerClearSeen} />}
          {flStep === 2 && <GlobalSourceProcessing service={flService} source="Project Platforms" steps={["🔍 Scanning Reddit r/forhire, r/startups, r/entrepreneur","💡 Checking IndieHackers, HackerNews, ProductHunt","🌐 Searching project boards and hiring posts","🤖 AI extracting project details + contact info"]} />}
          {flStep === 3 && (
            <GlobalSourceResults
              leads={flLeads}
              queryLabel={flQueryLabel}
              featureIcon="📋"
              featureName="Projects"
              onReset={() => { setFlStep(1); setFlLeads([]); setFlError(""); setFlQueryLabel(""); flSeenRef.current = new Set(); }}
              onLoadMore={handleFreelancerLoadMore}
              loadingMore={flLoadingMore}
              renderMeta={l => [
                l.project_name   && { icon: "📁", val: l.project_name },
                l.platform       && { icon: "🖥️", val: l.platform },
                l.budget         && { icon: "💰", val: l.budget },
                l.service_needed && { icon: "🎯", val: l.service_needed },
              ].filter(Boolean)}
              mainField="requirement"
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
              source="freelancer"
            />
          )}
        </>
      )}

      {/* ── Startup Founder Leads ── */}
      {mode === "startup-founders" && (
        <>
          <ErrorBanner message={sfError} onDismiss={() => setSfError("")} />
          {sfStep === 1 && <StartupFounderInput onSubmit={handleStartupFounderSearch} onClearSeen={handleStartupFounderClearSeen} />}
          {sfStep === 2 && <GlobalSourceProcessing service={sfService} source="Startup Communities" steps={["🚀 Scanning Reddit r/startups and r/entrepreneur","💡 Checking Hacker News Ask HN posts","🌟 Browsing Product Hunt and IndieHackers","🤖 MyThinkAI extracting founders"]} />}
          {sfStep === 3 && (
            <GlobalSourceResults
              leads={sfLeads}
              queryLabel={sfQueryLabel}
              featureIcon="🚀"
              featureName="Startup Founders"
              onReset={() => { setSfStep(1); setSfLeads([]); setSfError(""); setSfQueryLabel(""); sfSeenRef.current = new Set(); }}
              onLoadMore={handleStartupFounderLoadMore}
              loadingMore={sfLoadingMore}
              renderMeta={l => [
                l.platform      && { icon: "🌐", val: l.platform },
                l.startup_stage && { icon: "📈", val: l.startup_stage },
                l.project       && { icon: "🔨", val: l.project.slice(0, 60) + (l.project.length > 60 ? "..." : "") },
              ].filter(Boolean)}
              mainField="requirement"
              onSaveLead={handleSaveLead} savedLeadIds={savedLeadIds} savingLeadId={savingLeadId}
              source="startup_founders"
            />
          )}
        </>
      )}

      {mode === "mca-companies" && (
        <>
          <ErrorBanner message={mcaError} onDismiss={() => setMcaError("")} />
          {mcaStep === 1 && <McaCompaniesInput onSubmit={handleMcaCompaniesSearch} loading={mcaLoading} />}
          {mcaStep === 2 && (
            <ToolCard>
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 2s linear infinite" }}>🏛️</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#c4b5fd", marginBottom: 8 }}>Scanning MCA21 Database</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>AI is finding companies + generating contact details and pitches...</div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            </ToolCard>
          )}
          {mcaStep === 3 && (
            <McaCompaniesResults
              leads={mcaLeads}
              params={mcaParams}
              onReset={() => { setMcaStep(1); setMcaLeads([]); setMcaError(""); }}
              onSaveLead={handleSaveLead}
              savedLeadIds={savedLeadIds}
              savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "intl-companies" && (
        <>
          <ErrorBanner message={intlCoError} onDismiss={() => setIntlCoError("")} />
          {intlCoStep === 1 && <IntlCompaniesInput onSubmit={handleIntlCompaniesSearch} loading={intlCoLoading} />}
          {intlCoStep === 2 && (
            <ToolCard>
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 2s linear infinite" }}>🌍</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#c4b5fd", marginBottom: 8 }}>Finding Global Companies</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>AI is sourcing companies from {intlCoParams.country} with contact details and personalized pitches...</div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </div>
            </ToolCard>
          )}
          {intlCoStep === 3 && (
            <IntlCompaniesResults
              leads={intlCoLeads}
              params={intlCoParams}
              onReset={() => { setIntlCoStep(1); setIntlCoLeads([]); setIntlCoError(""); }}
              onSaveLead={handleSaveLead}
              savedLeadIds={savedLeadIds}
              savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

      {mode === "saved-leads" && (
        <SavedLeadsView
          leads={savedLeads}
          stats={savedLeadsStats}
          loading={savedLeadsLoading}
          enrichingId={enrichingLeadId}
          onEnrich={handleEnrichLead}
          onDelete={handleDeleteLead}
          onFavorite={handleFavoriteLead}
          onExport={handleExportSavedLeads}
          onRefresh={loadSavedLeads}
          onAddToPipeline={handleAddToPipeline}
          pipelineLeadIds={pipeLeadIds}
        />
      )}

      {mode === "pipeline-crm" && (
        <PipelineCRMView
          leads={pipeLeads}
          loading={pipeLoading}
          onUpdate={handlePipelineUpdate}
          onMarkSent={handlePipelineMarkSent}
          onDelete={handlePipelineDelete}
          onGenerateOutreach={handlePipelineGenerateOutreach}
          onRefresh={loadPipeline}
        />
      )}

      {mode === "search-history" && (
        <SearchHistoryView
          sessions={histSessions}
          stats={histStats}
          loading={histLoading}
          hasMore={histHasMore}
          typeFilter={histTypeFilter}
          onTypeFilter={(t) => {
            setHistTypeFilter(t);
            setHistSessions([]); setHistCursor(null);
            loadHistory(t, null);
          }}
          onLoadMore={() => loadHistory(histTypeFilter, histCursor, true)}
          onSaveLead={handleSaveLead}
          savedLeadIds={savedLeadIds}
          savingLeadId={savingLeadId}
        />
      )}

      {/* ── Outreach Sequences ── */}
      {mode === "outreach-sequences" && (
        <>
          {orchStep === 1 && (
            <>
              <OutreachSequenceInput
                onGenerate={handleOrchGenerate}
                loading={orchLoading}
                error={orchError}
                prefillLead={orchPreFillLead}
              />
              <OutreachHistoryView
                sequences={orchSavedSeqs}
                loading={orchSeqLoading}
                hasMore={orchHasMore}
                onLoadMore={() => loadOrchSequences(orchCursor)}
                onDelete={handleOrchDelete}
                onStatusChange={handleOrchStatusChange}
                deletingId={orchDeletingId}
              />
            </>
          )}
          {orchStep === 2 && (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ fontSize:48, marginBottom:16, animation:"spin 1.5s linear infinite" }}>✉️</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#c4b5fd", marginBottom:8 }}>Generating Multi-Channel Outreach Kit</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)" }}>Gemini crafting emails + WhatsApp + LinkedIn for {orchLeadName}…</div>
            </div>
          )}
          {orchStep === 3 && orchSequence && (
            <OutreachSequenceResults
              sequence={orchSequence}
              leadName={orchLeadName}
              goal={orchGoal}
              tone={orchTone}
              whatsapp={orchWhatsapp}
              linkedin={orchLinkedin}
              onSave={handleOrchSave}
              saving={orchSaving}
              saved={orchSaved}
              onReset={() => { setOrchStep(1); setOrchSequence(null); setOrchSaved(false); setOrchError(""); setOrchWhatsapp(null); setOrchLinkedin(null); }}
            />
          )}
        </>
      )}

      {/* ── Trigger Leads (Job Intent) ── */}
      {mode === "trigger-leads" && (
        <>
          <ErrorBanner message={triggerError} onDismiss={() => setTriggerError("")} />
          {triggerStep === 1 && <TriggerLeadsInput onSubmit={handleTriggerLeadsSearch} loading={triggerLoading} />}
          {triggerStep === 2 && (
            <ToolCard>
              <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <div style={{ fontSize:40, marginBottom:16, animation:"spin 2s linear infinite" }}>🔥</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#c4b5fd", marginBottom:8 }}>Finding Companies with Buying Intent</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)" }}>AI is scanning job portals and generating targeted leads with pitch scripts...</div>
                <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
              </div>
            </ToolCard>
          )}
          {triggerStep === 3 && (
            <TriggerLeadsResults
              leads={triggerLeads}
              params={triggerParams}
              onReset={() => { setTriggerStep(1); setTriggerLeads([]); setTriggerError(""); }}
              onSaveLead={handleSaveLead}
              savedLeadIds={savedLeadIds}
              savingLeadId={savingLeadId}
            />
          )}
        </>
      )}

    </ToolShell>
  );
}



