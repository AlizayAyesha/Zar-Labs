import { redirect } from "next/navigation";

export default function LegacyFaqRedirect() {
  redirect("/dashboard/site-system/faq");
}
