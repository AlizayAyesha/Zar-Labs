import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudyBySlug } from "../case-studies-data";
import { CaseStudyDetail } from "../CaseStudyDetail";
import { buildPageMetadata } from "../../../lib/seo/build-metadata";

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) return {};

  const ogImage = study.heroImage || study.carouselImage || "/og-image.jpg";

  return buildPageMetadata({
    title: study.title,
    description: study.excerpt,
    path: `/works/${study.slug}`,
    ogImage,
    ogType: "article",
  });
}

export default function CaseStudyPage({ params }) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) notFound();

  return <CaseStudyDetail study={study} />;
}
