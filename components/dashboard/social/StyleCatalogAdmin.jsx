"use client";

import { useCallback, useEffect, useState } from "react";

export function StyleCatalogAdmin() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    category: "trending",
    preview_url: "",
    prompt: "",
    status: "draft",
    trending_score: 50,
    requires_face: true,
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/social-engine/style-catalog?admin=1");
    const json = await res.json();
    if (res.ok) setItems(json.items || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    const res = await fetch("/api/social-engine/style-catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Save failed");
      return;
    }
    setNotice(`Saved ${json.item?.title}`);
    setForm({
      slug: "",
      title: "",
      description: "",
      category: "trending",
      preview_url: "",
      prompt: "",
      status: "draft",
      trending_score: 50,
      requires_face: true,
    });
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this style?")) return;
    await fetch("/api/social-engine/style-catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    load();
  }

  return (
    <div className="dashboard-card">
      <h2>Style catalog (admin)</h2>
      <p className="admin-cms-placeholder">
        Add trending looks with hidden prompts. Users pick a style + upload photo — no prompts. Scale to 1000+ entries via
        bulk import later.
      </p>
      {notice ? <div className="dashboard-alert dashboard-alert-success">{notice}</div> : null}
      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <form className="dashboard-form" onSubmit={save}>
        <label className="dashboard-field">
          Slug
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </label>
        <label className="dashboard-field">
          Title
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="dashboard-field">
          Description
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label className="dashboard-field">
          Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="trending">Trending</option>
            <option value="headshot">Headshot</option>
            <option value="marketing">Marketing</option>
          </select>
        </label>
        <label className="dashboard-field">
          Preview image URL
          <input required value={form.preview_url} onChange={(e) => setForm({ ...form, preview_url: e.target.value })} />
        </label>
        <label className="dashboard-field">
          Hidden prompt (users never see this)
          <textarea
            required
            rows={4}
            value={form.prompt}
            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
          />
        </label>
        <label className="dashboard-field">
          Status
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <button type="submit" className="dashboard-btn dashboard-btn-primary">
          Save style
        </button>
      </form>

      {items.length ? (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Uses</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.status}</td>
                <td>{item.usage_count}</td>
                <td>
                  <button type="button" className="dashboard-btn dashboard-btn-danger" onClick={() => remove(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
