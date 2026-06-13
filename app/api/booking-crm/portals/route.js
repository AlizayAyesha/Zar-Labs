import { cmsJsonResponse, parseCmsView, revalidatePublicPaths } from "../../../../lib/cms/draft-publish";
import { getBookingPortalsData, saveBookingPortalsData } from "../../../../lib/booking/portals-store";
import { requireDashboardMutationAuth } from "../../../../lib/dashboard/mutation-auth";

export async function GET(request) {
  const view = parseCmsView(new URL(request.url).searchParams);
  const data = await getBookingPortalsData(view);
  return cmsJsonResponse({ success: true, data, view });
}

export async function PUT(request) {
  try {
    await requireDashboardMutationAuth();
  } catch {
    return cmsJsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const intent = body.intent === "publish" ? "publish" : "saveDraft";
    const view = intent === "publish" ? "published" : "draft";
    const { intent: _i, ...payload } = body;

    await saveBookingPortalsData(view, payload);

    if (intent === "publish") {
      const slugs = Object.values(payload.portals || {})
        .filter((p) => p?.slug && p.enabled !== false)
        .map((p) => `/go/${p.slug}`);
      revalidatePublicPaths(["/go", ...slugs]);
    }

    return cmsJsonResponse({ success: true, ok: true, view, data: payload });
  } catch (err) {
    return cmsJsonResponse({ error: err.message }, { status: 400 });
  }
}

export async function POST(request) {
  return PUT(request);
}
