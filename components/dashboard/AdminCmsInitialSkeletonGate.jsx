"use client";

export function AdminCmsInitialSkeletonGate({ loading, variant = "cards", children }) {
  if (!loading) return children;

  if (variant === "table") {
    return (
      <div className="admin-cms-skeleton admin-cms-skeleton-table">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="admin-cms-skeleton-row" />
        ))}
      </div>
    );
  }

  return (
    <div className="admin-cms-skeleton admin-cms-skeleton-cards">
      {[1, 2, 3].map((i) => (
        <div key={i} className="admin-cms-skeleton-card" />
      ))}
    </div>
  );
}
