export const CASE_STUDIES = [
  {
    slug: "ai-customer-support-automation",
    category: "AI Solutions & Automation",
    title: "AI Support Agent for Regional Logistics Company",
    excerpt:
      "Deployed an AI chatbot and RAG knowledge base that cut support tickets by 40% and reduced average response time from hours to seconds.",
    carouselImage: "/casestudy/cs1.webp",
    heroImage: "/images/mockup12.webp",
    summary:
      "A mid-size logistics operator was drowning in repetitive support requests — shipment tracking, billing questions, and delivery updates. Zar Labs built an AI-powered support layer integrated with their existing CRM, trained on internal documentation and live shipment data.",
    challenge:
      "Support staff spent 60% of their time on repetitive inquiries. Customers waited an average of 4 hours for responses during peak periods, and knowledge was scattered across PDFs, emails, and an outdated FAQ page.",
    solution:
      "We designed a RAG-based AI agent connected to their order management system, deployed a voice-ready chatbot on their website and customer portal, and built an internal dashboard for human agents to review and improve AI responses over time.",
    results: [
      "40% reduction in tier-1 support tickets within 90 days",
      "Average first response time dropped from 4 hours to under 30 seconds",
      "Customer satisfaction score increased by 22 points",
      "Support team redeployed to complex account management work",
    ],
    scope: [
      "AI Chatbot Development",
      "RAG Knowledge Base",
      "CRM Integration",
      "Agent Review Dashboard",
      "Workflow Automation",
    ],
    gallery: [
      "/images/mockup12.webp",
      "/casestudy/casestudyphoto3.avif",
      "/casestudy/casestudyphoto1.avif",
      "/images/test14.webp",
    ],
  },
  {
    slug: "saas-project-management-platform",
    category: "Custom Software & SaaS",
    title: "Custom SaaS Platform for Construction Teams",
    excerpt:
      "Built a multi-tenant project management SaaS from scratch — scheduling, document control, and field reporting for 200+ active job sites.",
    carouselImage: "/casestudy/cs2.webp",
    heroImage: "/images/macbook.webp",
    summary:
      "A construction management firm needed to replace spreadsheets and disconnected tools with a single platform their field crews and office teams could rely on daily. Zar Labs delivered a secure, multi-tenant SaaS product with role-based access and real-time project visibility.",
    challenge:
      "Project data lived in spreadsheets, WhatsApp groups, and legacy desktop software. Site managers had no single source of truth, causing delays, duplicate work, and missed change orders.",
    solution:
      "We architected and built a cloud-native SaaS platform with project dashboards, mobile-friendly field reporting, document versioning, automated notifications, and subscription billing — designed to scale across multiple client organizations.",
    results: [
      "200+ active job sites onboarded in the first year",
      "Reporting time reduced by 65% for field supervisors",
      "Change order approval cycle shortened from 5 days to 1 day",
      "Platform uptime maintained at 99.9% post-launch",
    ],
    scope: [
      "SaaS Architecture",
      "Web Application Development",
      "Role-Based Access Control",
      "Mobile-Responsive UI",
      "Subscription Billing Integration",
    ],
    gallery: [
      "/images/macbook.webp",
      "/casestudy/casestudyphoto4.avif",
      "/casestudy/casestudyphoto5.avif",
      "/images/mockup11.webp",
    ],
  },
  {
    slug: "erp-crm-systems-integration",
    category: "Systems Integration",
    title: "Unified CRM & ERP Integration for Manufacturing",
    excerpt:
      "Connected Salesforce, SAP, and payment gateways into one synchronized ecosystem — eliminating manual data entry across sales and operations.",
    carouselImage: "/casestudy/cs3.webp",
    heroImage: "/images/mockup7.webp",
    summary:
      "A manufacturing company struggled with data silos between sales, finance, and production. Zar Labs integrated their CRM, ERP, and payment systems into a unified data flow, giving leadership real-time visibility across the business.",
    challenge:
      "Sales closed deals in Salesforce while production ran on SAP. Invoices were reconciled manually, and leadership lacked a single view of pipeline-to-fulfillment performance.",
    solution:
      "We mapped data flows across all systems, built middleware APIs for bi-directional sync, automated order-to-invoice workflows, and implemented error monitoring with alerting for failed sync events.",
    results: [
      "Eliminated 15+ hours of manual data entry per week",
      "Order-to-invoice processing time reduced by 70%",
      "Zero critical sync failures after 6 months in production",
      "Executive team gained unified pipeline and revenue reporting",
    ],
    scope: [
      "CRM & ERP Integration",
      "API Development",
      "Payment Gateway Sync",
      "Data Mapping & Migration",
      "Monitoring & Alerting",
    ],
    gallery: [
      "/images/mockup7.webp",
      "/casestudy/casestudyphoto2.avif",
      "/casestudy/casestudyphoto6.avif",
      "/images/mockup4.webp",
    ],
  },
  {
    slug: "cloud-migration-cicd-pipeline",
    category: "DevOps & Cloud",
    title: "Cloud Migration & CI/CD for Fintech Startup",
    excerpt:
      "Migrated a legacy monolith to AWS with automated CI/CD, cutting deployment time from days to minutes and improving system reliability.",
    carouselImage: "/casestudy/cs4.webp",
    heroImage: "/images/abs.webp",
    summary:
      "A fintech startup outgrew their single-server setup and needed enterprise-grade infrastructure without slowing down their product team. Zar Labs designed a cloud architecture, migrated their stack to AWS, and implemented full CI/CD automation.",
    challenge:
      "Deployments were manual and risky, taking 2–3 days per release. Downtime during updates affected paying customers, and there was no staging environment that mirrored production.",
    solution:
      "We containerized the application, migrated to AWS with auto-scaling groups, set up GitHub Actions CI/CD pipelines, implemented infrastructure-as-code with Terraform, and added monitoring, logging, and security hardening.",
    results: [
      "Deployment time reduced from 3 days to under 15 minutes",
      "99.95% uptime achieved in the first quarter post-migration",
      "Infrastructure costs optimized by 30% through right-sizing",
      "Zero-downtime deployments enabled for all production releases",
    ],
    scope: [
      "Cloud Architecture (AWS)",
      "CI/CD Pipeline Setup",
      "Containerization",
      "Infrastructure as Code",
      "Security Hardening & Monitoring",
    ],
    gallery: [
      "/images/abs.webp",
      "/casestudy/casestudyphoto1.avif",
      "/casestudy/casestudyphoto3.avif",
      "/images/test18.webp",
    ],
  },
  {
    slug: "ecommerce-analytics-dashboard",
    category: "Data & Analytics",
    title: "Executive Analytics Dashboard for E-Commerce Brand",
    excerpt:
      "Built a real-time BI dashboard consolidating sales, marketing, and inventory data — enabling leadership to make decisions in minutes, not days.",
    carouselImage: "/casestudy/cs1.webp",
    heroImage: "/images/test17.webp",
    summary:
      "A growing e-commerce brand had data spread across Shopify, Google Analytics, Meta Ads, and warehouse systems. Zar Labs built a centralized analytics platform with real-time KPI tracking and automated reporting for the executive team.",
    challenge:
      "Leadership received weekly spreadsheet reports that were already outdated by the time they arrived. Marketing and operations teams used different numbers, leading to conflicting decisions.",
    solution:
      "We integrated all data sources into a unified data pipeline, built interactive dashboards for revenue, CAC, inventory turnover, and campaign ROI, and set up automated daily and weekly report delivery.",
    results: [
      "Reporting cycle reduced from 7 days to real-time",
      "Marketing spend efficiency improved by 18% in Q1",
      "Inventory stockout incidents decreased by 35%",
      "Executive team adopted dashboards as primary decision tool",
    ],
    scope: [
      "Data Pipeline Engineering",
      "Analytics Dashboard Development",
      "KPI Framework Design",
      "Automated Reporting",
      "Multi-Source Data Integration",
    ],
    gallery: [
      "/images/test17.webp",
      "/casestudy/casestudyphoto5.avif",
      "/casestudy/casestudyphoto4.avif",
      "/images/test19.webp",
    ],
  },
  {
    slug: "b2b-saas-seo-performance",
    category: "Search Visibility & Growth",
    title: "Core Web Vitals & SEO Overhaul for B2B SaaS",
    excerpt:
      "Technical SEO and performance optimization that improved organic traffic by 85% and brought all Core Web Vitals into the green zone.",
    carouselImage: "/casestudy/cs2.webp",
    heroImage: "/images/test19.webp",
    summary:
      "A B2B SaaS company had strong product-market fit but poor organic visibility. Their site scored poorly on Core Web Vitals, lacked structured data, and had crawlability issues preventing search engines from indexing key pages.",
    challenge:
      "Organic traffic stagnated for 18 months despite publishing content regularly. Page load times exceeded 5 seconds on mobile, and Google Search Console showed indexing errors on 40% of product pages.",
    solution:
      "Zar Labs conducted a full technical SEO audit, restructured site architecture, implemented schema markup, optimized images and JavaScript bundles, improved server response times, and built a content strategy aligned with high-intent search queries.",
    results: [
      "Organic traffic increased by 85% within 6 months",
      "All Core Web Vitals moved into the green zone",
      "Indexed pages increased from 60% to 98%",
      "Demo request conversions from organic search up 45%",
    ],
    scope: [
      "Technical SEO Audit",
      "Core Web Vitals Optimization",
      "Structured Data Implementation",
      "Site Architecture Restructuring",
      "Search Strategy & Content Alignment",
    ],
    gallery: [
      "/images/test19.webp",
      "/casestudy/casestudyphoto6.avif",
      "/casestudy/casestudyphoto2.avif",
      "/images/image.webp",
    ],
  },
];

export function getCaseStudyBySlug(slug) {
  return CASE_STUDIES.find((study) => study.slug === slug) ?? null;
}
