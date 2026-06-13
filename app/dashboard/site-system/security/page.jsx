import { DashboardPlaceholderPage } from "../../../../components/dashboard/DashboardPlaceholderPage";

export default function SecurityPage() {
  return (
    <DashboardPlaceholderPage
      title="System Logs"
      description="Auth audit log viewer — API: /api/auth/audit (Phase 2)."
      phase2Items={["Login events", "Publish actions", "Failed mutation attempts"]}
    />
  );
}
