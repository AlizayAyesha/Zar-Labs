/** Social channel catalog for Link Ups + calendar */

export const SOCIAL_PLATFORM_CATEGORIES = [
  { id: "owned", label: "Owned" },
  { id: "social", label: "Social" },
  { id: "video", label: "Video" },
  { id: "community", label: "Community" },
  { id: "discovery", label: "Discovery" },
  { id: "syndication", label: "Syndication" },
];

export const SOCIAL_CHANNELS = [
  { id: "website", category: "owned", label: "Website", defaultUrl: "https://zar-labs.vercel.app" },
  { id: "newsletter", category: "owned", label: "Newsletter", defaultUrl: "https://zar-labs.vercel.app/newsletter" },
  { id: "answers", category: "owned", label: "Answers / AEO", defaultUrl: "https://zar-labs.vercel.app/answers" },
  { id: "project-intake", category: "owned", label: "Project intake", defaultUrl: "https://zar-labs.vercel.app/project-intake" },
  { id: "linkedin", category: "social", label: "LinkedIn", defaultUrl: "https://www.linkedin.com/" },
  { id: "instagram", category: "social", label: "Instagram", defaultUrl: "https://www.instagram.com/zar_labs/" },
  { id: "snapchat", category: "social", label: "Snapchat", defaultUrl: "https://www.snapchat.com/" },
  { id: "facebook", category: "social", label: "Facebook", defaultUrl: "https://www.facebook.com/" },
  { id: "whatsapp", category: "social", label: "WhatsApp", defaultUrl: "https://wa.me/" },
  { id: "x", category: "social", label: "X", defaultUrl: "https://x.com/zarlabs" },
  { id: "youtube", category: "video", label: "YouTube", defaultUrl: "https://www.youtube.com/" },
  { id: "loom", category: "video", label: "Loom", defaultUrl: "https://www.loom.com/" },
  { id: "reddit", category: "community", label: "Reddit", defaultUrl: "https://www.reddit.com/" },
  { id: "quora", category: "community", label: "Quora", defaultUrl: "https://www.quora.com/" },
  { id: "google-business", category: "discovery", label: "Google Business", defaultUrl: "https://business.google.com/" },
  { id: "product-hunt", category: "discovery", label: "Product Hunt", defaultUrl: "https://www.producthunt.com/" },
  { id: "medium", category: "syndication", label: "Medium", defaultUrl: "https://medium.com/" },
  { id: "devto", category: "syndication", label: "Dev.to", defaultUrl: "https://dev.to/" },
  { id: "hashnode", category: "syndication", label: "Hashnode", defaultUrl: "https://hashnode.com/" },
];

export const CHANNEL_TYPES = {
  linkedin: [
    { id: "linkedin-post", label: "Post", panelId: "text-micro" },
    { id: "linkedin-article", label: "Article", panelId: "article-longform" },
    { id: "linkedin-newsletter", label: "Newsletter", panelId: "newsletter" },
    { id: "linkedin-thread", label: "Comment thread", panelId: "thread" },
  ],
  instagram: [
    { id: "instagram-feed", label: "Feed", panelId: "image-infographic" },
    { id: "instagram-story", label: "Story", panelId: "story-status" },
    { id: "instagram-reel", label: "Reel", panelId: "short-video" },
  ],
  snapchat: [
    { id: "snapchat-snap", label: "Snap", panelId: "story-status" },
    { id: "snapchat-story", label: "Story", panelId: "story-status" },
    { id: "snapchat-spotlight", label: "Spotlight", panelId: "short-video" },
  ],
  facebook: [
    { id: "facebook-feed", label: "Feed post", panelId: "image-infographic" },
    { id: "facebook-story", label: "Story", panelId: "story-status" },
    { id: "facebook-reel", label: "Reel", panelId: "short-video" },
  ],
  whatsapp: [
    { id: "whatsapp-status", label: "Status", panelId: "story-status" },
    { id: "whatsapp-broadcast", label: "Broadcast", panelId: "text-micro" },
    { id: "whatsapp-business", label: "Business CTA", panelId: "text-micro" },
  ],
  x: [
    { id: "x-post", label: "Post", panelId: "text-micro" },
    { id: "x-thread", label: "Thread", panelId: "thread" },
  ],
  newsletter: [{ id: "newsletter-issue", label: "Issue", panelId: "newsletter" }],
  website: [{ id: "blog-post", label: "Blog / insight", panelId: "article-longform" }],
  youtube: [{ id: "youtube-long", label: "Long video", panelId: "long-video" }],
  default: [{ id: "generic-post", label: "Post", panelId: "text-micro" }],
};

export function getChannelTypes(channelId) {
  return CHANNEL_TYPES[channelId] || CHANNEL_TYPES.default;
}

export function getChannelsForCategory(categoryId) {
  return SOCIAL_CHANNELS.filter((c) => c.category === categoryId);
}
