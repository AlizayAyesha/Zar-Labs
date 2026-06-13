import { getWebsiteData, handleWebsiteDataMutation } from "../../../../lib/cms/website-data";
import { cmsJsonResponse, parseCmsView } from "../../../../lib/cms/draft-publish";
import { requireDashboardMutationAuth } from "../../../../lib/dashboard/mutation-auth";
import { PUBLIC_NEWSLETTER_PATHS } from "../../../../constants/websiteCmsPaths";

export async function GET(request) {
  const view = parseCmsView(new URL(request.url).searchParams);
  const data = await getWebsiteData(view);
  return cmsJsonResponse({ data, view });
}

export async function PUT(request) {
  try {
    await requireDashboardMutationAuth();
  } catch {
    return cmsJsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const registry = (await getWebsiteData("draft")).newsletter_posts_registry || [];
    const slugs = registry.filter((n) => n.status === "published").map((n) => PUBLIC_NEWSLETTER_PATHS.detail(n.slug));
    const result = await handleWebsiteDataMutation(request, {
      revalidatePaths: [PUBLIC_NEWSLETTER_PATHS.hub, ...slugs],
    });
    return cmsJsonResponse(result);
  } catch (err) {
    return cmsJsonResponse({ error: err.message }, { status: 400 });
  }
}

export async function POST(request) {
  return PUT(request);
}
