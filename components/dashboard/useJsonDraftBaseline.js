"use client";

import { useEffect, useMemo, useState } from "react";

export function useJsonDraftBaseline(initialData) {
  const [baseline, setBaseline] = useState(() => JSON.stringify(initialData || {}));
  const [data, setData] = useState(initialData || {});

  const fingerprint = useMemo(() => JSON.stringify(data), [data]);
  const dirty = fingerprint !== baseline;

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setBaseline(JSON.stringify(initialData));
    }
  }, [initialData]);

  function markSaved(next) {
    const saved = next ?? data;
    setData(saved);
    setBaseline(JSON.stringify(saved));
  }

  return { data, setData, dirty, markSaved };
}
