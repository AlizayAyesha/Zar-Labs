import { DashboardPlaceholderPage } from "../../../../components/dashboard/DashboardPlaceholderPage";

export default function AnalyticsPage() {
  return (
    <DashboardPlaceholderPage
      title="Traffic & Funnels"
      description="GA4 dashboard — set NEXT_PUBLIC_GA_MEASUREMENT_ID and wire generate_lead events (Phase 2)."
      phase2Items={["Realtime traffic", "Lead conversions", "Custom dimensions: lead_source, page_identifier"]}
    />
  );
}
