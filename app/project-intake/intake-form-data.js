export const SERVICE_OPTIONS = [
  "Custom Software Development",
  "SaaS Platform",
  "AI Solutions & Automation",
  "Systems Integration",
  "DevOps & Cloud Infrastructure",
  "UI/UX Design",
  "E-Commerce",
  "Data & Analytics",
  "SEO & Growth Engineering",
  "Managed Support",
];

export const WEBSITE_SCOPE_OPTIONS = [
  { value: "basic", label: "Basic website (~5 pages)" },
  { value: "advanced", label: "Advanced website (20+ pages)" },
  { value: "infrastructure", label: "Full digital infrastructure" },
];

export const DESIGN_STYLE_OPTIONS = [
  { value: "precision", label: "Precision — symmetrical, clarity-focused, performance-driven" },
  { value: "cozy", label: "Cozy — warm, approachable, human-centered" },
  { value: "balanced", label: "Balanced mix of both" },
];

export const ANIMATION_OPTIONS = [
  { value: "minimal", label: "Minimal / subtle" },
  { value: "advanced", label: "Advanced interactions" },
  { value: "pro", label: "Pro / cinematic" },
];

export const DATABASE_OPTIONS = ["Supabase", "PostgreSQL", "MongoDB", "Other / not sure"];

export const PLATFORM_FEATURES = [
  "Admin dashboard",
  "Headless CMS",
  "CRM integration",
  "ERP integration",
  "Google Analytics",
  "Google & Bing SEO",
  "New IP security alerts",
  "New device tracking",
  "Help center integration",
  "Google Sheets / app sync",
  "Supabase migration",
  "No-cache delivery",
  "Traffic & analytics reporting",
  "Media library",
  "DevOps & CI/CD",
  "Contact forms",
  "Sign up / login",
  "Stripe payments",
  "CTA banners",
  "Newsletter module",
  "Blog with rich text editor",
  "SEO meta & tags",
  "Mobile & desktop responsive",
  "Booking page integration",
  "Advanced admin controls",
];

export const BRAND_ASSET_OPTIONS = [
  { value: "have-logo", label: "I have a logo" },
  { value: "need-logo", label: "I need a logo created" },
  { value: "have-brand-kit", label: "I have a brand kit" },
  { value: "need-brand-kit", label: "I need a brand kit created" },
  { value: "need-marketing-template", label: "I need marketing templates" },
];

export const INITIAL_FORM = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  services: [],
  websiteScope: "",
  pageCount: "",
  brandAssets: [],
  colorPalette: "",
  typography: "",
  designStyle: "",
  animationLevel: "",
  databases: [],
  platformFeatures: [],
  ctaBannerCount: "",
  newsletter: "",
  integrationsNotes: "",
  securityNotes: "",
  clientContent: "",
  additionalNotes: "",
};

export const toggleArrayValue = (arr, value) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

export const buildEmailBody = (form) => {
  const scopeLabel =
    WEBSITE_SCOPE_OPTIONS.find((option) => option.value === form.websiteScope)?.label ||
    form.websiteScope ||
    "—";

  return [
    "ZAR LABS — PROJECT INTAKE",
    "",
    "CONTACT",
    `Name: ${form.fullName}`,
    `Email: ${form.email}`,
    `Company: ${form.company}`,
    `Phone: ${form.phone || "—"}`,
    "",
    "PROJECT",
    `Services: ${form.services.join(", ") || "—"}`,
    `Scope: ${scopeLabel}`,
    `Pages: ${form.pageCount || "—"}`,
    "",
    "BRAND & DESIGN",
    `Assets: ${form.brandAssets.join(", ") || "—"}`,
    `Colors: ${form.colorPalette || "—"}`,
    `Typography: ${form.typography || "—"}`,
    `Design style: ${form.designStyle || "—"}`,
    `Animation: ${form.animationLevel || "—"}`,
    "",
    "TECHNOLOGY",
    `Database: ${form.databases.join(", ") || "—"}`,
    `Features: ${form.platformFeatures.join(", ") || "—"}`,
    `CTA banners: ${form.ctaBannerCount || "—"}`,
    `Newsletter: ${form.newsletter || "—"}`,
    "",
    "INTEGRATIONS",
    form.integrationsNotes || "—",
    "",
    "SECURITY",
    form.securityNotes || "—",
    "",
    "CLIENT CONTENT",
    form.clientContent || "—",
    "",
    "NOTES",
    form.additionalNotes || "—",
  ].join("\n");
};

export const buildFormspreePayload = (form) => {
  const scopeLabel =
    WEBSITE_SCOPE_OPTIONS.find((option) => option.value === form.websiteScope)?.label ||
    form.websiteScope ||
    "—";

  return {
    _replyto: form.email,
    _subject: `Project Intake — ${form.company || form.fullName || "New Lead"}`,
    name: form.fullName,
    email: form.email,
    company: form.company,
    phone: form.phone || "—",
    services: form.services.join(", ") || "—",
    website_scope: scopeLabel,
    page_count: form.pageCount || "—",
    brand_assets: form.brandAssets.join(", ") || "—",
    color_palette: form.colorPalette || "—",
    typography: form.typography || "—",
    design_style: form.designStyle || "—",
    animation_level: form.animationLevel || "—",
    databases: form.databases.join(", ") || "—",
    platform_features: form.platformFeatures.join(", ") || "—",
    cta_banners: form.ctaBannerCount || "—",
    newsletter: form.newsletter || "—",
    integrations: form.integrationsNotes || "—",
    security: form.securityNotes || "—",
    client_content: form.clientContent || "—",
    additional_notes: form.additionalNotes || "—",
    page_path: "/project-intake",
    message: buildEmailBody(form),
  };
};
