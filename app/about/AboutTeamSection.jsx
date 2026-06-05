"use client";

import { Instagram } from "lucide-react";

const TEAM_LEADS = [
  {
    id: "alizay",
    name: "Alizay Ayesha",
    role: "All-Rounder Expert",
    bio: "Cross-functional specialist spanning product, delivery, and client success — keeping projects aligned from kickoff to launch.",
    instagram: "https://www.instagram.com/alizay_ayesha/",
    initials: "AA",
    photo: "/images/alizay%20ayesha.jpg",
  },
  {
    id: "caio",
    name: "Caio Vinicius A. Faguette",
    role: "Security & Backend Expert",
    bio: "Architects secure, scalable backend systems with a focus on infrastructure hardening, API design, and enterprise-grade reliability.",
    instagram: "https://www.instagram.com/cvinicius_28/",
    initials: "CV",
    photo: "/images/caio%20.jpg",
  },
  {
    id: "shanzay",
    name: "Shanzay Fatima",
    role: "Graphic Team Lead",
    bio: "Leads brand identity, visual systems, and creative direction — ensuring every Zar Labs deliverable looks polished and on-brand.",
    instagram: "https://www.instagram.com/1_the_best_anime/",
    initials: "SF",
    photo: "/images/shanzay.jpg",
  },
];

const TEAM_UNITS = [
  {
    id: "pm",
    title: "Project Management",
    description: "Dedicated PMs coordinating timelines, milestones, and client communication across every engagement.",
  },
  {
    id: "cto",
    title: "CTO & Technology Leadership",
    description: "Senior technical leadership setting architecture standards, stack decisions, and long-term product strategy.",
  },
  {
    id: "devops",
    title: "DevOps & Infrastructure",
    description: "Cloud deployment, CI/CD pipelines, monitoring, and infrastructure that keeps products fast and reliable.",
  },
  {
    id: "marketing",
    title: "Marketing Team",
    description: "Growth strategy, campaigns, content, and digital presence built to attract and convert the right clients.",
  },
  {
    id: "video",
    title: "Video Editing Team",
    description: "Motion, reels, product demos, and campaign video — production-ready assets for web and social.",
  },
];

export const AboutTeamSection = ({ sectionRef }) => (
  <div className="about-team" ref={sectionRef}>
    <div className="about-team-glow" aria-hidden="true" />
    <header className="about-team-header">
      <p className="about-team-eyebrow">Our Team</p>
      <h2 className="headline about-team-title white">
        The people behind <span className="accent-green">Zar Labs</span>
      </h2>
      <p className="about-team-subheading grey">
        Expert leads and specialized teams working together — from security and engineering to design,
        marketing, and delivery.
      </p>
    </header>

    <div className="about-team-grid about-team-grid--leads">
      {TEAM_LEADS.map((member) => (
        <article key={member.id} className="about-team-card">
          <div className="about-team-card-border" aria-hidden="true" />
          <div className="about-team-card-photo-wrap">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="about-team-card-photo"
              />
            ) : (
              <div className="about-team-card-initials" aria-hidden="true">
                {member.initials}
              </div>
            )}
          </div>
          <div className="about-team-card-body">
            <p className="about-team-card-role">{member.role}</p>
            <h3 className="about-team-card-name white">{member.name}</h3>
            <p className="about-team-card-bio description grey">{member.bio}</p>
            <a
              href={member.instagram}
              className="about-team-card-social"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Instagram`}
            >
              <Instagram strokeWidth={1.5} className="about-team-card-social-icon" />
              <span className="small-description grey">Instagram</span>
            </a>
          </div>
        </article>
      ))}
    </div>

    <div className="about-team-units">
      <h3 className="subheadline about-team-units-title white">Specialized teams</h3>
      <div className="about-team-units-grid">
        {TEAM_UNITS.map((unit) => (
          <div key={unit.id} className="about-team-unit-card">
            <p className="about-team-unit-title white">{unit.title}</p>
            <p className="description about-team-unit-desc grey">{unit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
