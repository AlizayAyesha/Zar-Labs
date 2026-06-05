import { SectionFooter } from "../Main/SectionFooter";
import "./legal.css";

export const LegalPageLayout = ({ title, children }) => (
  <>
    <section className="legal-page">
      <div className="legal-page-content">
        <p className="description grey legal-page-eyebrow">Zar Labs</p>
        <h1 className="headline white">{title}</h1>
        <div className="legal-page-body">{children}</div>
      </div>
    </section>
    <SectionFooter />
  </>
);
