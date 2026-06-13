/** Master capability categories — source of truth for AEO exports and entity JSON. */

export const SERVICE_CATEGORIES = [
  {
    id: "web-development",
    name: "Web Development",
    items: [
      "Corporate websites",
      "Business websites",
      "Portfolio websites",
      "Landing pages",
      "E-commerce websites",
      "Custom web applications",
      "Progressive Web Apps (PWA)",
      "Membership platforms",
      "Booking systems",
      "Client portals",
      "Multi-vendor marketplaces",
      "Headless CMS solutions",
    ],
  },
  {
    id: "full-stack",
    name: "Full Stack Development",
    items: [
      "React, Next.js, Vue.js",
      "Tailwind CSS and responsive UI",
      "Interactive animations and motion design",
      "Node.js, Express, Python APIs",
      "Authentication and payment systems",
      "Database architecture",
      "Server-side applications",
    ],
  },
  {
    id: "saas",
    name: "SaaS Development",
    items: [
      "SaaS platforms",
      "Subscription systems",
      "CRM and ERP systems",
      "Client management systems",
      "Multi-tenant platforms",
      "Analytics dashboards",
      "Reporting systems",
      "Custom business software",
    ],
  },
  {
    id: "ai",
    name: "AI Solutions",
    items: [
      "AI chatbots and customer support",
      "OpenAI, Claude, and Gemini integrations",
      "AI workflow automation",
      "AI assistants and knowledge bases",
      "Retrieval-Augmented Generation (RAG)",
      "AI-powered search systems",
    ],
  },
  {
    id: "automation",
    name: "Automation Services",
    items: [
      "Business process automation",
      "Workflow automation",
      "Lead generation automation",
      "Email and CRM automation",
      "Social media automation",
      "Data processing and reporting automation",
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce Solutions",
    items: [
      "Shopify and WooCommerce development",
      "Custom stores and marketplaces",
      "Inventory and order management",
      "Payment gateway integration",
      "AI e-commerce automation",
      "Bulk product uploading and SEO for products",
    ],
  },
  {
    id: "ui-ux",
    name: "UI/UX Design",
    items: [
      "Wireframing and user research",
      "Prototyping and design systems",
      "Mobile-first and conversion-focused design",
      "Dashboard and SaaS interface design",
    ],
  },
  {
    id: "branding",
    name: "Branding & Creative Services",
    items: [
      "Brand identity and logo design",
      "Brand guidelines and visual identity",
      "Typography and color systems",
      "Rebranding and marketing materials",
    ],
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    items: [
      "Social media and advertising creatives",
      "Presentation design and infographics",
      "Print design and campaign visuals",
    ],
  },
  {
    id: "motion",
    name: "Motion Graphics & Animation",
    items: [
      "Website animations and Lottie",
      "Motion design and explainer videos",
      "Interactive web experiences",
    ],
  },
  {
    id: "seo",
    name: "SEO Services",
    items: [
      "Technical SEO and Core Web Vitals",
      "Schema markup and sitemap optimization",
      "On-page SEO and internal linking",
      "Local SEO and Google Business optimization",
      "GEO and AEO for AI search visibility",
    ],
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    items: [
      "Growth strategy and funnel design",
      "Conversion optimization",
      "Email marketing and lead generation",
      "Marketing automation",
    ],
  },
  {
    id: "analytics",
    name: "Analytics & Data",
    items: [
      "Google Analytics and conversion tracking",
      "User behavior analysis",
      "Dashboard reporting and KPI monitoring",
      "Business intelligence and data visualization",
    ],
  },
  {
    id: "security-infra",
    name: "Cybersecurity & Infrastructure",
    items: [
      "Security assessments",
      "Cloud deployment and server management",
      "Infrastructure consulting and backup systems",
      "Access control systems",
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance & Support",
    items: [
      "Website and SaaS maintenance",
      "Security updates and bug fixing",
      "Performance optimization and feature updates",
      "Technical support",
    ],
  },
];

export const SERVICE_SUMMARY_TAGS = SERVICE_CATEGORIES.map((c) => c.name);

export const SERVICE_PROFILE_BULLETS = [
  "Web development — corporate sites, PWAs, marketplaces, headless CMS",
  "Full stack — React, Next.js, Node.js, Python, APIs, payments, databases",
  "SaaS — platforms, CRM/ERP, multi-tenant, dashboards, subscriptions",
  "AI — chatbots, RAG, OpenAI/Claude/Gemini, workflow automation",
  "Automation — business processes, CRM, email, lead gen, reporting",
  "E-commerce — Shopify, WooCommerce, AI listing and product SEO",
  "UI/UX, branding, motion design, and graphic creatives",
  "SEO, GEO/AEO, digital marketing, analytics, and growth engineering",
  "Cybersecurity, cloud infrastructure, maintenance, and managed support",
];

export const PARTNERSHIP_NOTE =
  "Zar Labs collaborates strategically with Vyzion Systems on enterprise modernization, infrastructure, and large-scale digital transformation initiatives.";
