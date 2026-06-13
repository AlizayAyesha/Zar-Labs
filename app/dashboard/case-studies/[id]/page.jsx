import { redirect } from "next/navigation";

export default function LegacyCaseStudyEditRedirect({ params }) {
  redirect(`/dashboard/site-system/case-studies/${params.id}`);
}
