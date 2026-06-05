import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudyBySlug } from "../case-studies-data";
import { CaseStudyDetail } from "../CaseStudyDetail";

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) return {};

  return {
    title: `Zar Labs | ${study.title}`,
    description: study.excerpt,
    openGraph: {
      title: study.title,
      description: study.excerpt,
    },
  };
}

export default function CaseStudyPage({ params }) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) notFound();

  return <CaseStudyDetail study={study} />;
}
