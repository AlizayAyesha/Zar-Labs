import "./about.css";
import { AboutPageSection } from "./AboutPageSection";

export const metadata = {
  title: 'Zar Labs | About Us',
  description: "Zar Labs helps businesses transform ideas into scalable digital products, intelligent automation, and technology-driven growth.",
  openGraph: {
    title: 'About Us',
  },
}

const About = () => {

  return (
    <AboutPageSection />
  );
};

export default About;