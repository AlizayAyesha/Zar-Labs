import Link from "next/link";
import { WEBSITE_CMS_PATHS } from "../../../constants/websiteCmsPaths";

const STEPS = [
  {
    num: 1,
    title: "Bootstrap",
    body: "On first load the library pulls images already stored in Home, Works (portfolio), Newsletter posts, About (team & partners), and site logos.",
  },
  {
    num: 2,
    title: "Edit in one place",
    body: "Replace image, delete, or edit alt text here. Each card shows which page and CMS record it is linked to.",
  },
  {
    num: 3,
    title: "Save Draft",
    body: "Writes the media library draft and pushes image URLs into draft copies of website-data (newsletters), case studies, partners, team, home carousel, and tech logos.",
  },
  {
    num: 4,
    title: "Publish",
    body: "Same sync with view=published. Public routes revalidate so the live site picks up changes.",
  },
  {
    num: 5,
    title: "Site logos",
    body: "Organization logo and OG image are also editable here; they sync to SEO / website config. Partner & tech-stack logos appear under Home and Certs tabs.",
  },
];

const SOURCE_MAP = [
  { label: "Home", sources: "Featured projects carousel, tech-stack marquee logos" },
  { label: "Works (portfolio)", sources: "Case study hero, carousel, gallery" },
  { label: "Newsletter (posts)", sources: "Newsletter hero images via website-data" },
  { label: "About", sources: "Team photos, partner logos & images" },
  { label: "Certs / logos", sources: "Marquee logos + partner marks; org logo → SEO config" },
];

export function MediaLibraryWorkflowGuide({ collapsed = false }) {
  if (collapsed) {
    return (
      <details className="media-library-workflow media-library-workflow--compact">
        <summary>How Media Library works (bootstrap → draft → publish)</summary>
        <WorkflowBody />
      </details>
    );
  }

  return (
    <div className="media-library-workflow">
      <div className="media-library-workflow-header">
        <h2>How it works</h2>
        <p>Hub-and-spoke: one registry, linked CMS sources, draft/publish sync.</p>
      </div>
      <WorkflowBody />
    </div>
  );
}

function WorkflowBody() {
  return (
    <>
      <ol className="media-library-workflow-steps">
        {STEPS.map((step) => (
          <li key={step.num}>
            <strong>
              {step.num}. {step.title}
            </strong>
            <span>{step.body}</span>
          </li>
        ))}
      </ol>

      <div className="media-library-workflow-sources">
        <h3>Zar Labs image sources</h3>
        <table className="dashboard-table media-library-sources-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Bootstrapped from</th>
            </tr>
          </thead>
          <tbody>
            {SOURCE_MAP.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{row.sources}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="media-library-workflow-links">
        API: <code>GET/PUT /api/media-library-data</code> · Newsletter posts:{" "}
        <Link href={WEBSITE_CMS_PATHS.newsletter.list}>Newsletter editor</Link> · SEO logo
        fields: <Link href="/dashboard/site-system/seo">SEO / AEO Hub</Link>
      </p>
    </>
  );
}
