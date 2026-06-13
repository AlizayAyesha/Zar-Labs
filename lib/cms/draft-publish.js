import { revalidatePath } from "next/cache";

/**
 * Shared draft/publish contract for CMS API routes.
 * GET ?view=draft|published — dashboard uses draft; public uses published only.
 * Body: { intent: 'saveDraft' | 'publish', ...payload }
 */
export function parseCmsView(searchParams) {
  const view = searchParams.get("view");
  if (view === "draft" || view === "published") return view;
  return "published";
}

export function parseCmsIntent(body) {
  if (body?.intent === "saveDraft" || body?.intent === "publish") {
    return body.intent;
  }
  return "saveDraft";
}

export function revalidatePublicPaths(paths = []) {
  for (const path of paths) {
    if (path) revalidatePath(path);
  }
}

export function cmsJsonResponse(data, { status = 200 } = {}) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
