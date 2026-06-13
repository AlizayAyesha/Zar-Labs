import { ChannelPagesTabBar } from "../../../components/dashboard/channels/ChannelPagesTabBar";

export default function ChannelsLayout({ children }) {
  return (
    <div className="channel-pages-shell">
      <ChannelPagesTabBar />
      <div className="channel-pages-content">{children}</div>
    </div>
  );
}
