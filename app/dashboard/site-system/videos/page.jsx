"use client";

import { useEffect, useState } from "react";

export default function VideosDashboardPage() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/videos")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setVideos(data.videos || []);
      })
      .catch(() => setError("Failed to load videos"));
  }, []);

  async function togglePublish(video) {
    const res = await fetch("/api/dashboard/videos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: video.id, is_published: !video.is_published }),
    });
    const data = await res.json();
    if (data.video) {
      setVideos((prev) => prev.map((v) => (v.id === video.id ? data.video : v)));
    }
  }

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Site Videos</h1>
          <p>Homepage videos served from Supabase storage. Upload via npm run upload:videos.</p>
        </div>
      </header>

      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <div className="dashboard-card dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Title</th>
              <th>Page</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v.id}>
                <td>
                  <code style={{ fontSize: "0.75rem" }}>{v.video_key}</code>
                </td>
                <td>{v.title}</td>
                <td>{v.page}</td>
                <td>{v.is_published ? "Yes" : "No"}</td>
                <td>
                  <button type="button" className="dashboard-btn" onClick={() => togglePublish(v)}>
                    {v.is_published ? "Unpublish" : "Publish"}
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
