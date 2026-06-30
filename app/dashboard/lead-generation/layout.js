import { PlanProvider } from "@/app/contexts/PlanContext";

export const metadata = {
  title: "Lead Generation Dashboard | ThinkSuite",
  description: "AI-powered lead generation — find Google Maps leads, LinkedIn, Instagram, website leads, tenders and more.",
};

export default function LeadGenLayout({ children }) {
  return (
    <PlanProvider>
      {children}
    </PlanProvider>
  );
}
