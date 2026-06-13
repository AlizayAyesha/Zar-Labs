"use client";

export function AdminCmsFilterToolbar({ search, onSearchChange, placeholder = "Search…", children }) {
  return (
    <div className="admin-cms-filter-toolbar">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="admin-cms-search"
      />
      {children}
    </div>
  );
}
