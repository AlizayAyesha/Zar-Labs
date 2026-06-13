import { getCmsCollection, saveCmsCollection } from "../cms/cms-store";
import { getWebsiteData } from "../cms/website-data";
import { createServerClient } from "../supabase/server";
import { CASE_STUDIES } from "../../app/works/case-studies-data";
import { MEDIA_SOURCE_TYPES, assetDedupeKey, formatFileSize } from "./constants";

function dedupeAssets(assets) {
  const map = new Map();
  for (const asset of assets) {
    map.set(assetDedupeKey(asset), asset);
  }
  return [...map.values()];
}

function pushImageAsset(list, row) {
  if (!row.url) return;
  list.push({
    id: row.id,
    type: "image",
    name: row.name,
    url: row.url,
    altText: row.altText || "",
    size: row.size || "Unknown",
    date: row.date || new Date().toISOString().slice(0, 10),
    page: row.page,
    section: row.section,
    source: row.source,
    context: row.context,
    sourceType: row.sourceType,
    sourceId: row.sourceId,
  });
}

async function bootstrapHomeAndWebsiteAssets(list) {
  const seo = await getCmsCollection("seo-config", "published");
  if (seo?.organizationLogo) {
    pushImageAsset(list, {
      id: "website-organization-logo",
      name: "zarlabs-organization-logo",
      url: seo.organizationLogo,
      altText: seo.organizationName || "Zar Labs",
      page: "home",
      section: "Site logo (SEO)",
      source: "Website Data",
      context: "Organization logo",
      sourceType: MEDIA_SOURCE_TYPES.WEBSITE_LOGO,
      sourceId: "organizationLogo",
    });
  }
  if (seo?.defaultOgImage) {
    pushImageAsset(list, {
      id: "website-og-image",
      name: "default-og-image",
      url: seo.defaultOgImage,
      altText: "Default Open Graph image",
      page: "home",
      section: "OG image (SEO)",
      source: "Website Data",
      context: "og:image",
      sourceType: MEDIA_SOURCE_TYPES.WEBSITE_OG_IMAGE,
      sourceId: "defaultOgImage",
    });
  }

  try {
    const db = createServerClient();
    const { data: featured } = await db.from("featured_projects").select("*").order("sort_order");
    for (const project of featured || []) {
      if (!project.image_url) continue;
      pushImageAsset(list, {
        id: `home-featured-${project.slug}`,
        name: `${project.slug}-featured`,
        url: project.image_url,
        altText: project.alt_text || project.title,
        page: "home",
        section: "Featured projects",
        source: "Home",
        context: project.title,
        sourceType: MEDIA_SOURCE_TYPES.HOME_FEATURED,
        sourceId: project.slug,
      });
    }

    const { data: marquee } = await db.from("marquee_logos").select("*").order("sort_order");
    for (const logo of marquee || []) {
      if (!logo.image_url) continue;
      pushImageAsset(list, {
        id: `home-marquee-${logo.id}`,
        name: `${logo.label || "logo"}-marquee`,
        url: logo.image_url,
        altText: logo.label || "Tech stack logo",
        page: "home",
        section: "Tech stack logos",
        source: "Home",
        context: logo.label,
        sourceType: MEDIA_SOURCE_TYPES.HOME_MARQUEE,
        sourceId: logo.id,
      });
    }
  } catch {
    // optional tables
  }
}

export async function bootstrapMediaLibraryAssets() {
  const list = [];

  await bootstrapHomeAndWebsiteAssets(list);

  const websiteData = await getWebsiteData("published");
  for (const item of websiteData.newsletter_posts_registry || []) {
    if (!item.heroImage) continue;
    pushImageAsset(list, {
      id: `newsletter-${item.id || item.slug}`,
      name: `${item.slug || item.id}-hero.jpg`,
      url: item.heroImage,
      altText: item.title || "",
      size: "Unknown",
      date: item.publishedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      page: "newsletter",
      section: "Newsletter hero",
      source: "Newsletter",
      context: item.title,
      sourceType: MEDIA_SOURCE_TYPES.NEWSLETTER,
      sourceId: item.slug || item.id,
    });
  }

  let caseStudies = [];
  try {
    const db = createServerClient();
    const { data } = await db.from("case_studies").select("*").order("sort_order");
    if (data?.length) caseStudies = data;
  } catch {
    caseStudies = [];
  }

  if (!caseStudies.length) {
    caseStudies = CASE_STUDIES.map((study) => ({
      id: study.slug,
      slug: study.slug,
      title: study.title,
      hero_image: study.heroImage,
      carousel_image: study.carouselImage,
      gallery: study.gallery || [],
    }));
  }

  for (const study of caseStudies) {
    const slug = study.slug || study.id;
    const title = study.title || slug;

    if (study.hero_image || study.heroImage) {
      pushImageAsset(list, {
        id: `case-study-hero-${slug}`,
        name: `${slug}-hero`,
        url: study.hero_image || study.heroImage,
        altText: title,
        size: "Unknown",
        date: new Date().toISOString().slice(0, 10),
        page: "works",
        section: "Case study hero",
        source: "Works",
        context: slug,
        sourceType: MEDIA_SOURCE_TYPES.CASE_STUDY_HERO,
        sourceId: slug,
      });
    }

    if (study.carousel_image || study.carouselImage) {
      pushImageAsset(list, {
        id: `case-study-carousel-${slug}`,
        name: `${slug}-carousel`,
        url: study.carousel_image || study.carouselImage,
        altText: `${title} carousel`,
        size: "Unknown",
        date: new Date().toISOString().slice(0, 10),
        page: "works",
        section: "Case study carousel",
        source: "Works",
        context: slug,
        sourceType: MEDIA_SOURCE_TYPES.CASE_STUDY_CAROUSEL,
        sourceId: slug,
      });
    }

    const gallery = study.gallery || [];
    gallery.forEach((url, index) => {
      if (!url) return;
      pushImageAsset(list, {
        id: `case-study-gallery-${slug}-${index}`,
        name: `${slug}-gallery-${index + 1}`,
        url,
        altText: `${title} gallery ${index + 1}`,
        size: "Unknown",
        date: new Date().toISOString().slice(0, 10),
        page: "works",
        section: "Case study gallery",
        source: "Works",
        context: slug,
        sourceType: MEDIA_SOURCE_TYPES.CASE_STUDY_GALLERY,
        sourceId: `${slug}::gallery-${index}`,
      });
    });
  }

  try {
    const db = createServerClient();
    const { data: partners } = await db.from("partners").select("id, slug, name, logo_url, image_url");
    for (const partner of partners || []) {
      if (partner.logo_url) {
        pushImageAsset(list, {
          id: `partner-logo-${partner.slug || partner.id}`,
          name: `${partner.slug}-logo`,
          url: partner.logo_url,
          altText: partner.name,
          page: "about",
          section: "Partners",
          source: "About",
          context: partner.name,
          sourceType: MEDIA_SOURCE_TYPES.PARTNER_LOGO,
          sourceId: partner.slug || partner.id,
        });
      }
      if (partner.image_url) {
        pushImageAsset(list, {
          id: `partner-image-${partner.slug || partner.id}`,
          name: `${partner.slug}-image`,
          url: partner.image_url,
          altText: partner.name,
          page: "about",
          section: "Partners",
          source: "About",
          context: partner.name,
          sourceType: MEDIA_SOURCE_TYPES.PARTNER_IMAGE,
          sourceId: partner.slug || partner.id,
        });
      }
    }

    const { data: team } = await db.from("team_members").select("id, slug, name, photo_url");
    for (const member of team || []) {
      if (!member.photo_url) continue;
      pushImageAsset(list, {
        id: `team-${member.slug || member.id}`,
        name: `${member.slug || member.id}-photo`,
        url: member.photo_url,
        altText: member.name,
        page: "about",
        section: "Team",
        source: "About",
        context: member.name,
        sourceType: MEDIA_SOURCE_TYPES.TEAM_MEMBER,
        sourceId: member.slug || member.id,
      });
    }
  } catch {
    // Supabase optional for bootstrap
  }

  return dedupeAssets(list);
}

export async function getMediaLibraryData(view = "draft") {
  const raw = await getCmsCollection("media-library-data", view);
  const assets = raw?.assets || raw?.draft?.assets || raw?.published?.assets;

  if (Array.isArray(assets) && assets.length) {
    return { assets: dedupeAssets(assets), isFallback: false, bootstrapped: false };
  }

  if (view === "draft") {
    const published = await getCmsCollection("media-library-data", "published");
    const pubAssets = published?.assets;
    if (Array.isArray(pubAssets) && pubAssets.length) {
      return { assets: dedupeAssets(pubAssets), isFallback: true, bootstrapped: false };
    }
  }

  const bootstrapped = await bootstrapMediaLibraryAssets();
  return { assets: bootstrapped, isFallback: true, bootstrapped: true };
}

export async function saveMediaLibraryData(view, assets) {
  return saveCmsCollection("media-library-data", view, { assets: dedupeAssets(assets) }, {
    page: "media-library",
    section: "cms",
  });
}

export function findLinkedAsset(assets, sourceType, sourceId) {
  return assets.find(
    (a) => a.type === "image" && a.sourceType === sourceType && a.sourceId === sourceId && a.url
  );
}

export function wasLinkedInPrev(prevAssets, sourceType, sourceId) {
  return prevAssets.some(
    (a) => a.type === "image" && a.sourceType === sourceType && a.sourceId === sourceId
  );
}
