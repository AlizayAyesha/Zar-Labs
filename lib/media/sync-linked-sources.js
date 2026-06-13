import { createServerClient } from "../supabase/server";
import { getCmsCollection, saveCmsCollection } from "../cms/cms-store";
import { getWebsiteData, saveWebsiteData } from "../cms/website-data";
import { MEDIA_SOURCE_TYPES } from "./constants";
import { findLinkedAsset, wasLinkedInPrev } from "./bootstrap-assets";

export async function syncLinkedSourcesFromLibrary({ prevAssets = [], nextAssets = [], view = "draft" }) {
  const results = {
    newsletters: 0,
    caseStudies: 0,
    partners: 0,
    team: 0,
    homeFeatured: 0,
    marqueeLogos: 0,
    seoConfig: 0,
  };

  const websiteData = await getWebsiteData(view);
  const registry = [...(websiteData.newsletter_posts_registry || [])];
  let registryChanged = false;

  for (const item of registry) {
    const key = item.slug || item.id;
    const linked = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.NEWSLETTER, key);
    const had = wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.NEWSLETTER, key);
    if (linked) {
      if (item.heroImage !== linked.url || item.imageAlt !== linked.altText) {
        item.heroImage = linked.url;
        item.imageAlt = linked.altText || item.title;
        registryChanged = true;
        results.newsletters += 1;
      }
    } else if (had) {
      item.heroImage = "";
      item.imageAlt = "";
      registryChanged = true;
      results.newsletters += 1;
    }
  }

  if (registryChanged) {
    await saveWebsiteData(view, { ...websiteData, newsletter_posts_registry: registry });
  }

  const seoConfig = await getCmsCollection("seo-config", view);
  let seoChanged = false;
  const orgLogo = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.WEBSITE_LOGO, "organizationLogo");
  const ogImage = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.WEBSITE_OG_IMAGE, "defaultOgImage");
  if (orgLogo || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.WEBSITE_LOGO, "organizationLogo")) {
    const nextUrl = orgLogo?.url || "";
    if (seoConfig.organizationLogo !== nextUrl) {
      seoConfig.organizationLogo = nextUrl;
      seoChanged = true;
    }
  }
  if (ogImage || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.WEBSITE_OG_IMAGE, "defaultOgImage")) {
    const nextUrl = ogImage?.url || "";
    if (seoConfig.defaultOgImage !== nextUrl) {
      seoConfig.defaultOgImage = nextUrl;
      seoChanged = true;
    }
  }
  if (seoChanged) {
    await saveCmsCollection("seo-config", view, seoConfig, { page: "seo", section: "cms" });
    results.seoConfig += 1;
  }

  let db;
  try {
    db = createServerClient();
  } catch {
    return results;
  }

  const { data: featuredRows } = await db.from("featured_projects").select("*");
  for (const project of featuredRows || []) {
    const linked = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.HOME_FEATURED, project.slug);
    if (linked || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.HOME_FEATURED, project.slug)) {
      await db
        .from("featured_projects")
        .update({
          image_url: linked?.url || "",
          alt_text: linked?.altText || project.title,
        })
        .eq("id", project.id);
      results.homeFeatured += 1;
    }
  }

  const { data: marqueeRows } = await db.from("marquee_logos").select("*");
  for (const logo of marqueeRows || []) {
    const linked = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.HOME_MARQUEE, logo.id);
    if (linked || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.HOME_MARQUEE, logo.id)) {
      await db.from("marquee_logos").update({ image_url: linked?.url || "" }).eq("id", logo.id);
      results.marqueeLogos += 1;
    }
  }

  const { data: caseRows } = await db.from("case_studies").select("*");
  if (caseRows?.length) {
    for (const study of caseRows) {
      const slug = study.slug;
      let patch = null;

      const hero = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.CASE_STUDY_HERO, slug);
      const carousel = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.CASE_STUDY_CAROUSEL, slug);

      if (hero || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.CASE_STUDY_HERO, slug)) {
        patch = patch || {};
        patch.hero_image = hero?.url || "";
      }
      if (carousel || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.CASE_STUDY_CAROUSEL, slug)) {
        patch = patch || {};
        patch.carousel_image = carousel?.url || "";
      }

      const gallery = [...(study.gallery || [])];
      let galleryChanged = false;
      for (let i = 0; i < gallery.length; i++) {
        const sourceId = `${slug}::gallery-${i}`;
        const linked = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.CASE_STUDY_GALLERY, sourceId);
        if (linked) {
          gallery[i] = linked.url;
          galleryChanged = true;
        } else if (wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.CASE_STUDY_GALLERY, sourceId)) {
          gallery[i] = "";
          galleryChanged = true;
        }
      }

      for (const asset of nextAssets) {
        if (
          asset.sourceType === MEDIA_SOURCE_TYPES.CASE_STUDY_GALLERY &&
          asset.sourceId?.startsWith(`${slug}::gallery-`) &&
          asset.url
        ) {
          const index = Number(asset.sourceId.split("::gallery-")[1]);
          if (!Number.isNaN(index)) {
            while (gallery.length <= index) gallery.push("");
            gallery[index] = asset.url;
            galleryChanged = true;
          }
        }
      }

      if (galleryChanged) {
        patch = patch || {};
        patch.gallery = gallery.filter(Boolean);
      }

      if (patch) {
        await db.from("case_studies").update(patch).eq("id", study.id);
        results.caseStudies += 1;
      }
    }
  }

  const { data: partners } = await db.from("partners").select("*");
  for (const partner of partners || []) {
    const key = partner.slug || partner.id;
    let patch = null;
    const logo = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.PARTNER_LOGO, key);
    const image = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.PARTNER_IMAGE, key);
    if (logo || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.PARTNER_LOGO, key)) {
      patch = patch || {};
      patch.logo_url = logo?.url || "";
    }
    if (image || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.PARTNER_IMAGE, key)) {
      patch = patch || {};
      patch.image_url = image?.url || "";
    }
    if (patch) {
      await db.from("partners").update(patch).eq("id", partner.id);
      results.partners += 1;
    }
  }

  const { data: team } = await db.from("team_members").select("*");
  for (const member of team || []) {
    const key = member.slug || member.id;
    const linked = findLinkedAsset(nextAssets, MEDIA_SOURCE_TYPES.TEAM_MEMBER, key);
    if (linked || wasLinkedInPrev(prevAssets, MEDIA_SOURCE_TYPES.TEAM_MEMBER, key)) {
      await db
        .from("team_members")
        .update({ photo_url: linked?.url || "" })
        .eq("id", member.id);
      results.team += 1;
    }
  }

  return results;
}
