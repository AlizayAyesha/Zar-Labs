import {
  getMediaLibraryData,
  saveMediaLibraryData,
} from "../../../lib/media/bootstrap-assets";
import { syncLinkedSourcesFromLibrary } from "../../../lib/media/sync-linked-sources";
import { resolvePathsDiff } from "../../../lib/media/media-library-paths";
import { cmsJsonResponse, parseCmsView, revalidatePublicPaths } from "../../../lib/cms/draft-publish";
import { requireDashboardMutationAuth } from "../../../lib/dashboard/mutation-auth";

export async function GET(request) {
  const view = parseCmsView(new URL(request.url).searchParams);
  const result = await getMediaLibraryData(view);

  return cmsJsonResponse({
    success: true,
    data: {
      assets: result.assets,
      requestedView: view,
      servedView: view,
      isFallback: result.isFallback,
      bootstrapped: result.bootstrapped,
    },
  });
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
    const nextAssets = body.assets || [];

    const prevResult = await getMediaLibraryData(view);
    const prevAssets = prevResult.assets || [];

    await saveMediaLibraryData(view, nextAssets);
    const syncResults = await syncLinkedSourcesFromLibrary({
      prevAssets,
      nextAssets,
      view,
    });

    if (intent === "publish") {
      revalidatePublicPaths(resolvePathsDiff(prevAssets, nextAssets));
    }

    return cmsJsonResponse({
      success: true,
      ok: true,
      view,
      data: { assets: nextAssets },
      syncResults,
    });
  } catch (err) {
    return cmsJsonResponse({ error: err.message }, { status: 400 });
  }
}

export async function POST(request) {
  return PUT(request);
}
