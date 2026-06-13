"use client";

import { useEffect, useState } from "react";

export default function FaqDashboardPage() {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(null);

  function loadFaqs() {
    fetch("/api/dashboard/faq")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setFaqs(data.faqs || []);
      })
      .catch(() => setError("Failed to load FAQ"));
  }

  useEffect(loadFaqs, []);

  async function saveFaq(faq) {
    setError("");
    setSuccess("");
    const isNew = !faq.id;
    const url = isNew ? "/api/dashboard/faq" : `/api/dashboard/faq/${faq.id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faq),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }

    setSuccess("FAQ saved.");
    setEditing(null);
    loadFaqs();
  }

  async function deleteFaq(id) {
    if (!confirm("Delete this FAQ item?")) return;
    await fetch(`/api/dashboard/faq/${id}`, { method: "DELETE" });
    loadFaqs();
  }

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>FAQ</h1>
          <p>Manage FAQ items. Public /faq still reads lib/seo/faq-data.js until wired to DB.</p>
        </div>
        <button
          type="button"
          className="dashboard-btn dashboard-btn-primary"
          onClick={() => setEditing({ question: "", answer: "", sort_order: faqs.length, is_published: true })}
        >
          Add FAQ
        </button>
      </header>

      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}
      {success ? <div className="dashboard-alert dashboard-alert-success">{success}</div> : null}

      {editing ? (
        <div className="dashboard-card">
          <h2>{editing.id ? "Edit FAQ" : "New FAQ"}</h2>
          <form
            className="dashboard-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveFaq(editing);
            }}
          >
            <div className="dashboard-field">
              <label>Question</label>
              <input
                value={editing.question}
                onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                required
              />
            </div>
            <div className="dashboard-field">
              <label>Answer</label>
              <textarea
                value={editing.answer}
                onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                required
              />
            </div>
            <div className="dashboard-field-row">
              <div className="dashboard-field">
                <label>Sort order</label>
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                />
              </div>
              <label className="dashboard-checkbox" style={{ alignSelf: "end", paddingBottom: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                />
                Published
              </label>
            </div>
            <div className="dashboard-actions">
              <button type="submit" className="dashboard-btn dashboard-btn-primary">
                Save
              </button>
              <button type="button" className="dashboard-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="dashboard-card dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Order</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td>{faq.question}</td>
                <td>{faq.sort_order}</td>
                <td>{faq.is_published ? "Yes" : "No"}</td>
                <td>
                  <button type="button" className="dashboard-btn" onClick={() => setEditing(faq)}>
                    Edit
                  </button>{" "}
                  <button type="button" className="dashboard-btn dashboard-btn-danger" onClick={() => deleteFaq(faq.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
