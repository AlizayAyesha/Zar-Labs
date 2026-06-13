import { DashboardNav } from "../../components/dashboard/DashboardNav";
import { getDashboardAccessUser } from "../../lib/dashboard/access";
import "./dashboard.css";

export const metadata = {
  title: "Dashboard | Zar Labs",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const user = await getDashboardAccessUser();

  return (
    <div className="dashboard-root">
      {user ? (
        <div className="dashboard-shell">
          <DashboardNav userEmail={user.email} userRole={user.role} />
          <main className="dashboard-main">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
