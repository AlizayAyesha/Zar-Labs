import { getAdminDb } from "../../../../lib/dashboard/db";
import { requireDashboardUser, unauthorizedResponse } from "../../../../lib/dashboard/auth";

export async function GET() {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const db = getAdminDb();

  const [newsletter, caseStudies, faqs, videos] = await Promise.all([
    db.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    db.from("case_studies").select("id", { count: "exact", head: true }),
    db.from("faq_items").select("id", { count: "exact", head: true }),
    db.from("site_videos").select("id", { count: "exact", head: true }),
  ]);

  return Response.json({
    counts: {
      newsletterSubscribers: newsletter.count ?? 0,
      caseStudies: caseStudies.count ?? 0,
      faqs: faqs.count ?? 0,
      videos: videos.count ?? 0,
    },
  });
}
