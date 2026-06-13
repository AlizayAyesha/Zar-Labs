import { redirect } from "next/navigation";

export default function LegacySettingsRedirect() {
  redirect("/dashboard/site-system/settings");
}
