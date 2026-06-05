import { LegalPageLayout } from "../legal/LegalPageLayout";

export const metadata = {
  title: "Zar Labs | FAQ",
  description: "Frequently asked questions about Zar Labs services, projects, and support.",
};

const FAQ_ITEMS = [
  {
    q: "What does Zar Labs do?",
    a: "Zar Labs is a technology partner that builds custom software, SaaS platforms, AI automation, integrations, and cloud infrastructure for businesses that need measurable outcomes—not just deliverables.",
  },
  {
    q: "Who do you typically work with?",
    a: "We work with startups, growing companies, and enterprise teams in the US, UK, UAE, and beyond—especially organizations investing in $20,000–$100,000+ digital transformation projects.",
  },
  {
    q: "How does a project usually start?",
    a: "Most engagements begin with a discovery call to understand your goals, systems, and constraints. From there we define scope, timeline, and a phased delivery plan before development begins.",
  },
  {
    q: "Do you offer ongoing support?",
    a: "Yes. We provide managed support, maintenance, monitoring, and iterative improvements so your platform stays secure, performant, and aligned with business growth.",
  },
  {
    q: "Can you integrate with our existing tools?",
    a: "Absolutely. We regularly integrate CRMs, ERPs, payment gateways, analytics platforms, APIs, and cloud services into unified digital ecosystems.",
  },
  {
    q: "How do I get in touch?",
    a: "Email zarlabsteam@gmail.com, call +92 330 706 3298, visit our contact page, or book a call directly from the site. We typically respond within one business day.",
  },
];

export default function FAQPage() {
  return (
    <LegalPageLayout title="Frequently Asked Questions">
      {FAQ_ITEMS.map((item) => (
        <div key={item.q} className="faq-item">
          <h2 className="faq-question">{item.q}</h2>
          <p className="faq-answer">{item.a}</p>
        </div>
      ))}
    </LegalPageLayout>
  );
}
