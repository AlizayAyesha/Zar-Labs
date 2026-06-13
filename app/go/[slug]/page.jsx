import { notFound } from "next/navigation";
import { GoPortalView } from "../../../components/booking/GoPortalView";
import { CHANNEL_META } from "../../../constants/booking/channelGroups";
import { getBookingPortalsData, getPortalBySlug } from "../../../lib/booking/portals-store";
import { buildPageMetadata } from "../../../lib/seo/build-metadata";
import { CALENDLY_EVENT_URL } from "../../config/calendly";
import "./go-portal.css";

export async function generateStaticParams() {
  const data = await getBookingPortalsData("published");
  const slugs = Object.values(data.portals || {})
    .filter((p) => p?.slug && p.enabled !== false)
    .map((p) => ({ slug: p.slug }));
  return slugs.length
    ? slugs
    : [
        { slug: "linkedin" },
        { slug: "instagram" },
        { slug: "snapchat" },
        { slug: "facebook" },
        { slug: "whatsapp" },
        { slug: "website" },
      ];
}

export async function generateMetadata({ params }) {
  const data = await getBookingPortalsData("published");
  const portal = getPortalBySlug(data, params.slug);
  if (!portal) {
    return buildPageMetadata({ title: "Booking", description: "Zar Labs consultation portal", path: `/go/${params.slug}`, noIndex: true });
  }
  return buildPageMetadata({
    title: portal.headline,
    description: portal.subheadline || portal.headline,
    path: `/go/${params.slug}`,
  });
}

export default async function GoPortalPage({ params }) {
  const data = await getBookingPortalsData("published");
  const portal = getPortalBySlug(data, params.slug);
  if (!portal) notFound();

  const meta = CHANNEL_META[portal.channelKey];
  const channelLabel = meta?.label || "Zar Labs";

  return (
    <GoPortalView portal={portal} channelLabel={channelLabel} calendlyFallback={CALENDLY_EVENT_URL} />
  );
}
