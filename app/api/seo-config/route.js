import { getCmsCollection, handleCmsMutation } from "../../../lib/cms/cms-store";
import { cmsJsonResponse, parseCmsView } from "../../../lib/cms/draft-publish";
import { requireDashboardMutationAuth } from "../../../lib/dashboard/mutation-auth";

export async function GET(request) {
  const view = parseCmsView(new URL(request.url).searchParams);
  const data = await getCmsCollection("seo-config", view);
  return cmsJsonResponse({ data, view });
}

export async function PUT(request) {
  try {
    await requireDashboardMutationAuth();
  } catch {
    return cmsJsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await handleCmsMutation("seo-config", request, {
      revalidatePaths: ["/", "/faq", "/newsletter", "/about", "/works", "/contact"],
    });
    return cmsJsonResponse(result);
  } catch (err) {
    return cmsJsonResponse({ error: err.message }, { status: 400 });
  }
}

export async function POST(request) {
  return PUT(request);
}
