"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { AdminCmsDraftActions } from "../AdminCmsDraftActions";
import { AdminCmsInitialSkeletonGate } from "../AdminCmsInitialSkeletonGate";
import { AdminPublishStatusModal } from "../AdminPublishStatusModal";
import { BookingCrmQuickReference } from "./BookingCrmQuickReference";
import { CHANNEL_GROUPS, CHANNEL_META } from "../../../constants/booking/channelGroups";
import { PORTAL_CONVERSION_PACKS } from "../../../constants/booking/portalConversionPacks";
import { buildDefaultBookingPortalsData } from "../../../lib/booking/portals-defaults";

const SITE_CTAS = [
  { label: "Book a call (Calendly)", route: "Sitewide popup", href: "/contact" },
  { label: "Project intake form", route: "/project-intake", href: "/project-intake" },
  { label: "Newsletter signup", route: "Footer + /newsletter", href: "/newsletter" },
  { label: "Contact email / phone", route: "/contact", href: "/contact" },
];

export function CtaManagementClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(() => buildDefaultBookingPortalsData());
  const [selectedKey, setSelectedKey] = useState("linkedin");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, status: "loading", message: "" });
  const baselineRef = useRef("");

  const loadPortals = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/booking-crm/portals?view=draft");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not load portal data");
      setLoading(false);
      return;
    }
    const loaded = json.data || buildDefaultBookingPortalsData();
    setData(loaded);
    baselineRef.current = JSON.stringify(loaded);
    setDirty(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPortals();
  }, [loadPortals]);

  useEffect(() => {
    setDirty(JSON.stringify(data) !== baselineRef.current);
  }, [data]);

  const portal = data.portals?.[selectedKey];
  const hidden = new Set(data.uiPrefs?.hiddenChannels || []);

  function updatePortal(key, patch) {
    setData((prev) => ({
      ...prev,
      portals: {
        ...prev.portals,
        [key]: { ...prev.portals[key], ...patch },
      },
    }));
  }

  function toggleHidden(key) {
    const next = new Set(data.uiPrefs?.hiddenChannels || []);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setData((prev) => ({
      ...prev,
      uiPrefs: { ...prev.uiPrefs, hiddenChannels: [...next] },
    }));
  }

  function resetChannelDefaults(key) {
    const pack = PORTAL_CONVERSION_PACKS[key];
    const meta = CHANNEL_META[key];
    if (!pack || !meta) return;
    updatePortal(key, {
      headline: pack.headline,
      subheadline: pack.subheadline,
      ctaLabel: pack.ctaLabel,
      trustBullets: [...pack.trustBullets],
      tiers: pack.tiers.map((t) => ({ ...t })),
      faq: pack.faq.map((f) => ({ ...f })),
      slug: meta.defaultSlug,
    });
  }

  async function persist(intent) {
    const isPublish = intent === "publish";
    if (isPublish) setPublishing(true);
    else setSaving(true);
    setModal({ open: true, status: "loading", message: "" });

    const res = await fetch("/api/booking-crm/portals?view=draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, intent }),
    });
    const json = await res.json();

    if (!res.ok) {
      setModal({ open: true, status: "error", message: json.error || "Save failed" });
    } else {
      const saved = json.data || data;
      setData(saved);
      baselineRef.current = JSON.stringify(saved);
      setDirty(false);
      setModal({
        open: true,
        status: "success",
        message: isPublish
          ? "Published. Public /go/* portals updated."
          : "Draft saved. Publish when ready for live portals.",
      });
    }

    setSaving(false);
    setPublishing(false);
  }

  return (
    <AdminCmsEditorShell
      title="CTA Management"
      description="Per-channel booking portals at /go/{slug}. Edit copy, tiers, and FAQ — Save Draft, then Publish."
      actions={
        <AdminCmsDraftActions
          onSaveDraft={() => persist("saveDraft")}
          onPublish={() => persist("publish")}
          saving={saving}
          publishing={publishing}
          dirty={dirty}
        />
      }
    >
      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <div className="dashboard-card dashboard-table-wrap">
        <h2>Sitewide CTAs</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>CTA</th>
              <th>Location</th>
              <th>Backend</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {SITE_CTAS.map((cta) => (
              <tr key={cta.label}>
                <td>{cta.label}</td>
                <td>{cta.route}</td>
                <td>
                  {cta.label.includes("Newsletter")
                    ? "Supabase newsletter_subscribers"
                    : cta.label.includes("intake")
                      ? "Formspree"
                      : "Calendly / mailto"}
                </td>
                <td>
                  <a href={cta.href} target="_blank" rel="noopener noreferrer" className="dashboard-btn">
                    View ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="dashboard-actions" style={{ marginTop: "1rem" }}>
          <Link href="/dashboard/site-system/settings" className="dashboard-btn">
            Edit Calendly URL
          </Link>
          <Link href="/dashboard/booking-crm/sheets-records" className="dashboard-btn">
            Sheets Records
          </Link>
        </div>
      </div>

      <AdminCmsInitialSkeletonGate loading={loading} variant="cards">
        <div className="booking-crm-editor-layout">
          <aside className="booking-crm-channel-nav dashboard-card">
            <h2>Channels</h2>
            {CHANNEL_GROUPS.map((group) => (
              <div key={group.id} className="booking-crm-channel-group">
                <h3>{group.label}</h3>
                <ul>
                  {group.channels.map((key) => {
                    const meta = CHANNEL_META[key];
                    const p = data.portals?.[key];
                    const isHidden = hidden.has(key);
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          className={`booking-crm-channel-btn${selectedKey === key ? " is-active" : ""}`}
                          onClick={() => setSelectedKey(key)}
                        >
                          {meta.label}
                          {!p?.enabled ? <span className="dashboard-badge-muted"> off</span> : null}
                          {isHidden ? <span className="dashboard-badge-muted"> hidden</span> : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </aside>

          {portal ? (
            <div className="booking-crm-channel-editor dashboard-card">
              <div className="booking-crm-editor-header">
                <div>
                  <h2>{CHANNEL_META[selectedKey].label}</h2>
                  <p className="admin-cms-placeholder">{CHANNEL_META[selectedKey].description}</p>
                </div>
                <div className="dashboard-actions">
                  {portal.slug ? (
                    <a
                      href={`/go/${portal.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dashboard-btn"
                    >
                      Preview /go/{portal.slug} ↗
                    </a>
                  ) : null}
                  <button type="button" className="dashboard-btn" onClick={() => resetChannelDefaults(selectedKey)}>
                    Reset defaults
                  </button>
                </div>
              </div>

              <div className="dashboard-form">
                <label className="dashboard-field">
                  <span>
                    <input
                      type="checkbox"
                      checked={portal.enabled !== false}
                      onChange={(e) => updatePortal(selectedKey, { enabled: e.target.checked })}
                    />{" "}
                    Portal enabled
                  </span>
                </label>
                <label className="dashboard-field">
                  <span>
                    <input
                      type="checkbox"
                      checked={hidden.has(selectedKey)}
                      onChange={() => toggleHidden(selectedKey)}
                    />{" "}
                    Hide from channel list (UI pref)
                  </span>
                </label>

                <label className="dashboard-field">
                  Public slug
                  <input
                    value={portal.slug || ""}
                    onChange={(e) => updatePortal(selectedKey, { slug: e.target.value.trim().toLowerCase() })}
                    placeholder="linkedin"
                  />
                </label>
                <label className="dashboard-field">
                  Headline
                  <input
                    value={portal.headline || ""}
                    onChange={(e) => updatePortal(selectedKey, { headline: e.target.value })}
                  />
                </label>
                <label className="dashboard-field">
                  Subheadline
                  <textarea
                    rows={2}
                    value={portal.subheadline || ""}
                    onChange={(e) => updatePortal(selectedKey, { subheadline: e.target.value })}
                  />
                </label>
                <label className="dashboard-field">
                  CTA label
                  <input
                    value={portal.ctaLabel || ""}
                    onChange={(e) => updatePortal(selectedKey, { ctaLabel: e.target.value })}
                  />
                </label>
                <label className="dashboard-field">
                  CTA URL (optional — blank uses Calendly popup)
                  <input
                    value={portal.ctaUrl || ""}
                    onChange={(e) => updatePortal(selectedKey, { ctaUrl: e.target.value })}
                    placeholder="https://calendly.com/..."
                  />
                </label>
                <label className="dashboard-field">
                  Trust bullets (one per line)
                  <textarea
                    rows={4}
                    value={(portal.trustBullets || []).join("\n")}
                    onChange={(e) =>
                      updatePortal(selectedKey, {
                        trustBullets: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </label>

                <TierEditor
                  tiers={portal.tiers || []}
                  onChange={(tiers) => updatePortal(selectedKey, { tiers })}
                />
                <FaqEditor faq={portal.faq || []} onChange={(faq) => updatePortal(selectedKey, { faq })} />
              </div>
            </div>
          ) : null}
        </div>
      </AdminCmsInitialSkeletonGate>

      <BookingCrmQuickReference />

      <AdminPublishStatusModal
        open={modal.open}
        status={modal.status}
        message={modal.message}
        onClose={() => setModal({ open: false, status: "loading", message: "" })}
      />
    </AdminCmsEditorShell>
  );
}

function TierEditor({ tiers, onChange }) {
  function updateTier(index, patch) {
    onChange(tiers.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  return (
    <fieldset className="booking-crm-fieldset">
      <legend>Tiers</legend>
      {tiers.map((tier, i) => (
        <div key={i} className="booking-crm-repeat-row">
          <input
            placeholder="Name"
            value={tier.name}
            onChange={(e) => updateTier(i, { name: e.target.value })}
          />
          <input
            placeholder="Price label"
            value={tier.priceLabel}
            onChange={(e) => updateTier(i, { priceLabel: e.target.value })}
          />
          <input
            placeholder="Description"
            value={tier.description}
            onChange={(e) => updateTier(i, { description: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={!!tier.highlighted}
              onChange={(e) => updateTier(i, { highlighted: e.target.checked })}
            />{" "}
            Highlight
          </label>
          <button type="button" className="dashboard-btn dashboard-btn-danger" onClick={() => onChange(tiers.filter((_, j) => j !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="dashboard-btn"
        onClick={() => onChange([...tiers, { name: "", priceLabel: "", description: "" }])}
      >
        Add tier
      </button>
    </fieldset>
  );
}

function FaqEditor({ faq, onChange }) {
  function updateFaq(index, patch) {
    onChange(faq.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  return (
    <fieldset className="booking-crm-fieldset">
      <legend>FAQ</legend>
      {faq.map((item, i) => (
        <div key={i} className="booking-crm-faq-row">
          <input placeholder="Question" value={item.q} onChange={(e) => updateFaq(i, { q: e.target.value })} />
          <textarea
            placeholder="Answer"
            rows={2}
            value={item.a}
            onChange={(e) => updateFaq(i, { a: e.target.value })}
          />
          <button type="button" className="dashboard-btn dashboard-btn-danger" onClick={() => onChange(faq.filter((_, j) => j !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="dashboard-btn" onClick={() => onChange([...faq, { q: "", a: "" }])}>
        Add FAQ
      </button>
    </fieldset>
  );
}
