"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { AdminCmsDraftActions } from "../AdminCmsDraftActions";
import { AdminPublishStatusModal } from "../AdminPublishStatusModal";
import { useJsonDraftBaseline } from "../useJsonDraftBaseline";
import { WEBSITE_CMS_PATHS, PUBLIC_NEWSLETTER_PATHS } from "../../../constants/websiteCmsPaths";
import { upsertRegistryItem } from "../../../lib/newsletter/registry";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPTY_NEWSLETTER = {
  id: "",
  slug: "",
  title: "",
  summary: "",
  body: "",
  tags: [],
  communitySource: "",
  status: "draft",
  publishedAt: "",
  seoTitle: "",
  seoDescription: "",
  heroImage: "",
};

export function NewsletterPostEditor({ newsletterId, isNew = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!isNew);
  const [registry, setRegistry] = useState([]);
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [modal, setModal] = useState({ open: false, status: "loading", message: "" });
  const { data, setData, dirty, markSaved } = useJsonDraftBaseline(initial);

  useEffect(() => {
    fetch("/api/cms/website-data?view=draft")
      .then((r) => r.json())
      .then((json) => {
        const list = json.data?.newsletter_posts_registry || [];
        setRegistry(list);
        if (isNew) {
          setInitial({ ...EMPTY_NEWSLETTER, id: `newsletter-${Date.now()}` });
        } else {
          const found = list.find((row) => row.id === newsletterId || row.slug === newsletterId);
          setInitial(found || { ...EMPTY_NEWSLETTER, id: newsletterId });
        }
      })
      .finally(() => setLoading(false));
  }, [newsletterId, isNew]);

  function updateField(field, value) {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && (isNew || !prev.slug)) {
        next.slug = slugify(value);
      }
      if (field === "title" && !prev.seoTitle) {
        next.seoTitle = value ? `${value} | Zar Labs Newsletter` : "";
      }
      if (field === "summary" && !prev.seoDescription) {
        next.seoDescription = value;
      }
      return next;
    });
  }

  async function persist(intent) {
    const isPublish = intent === "publish";
    if (isPublish) setPublishing(true);
    else setSaving(true);

    setModal({ open: true, status: "loading", message: "" });

    const nextItem = {
      ...data,
      status: isPublish ? "published" : data.status || "draft",
      publishedAt: isPublish ? new Date().toISOString() : data.publishedAt,
    };

    const nextRegistry = upsertRegistryItem(registry, nextItem);

    const res = await fetch("/api/cms/website-data?view=draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsletter_posts_registry: nextRegistry, intent }),
    });
    const json = await res.json();

    if (!res.ok) {
      setModal({ open: true, status: "error", message: json.error || "Save failed" });
    } else {
      setRegistry(json.data?.newsletter_posts_registry || nextRegistry);
      const saved = json.data?.newsletter_posts_registry?.find(
        (row) => row.id === nextItem.id || row.slug === nextItem.slug
      );
      markSaved(saved || nextItem);
      setModal({
        open: true,
        status: "success",
        message: isPublish ? "Newsletter published to the live site." : "Newsletter draft saved.",
      });
      if (isNew && saved?.id) {
        router.replace(WEBSITE_CMS_PATHS.newsletter.edit(saved.id));
      }
    }

    setSaving(false);
    setPublishing(false);
  }

  if (loading) {
    return <p style={{ color: "#888" }}>Loading newsletter…</p>;
  }

  return (
    <AdminCmsEditorShell
      title={isNew ? "New newsletter" : "Edit newsletter"}
      description="Draft and publish newsletters — never labeled as blogs or articles on the public site."
      publicRoute={data.slug ? PUBLIC_NEWSLETTER_PATHS.detail(data.slug) : "/newsletter"}
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
      <form
        className="dashboard-form dashboard-card"
        onSubmit={(e) => {
          e.preventDefault();
          persist("saveDraft");
        }}
      >
        <div className="dashboard-field">
          <label>Newsletter title</label>
          <input value={data.title || ""} onChange={(e) => updateField("title", e.target.value)} required />
        </div>
        <div className="dashboard-field-row">
          <div className="dashboard-field">
            <label>Slug</label>
            <input value={data.slug || ""} onChange={(e) => updateField("slug", slugify(e.target.value))} required />
          </div>
          <div className="dashboard-field">
            <label>Hero image URL (optional)</label>
            <input value={data.heroImage || ""} onChange={(e) => updateField("heroImage", e.target.value)} />
          </div>
        </div>
        <div className="dashboard-field">
          <label>Summary</label>
          <textarea value={data.summary || ""} onChange={(e) => updateField("summary", e.target.value)} required />
        </div>
        <div className="dashboard-field">
          <label>Newsletter body</label>
          <textarea
            value={data.body || ""}
            onChange={(e) => updateField("body", e.target.value)}
            style={{ minHeight: "200px" }}
            required
          />
        </div>
        <div className="dashboard-field-row">
          <div className="dashboard-field">
            <label>Tags (comma-separated)</label>
            <input
              value={(data.tags || []).join(", ")}
              onChange={(e) =>
                updateField(
                  "tags",
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>
          <div className="dashboard-field">
            <label>Community source</label>
            <input
              value={data.communitySource || ""}
              onChange={(e) => updateField("communitySource", e.target.value)}
            />
          </div>
        </div>
        <div className="dashboard-field-row">
          <div className="dashboard-field">
            <label>SEO title</label>
            <input value={data.seoTitle || ""} onChange={(e) => updateField("seoTitle", e.target.value)} />
          </div>
          <div className="dashboard-field">
            <label>SEO description</label>
            <input
              value={data.seoDescription || ""}
              onChange={(e) => updateField("seoDescription", e.target.value)}
            />
          </div>
        </div>
        <div className="dashboard-actions">
          <Link href={WEBSITE_CMS_PATHS.newsletter.list} className="dashboard-btn">
            ← All newsletters
          </Link>
          {data.slug && data.status === "published" ? (
            <a
              href={PUBLIC_NEWSLETTER_PATHS.detail(data.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="dashboard-btn"
            >
              View live newsletter ↗
            </a>
          ) : null}
        </div>
      </form>

      <AdminPublishStatusModal
        open={modal.open}
        status={modal.status}
        message={modal.message}
        onClose={() => setModal({ open: false, status: "loading", message: "" })}
      />
    </AdminCmsEditorShell>
  );
}
