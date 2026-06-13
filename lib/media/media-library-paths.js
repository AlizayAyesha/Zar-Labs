import { PUBLIC_NEWSLETTER_PATHS } from "../../constants/websiteCmsPaths";
import { MEDIA_SOURCE_TYPES } from "./constants";

export function resolveMediaLibraryIndexingPaths(assets = []) {
  const paths = new Set(["/"]);

  for (const asset of assets) {
    if (asset.type !== "image" || !asset.url) continue;

    switch (asset.sourceType) {
      case MEDIA_SOURCE_TYPES.CASE_STUDY_HERO:
      case MEDIA_SOURCE_TYPES.CASE_STUDY_CAROUSEL:
      case MEDIA_SOURCE_TYPES.CASE_STUDY_GALLERY:
        paths.add("/works");
        if (asset.sourceId?.includes("::")) {
          const slug = asset.sourceId.split("::")[0];
          paths.add(`/works/${slug}`);
        } else if (asset.context) {
          paths.add(`/works/${asset.context}`);
        }
        break;
      case MEDIA_SOURCE_TYPES.NEWSLETTER:
        paths.add(PUBLIC_NEWSLETTER_PATHS.hub);
        if (asset.sourceId) paths.add(PUBLIC_NEWSLETTER_PATHS.detail(asset.sourceId));
        break;
      case MEDIA_SOURCE_TYPES.PARTNER_LOGO:
      case MEDIA_SOURCE_TYPES.PARTNER_IMAGE:
      case MEDIA_SOURCE_TYPES.TEAM_MEMBER:
        paths.add("/about");
        break;
      case MEDIA_SOURCE_TYPES.HOME_FEATURED:
      case MEDIA_SOURCE_TYPES.HOME_MARQUEE:
      case MEDIA_SOURCE_TYPES.WEBSITE_LOGO:
      case MEDIA_SOURCE_TYPES.WEBSITE_OG_IMAGE:
        paths.add("/");
        break;
      default:
        if (asset.page === "works") paths.add("/works");
        if (asset.page === "newsletter") paths.add(PUBLIC_NEWSLETTER_PATHS.hub);
        if (asset.page === "about") paths.add("/about");
        break;
    }
  }

  return [...paths];
}

export function resolvePathsDiff(prevAssets = [], nextAssets = []) {
  return resolveMediaLibraryIndexingPaths([...prevAssets, ...nextAssets]);
}
