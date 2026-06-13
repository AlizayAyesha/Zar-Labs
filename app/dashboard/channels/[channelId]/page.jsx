import { ChannelPageDashboard } from "../../../../components/dashboard/channels/ChannelPageDashboard";
import { CHANNEL_PAGE_TABS } from "../../../../constants/social/distributionChannelTabs";
import { redirect } from "next/navigation";

export function generateStaticParams() {
  return CHANNEL_PAGE_TABS.map((tab) => ({ channelId: tab.id }));
}

export default function ChannelPage({ params }) {
  const { channelId } = params;
  const valid = CHANNEL_PAGE_TABS.some((t) => t.id === channelId);
  if (!valid) redirect("/dashboard/channels/social");
  return <ChannelPageDashboard channelId={channelId} />;
}
