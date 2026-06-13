import { ProjectIntakePage } from "./ProjectIntakePage";
import { buildPageMetadata } from "../../lib/seo/build-metadata";

export const metadata = buildPageMetadata({
  title: "Project Intake",
  description:
    "Share your business goals, brand direction, and technical requirements. Zar Labs will recommend the right digital scope for your project.",
  path: "/project-intake",
});

export default function Page() {
  return <ProjectIntakePage />;
}
