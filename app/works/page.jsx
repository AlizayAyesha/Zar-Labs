import "./works.css";
import { WorksPageSection } from "./WorksPageSection";
import { buildPageMetadata } from "../../lib/seo/build-metadata";

export const metadata = buildPageMetadata({
  title: "Works & Case Studies",
  description:
    "Explore Zar Labs portfolio: AI automation, SaaS platforms, ERP integrations, cloud migrations, and web design case studies with measurable outcomes.",
  path: "/works",
});

const Works = () => {
  return <WorksPageSection />;
};

export default Works;
