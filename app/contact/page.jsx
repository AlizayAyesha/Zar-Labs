import "./contact.css";
import { ContactPageSection } from "./ContactPageSection";
import { buildPageMetadata } from "../../lib/seo/build-metadata";

export const metadata = buildPageMetadata({
  title: "Get in Touch",
  description:
    "Contact Zar Labs for custom software, AI automation, and digital projects. Email, phone, or book a discovery call—we respond within one business day.",
  path: "/contact",
});

const Contact = () => {
  return <ContactPageSection />;
};

export default Contact;
