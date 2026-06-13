import { Suspense } from "react";
import DashboardLoginPage from "./DashboardLoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="dashboard-login">Loading…</div>}>
      <DashboardLoginPage variant="admin" />
    </Suspense>
  );
}
