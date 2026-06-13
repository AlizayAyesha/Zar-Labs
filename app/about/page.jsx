import "./about.css";
import { AboutPageSection } from "./AboutPageSection";
import { buildPageMetadata } from "../../lib/seo/build-metadata";

export const metadata = buildPageMetadata({
  title: "About Us",
  description:
    "Zar Labs helps businesses transform ideas into scalable digital products, intelligent automation, and technology-driven growth.",
  path: "/about",
});

const About = () => {
  return <AboutPageSection />;
};

export default About;
