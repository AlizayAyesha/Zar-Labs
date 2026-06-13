"use client";

import { useState } from "react";
import Link from "next/link";

export function NewsletterSignup({ compact = false, source = "inline" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Subscription failed. Please try again.");
      }

      setStatus("success");
      setMessage("You're subscribed. Watch your inbox for the next brief.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div className={`newsletter-signup${compact ? " newsletter-signup--compact" : ""}`}>
      {!compact && (
        <p className="newsletter-signup-lead">
          Get new briefs on agentic AI, GEO, crawlers, and product strategy—sourced from what founders ask on{" "}
          <a href="https://www.reddit.com/r/SaaS/" target="_blank" rel="noopener noreferrer" className="newsletter-signup-link">
            Reddit
          </a>{" "}
          and{" "}
          <a href="https://www.quora.com/" target="_blank" rel="noopener noreferrer" className="newsletter-signup-link">
            Quora
          </a>
          , written by Zar Labs.{" "}
          <Link href="/newsletter" className="newsletter-signup-link">
            See latest topics
          </Link>
        </p>
      )}
      <form className="newsletter-signup-form" onSubmit={handleSubmit}>
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="newsletter-signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
        />
        <button type="submit" className="newsletter-signup-btn" disabled={status === "loading" || status === "success"}>
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {message && (
        <p className={`newsletter-signup-msg newsletter-signup-msg--${status}`} role="status">
          {message}
        </p>
      )}
    </div>
  );
}
