import { redirect } from "next/navigation";

export default function LegacyVideosRedirect() {
  redirect("/dashboard/site-system/videos");
}
