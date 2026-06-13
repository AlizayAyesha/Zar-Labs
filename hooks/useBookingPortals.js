"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildDefaultBookingPortalsData } from "../lib/booking/portals-defaults";

export function useBookingPortals() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(() => buildDefaultBookingPortalsData());
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
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

  async function persist(intent) {
    const res = await fetch("/api/booking-crm/portals?view=draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, intent }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Save failed");
    const saved = json.data || data;
    setData(saved);
    baselineRef.current = JSON.stringify(saved);
    setDirty(false);
    return saved;
  }

  return {
    loading,
    data,
    dirty,
    error,
    loadPortals,
    updatePortal,
    toggleHidden,
    persist,
    hidden: new Set(data.uiPrefs?.hiddenChannels || []),
  };
}
