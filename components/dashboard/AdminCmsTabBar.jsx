"use client";

import { useState } from "react";

export function AdminCmsTabBar({ tabs, activeId, onChange }) {
  return (
    <div className="admin-cms-tab-bar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeId === tab.id}
          className={`admin-cms-tab${activeId === tab.id ? " is-active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AdminCmsTabPanel({ id, activeId, children }) {
  if (id !== activeId) return null;
  return (
    <div className="admin-cms-tab-panel" role="tabpanel">
      {children}
    </div>
  );
}
