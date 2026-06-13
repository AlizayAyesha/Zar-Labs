import { Suspense } from "react";
import DashboardLoginPage from "../../dashboard/login/DashboardLoginClient";

export const metadata = {
  title: "Join Zar Labs Social Engine",
  description: "Create your account — 5 free AI images, strategy chat, and trending looks.",
};

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="dashboard-login">Loading…</div>}>
      <DashboardLoginPage variant="user" initialMode="signup" />
    </Suspense>
  );
}
