import { requireSocialEngineAccess, requireDashboardAdmin } from "../../../../lib/dashboard/access";
import {
  listCatalogItems,
  getCatalogItem,
  upsertCatalogItem,
  deleteCatalogItem,
  seedCatalogIfEmpty,
} from "../../../../lib/social-engine/style-catalog";

export async function GET(request) {
  try {
    await requireSocialEngineAccess();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const admin = url.searchParams.get("admin") === "1";

  try {
    if (admin) {
      await requireDashboardAdmin();
      if (id) {
        const item = await getCatalogItem(id);
        return Response.json({ item });
      }
      const items = await listCatalogItems({ allStatuses: true, limit: 500 });
      return Response.json({ items });
    }

    await seedCatalogIfEmpty();
    if (id) {
      const item = await getCatalogItem(id);
      if (!item || item.status !== "published") {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json({
        item: {
          id: item.id,
          slug: item.slug,
          title: item.title,
          description: item.description,
          category: item.category,
          tags: item.tags,
          preview_url: item.preview_url,
          requires_face: item.requires_face,
          trending_score: item.trending_score,
          usage_count: item.usage_count,
        },
      });
    }

    const category = url.searchParams.get("category");
    let items = await listCatalogItems({ limit: 200 });
    items = items.map(({ prompt: _p, fal_model: _m, fal_params: _f, ...rest }) => rest);
    if (category) items = items.filter((i) => i.category === category);
    return Response.json({ items });
  } catch (err) {
    return Response.json({ error: err.message, items: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await requireDashboardAdmin();
  } catch {
    return Response.json({ error: "Admin only" }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (body.action === "delete" && body.id) {
      await deleteCatalogItem(body.id);
      return Response.json({ success: true });
    }
    const item = await upsertCatalogItem(body);
    return Response.json({ success: true, item });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
