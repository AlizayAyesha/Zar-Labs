import { createServerClient } from "../supabase/server";

export function getAdminDb() {
  return createServerClient();
}

export function mapCaseStudyRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    summary: row.summary,
    challenge: row.challenge,
    solution: row.solution,
    results: row.results || [],
    scope: row.scope || [],
    carouselImage: row.carousel_image,
    heroImage: row.hero_image,
    gallery: row.gallery || [],
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function mapCaseStudyInput(body) {
  return {
    slug: body.slug,
    category: body.category,
    title: body.title,
    excerpt: body.excerpt ?? "",
    summary: body.summary ?? "",
    challenge: body.challenge ?? "",
    solution: body.solution ?? "",
    results: body.results ?? [],
    scope: body.scope ?? [],
    carousel_image: body.carouselImage ?? body.carousel_image ?? "",
    hero_image: body.heroImage ?? body.hero_image ?? "",
    gallery: body.gallery ?? [],
    sort_order: body.sortOrder ?? body.sort_order ?? 0,
    is_published: body.isPublished ?? body.is_published ?? true,
  };
}
