"use client";

import { CHANNEL_META } from "../../../constants/booking/channelGroups";
import { PORTAL_CONVERSION_PACKS } from "../../../constants/booking/portalConversionPacks";

function TierEditor({ tiers, onChange }) {
  function updateTier(index, patch) {
    onChange(tiers.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  return (
    <fieldset className="booking-crm-fieldset">
      <legend>Tiers</legend>
      {tiers.map((tier, i) => (
        <div key={i} className="booking-crm-repeat-row">
          <input placeholder="Name" value={tier.name} onChange={(e) => updateTier(i, { name: e.target.value })} />
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
          <button
            type="button"
            className="dashboard-btn dashboard-btn-danger"
            onClick={() => onChange(tiers.filter((_, j) => j !== i))}
          >
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
          <textarea placeholder="Answer" rows={2} value={item.a} onChange={(e) => updateFaq(i, { a: e.target.value })} />
          <button
            type="button"
            className="dashboard-btn dashboard-btn-danger"
            onClick={() => onChange(faq.filter((_, j) => j !== i))}
          >
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

export function ChannelPortalEditor({ channelKey, portal, hidden, onUpdatePortal, onToggleHidden, onResetDefaults }) {
  const meta = CHANNEL_META[channelKey];
  if (!meta || !portal) return null;

  return (
    <div className="dashboard-card channel-portal-editor">
      <div className="booking-crm-editor-header">
        <div>
          <h2>{meta.label} — booking portal</h2>
          <p className="admin-cms-placeholder">{meta.description}</p>
        </div>
        <div className="dashboard-actions">
          {portal.slug ? (
            <a href={`/go/${portal.slug}`} target="_blank" rel="noopener noreferrer" className="dashboard-btn">
              Preview /go/{portal.slug} ↗
            </a>
          ) : null}
          <button type="button" className="dashboard-btn" onClick={() => onResetDefaults(channelKey)}>
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
              onChange={(e) => onUpdatePortal(channelKey, { enabled: e.target.checked })}
            />{" "}
            Portal enabled
          </span>
        </label>
        <label className="dashboard-field">
          <span>
            <input type="checkbox" checked={hidden.has(channelKey)} onChange={() => onToggleHidden(channelKey)} /> Hide
            from channel list (UI pref)
          </span>
        </label>
        <label className="dashboard-field">
          Public slug
          <input
            value={portal.slug || ""}
            onChange={(e) => onUpdatePortal(channelKey, { slug: e.target.value.trim().toLowerCase() })}
            placeholder="linkedin"
          />
        </label>
        <label className="dashboard-field">
          Headline
          <input value={portal.headline || ""} onChange={(e) => onUpdatePortal(channelKey, { headline: e.target.value })} />
        </label>
        <label className="dashboard-field">
          Subheadline
          <textarea
            rows={2}
            value={portal.subheadline || ""}
            onChange={(e) => onUpdatePortal(channelKey, { subheadline: e.target.value })}
          />
        </label>
        <label className="dashboard-field">
          CTA label
          <input value={portal.ctaLabel || ""} onChange={(e) => onUpdatePortal(channelKey, { ctaLabel: e.target.value })} />
        </label>
        <label className="dashboard-field">
          CTA URL (optional — blank uses Calendly popup)
          <input
            value={portal.ctaUrl || ""}
            onChange={(e) => onUpdatePortal(channelKey, { ctaUrl: e.target.value })}
            placeholder="https://calendly.com/..."
          />
        </label>
        <label className="dashboard-field">
          Trust bullets (one per line)
          <textarea
            rows={4}
            value={(portal.trustBullets || []).join("\n")}
            onChange={(e) =>
              onUpdatePortal(channelKey, {
                trustBullets: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
        <TierEditor tiers={portal.tiers || []} onChange={(tiers) => onUpdatePortal(channelKey, { tiers })} />
        <FaqEditor faq={portal.faq || []} onChange={(faq) => onUpdatePortal(channelKey, { faq })} />
      </div>
    </div>
  );
}

export function resetPortalDefaults(channelKey, updatePortal) {
  const pack = PORTAL_CONVERSION_PACKS[channelKey];
  const meta = CHANNEL_META[channelKey];
  if (!pack || !meta) return;
  updatePortal(channelKey, {
    headline: pack.headline,
    subheadline: pack.subheadline,
    ctaLabel: pack.ctaLabel,
    trustBullets: [...pack.trustBullets],
    tiers: pack.tiers.map((t) => ({ ...t })),
    faq: pack.faq.map((f) => ({ ...f })),
    slug: meta.defaultSlug,
  });
}
