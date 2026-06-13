"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { calendarStorageKeys, LEGACY_STORAGE_KEYS } from "../lib/publishing-calendar/storageKeys";
import { createTaskFromPlanRow } from "../lib/publishing-calendar/taskFactory";
import { detectConflicts, detectImportConflicts } from "../lib/publishing-calendar/scheduling/conflictDetection";
import { tasksWithWorkflowRefresh } from "../lib/publishing-calendar/workflow";

const SYNC_DEBOUNCE_MS = 1200;

function readLocal(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function usePublishingCalendar() {
  const [tasks, setTasks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [schedulingConfig, setSchedulingConfig] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [syncWarning, setSyncWarning] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState(null);
  const syncTimer = useRef(null);
  const tasksRef = useRef(tasks);
  const activityRef = useRef(activity);
  const configRef = useRef(schedulingConfig);
  const keysRef = useRef(LEGACY_STORAGE_KEYS);

  tasksRef.current = tasks;
  activityRef.current = activity;
  configRef.current = schedulingConfig;

  const logActivity = useCallback((action, taskId) => {
    const item = {
      id: `act-${Date.now()}`,
      action,
      task_id: taskId,
      created_at: new Date().toISOString(),
    };
    setActivity((prev) => [item, ...prev].slice(0, 50));
    return item;
  }, []);

  const persistToApi = useCallback(async (snapshot) => {
    setSyncing(true);
    try {
      const res = await fetch("/api/publishing-calendar-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      if (!res.ok) {
        const json = await res.json();
        setSyncWarning(json.error || "API sync failed — saved locally.");
      } else {
        setSyncWarning("");
        writeLocal(keysRef.current.updatedAt, snapshot.updatedAt);
      }
    } catch {
      setSyncWarning("Offline — changes saved locally only.");
    } finally {
      setSyncing(false);
    }
  }, []);

  const scheduleSync = useCallback(
    (nextTasks, nextActivity, nextConfig) => {
      const snapshot = {
        tasks: nextTasks,
        activity: nextActivity,
        schedulingConfig: nextConfig,
        updatedAt: new Date().toISOString(),
      };
      const keys = keysRef.current;
      writeLocal(keys.tasks, nextTasks);
      writeLocal(keys.activity, nextActivity);
      writeLocal(keys.schedulingConfig, nextConfig);
      writeLocal(keys.updatedAt, snapshot.updatedAt);

      if (syncTimer.current) clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => persistToApi(snapshot), SYNC_DEBOUNCE_MS);
    },
    [persistToApi]
  );

  const applySnapshot = useCallback((snapshot) => {
    const refreshed = tasksWithWorkflowRefresh(snapshot.tasks || []);
    setTasks(refreshed);
    setActivity(snapshot.activity || []);
    setSchedulingConfig(snapshot.schedulingConfig || {});
    const keys = keysRef.current;
    writeLocal(keys.tasks, refreshed);
    writeLocal(keys.activity, snapshot.activity || []);
    writeLocal(keys.schedulingConfig, snapshot.schedulingConfig || {});
  }, []);

  useEffect(() => {
    async function init() {
      let apiData = null;
      let resolvedOwner = null;

      try {
        const res = await fetch("/api/publishing-calendar-data?view=draft");
        if (res.ok) {
          const json = await res.json();
          apiData = json.data;
          resolvedOwner = json.ownerEmail || null;
        }
      } catch {
        /* local only */
      }

      if (resolvedOwner) {
        setOwnerEmail(resolvedOwner);
        keysRef.current = calendarStorageKeys(resolvedOwner);
      }

      const keys = keysRef.current;
      const localTasks = readLocal(keys.tasks, []);
      const localActivity = readLocal(keys.activity, []);
      const localConfig = readLocal(keys.schedulingConfig, {});
      const localUpdated = readLocal(keys.updatedAt, "");

      if (apiData?.updatedAt && (!localUpdated || apiData.updatedAt >= localUpdated)) {
        applySnapshot(apiData);
      } else if (localTasks.length) {
        applySnapshot({ tasks: localTasks, activity: localActivity, schedulingConfig: localConfig });
      } else if (apiData) {
        applySnapshot(apiData);
      }

      setHydrated(true);
    }
    init();
  }, [applySnapshot]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) => tasksWithWorkflowRefresh(prev));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const mutate = useCallback(
    (updater, action, taskId) => {
      setTasks((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const nextActivity = action
          ? [logActivity(action, taskId), ...activityRef.current].slice(0, 50)
          : activityRef.current;
        if (action) setActivity(nextActivity);
        scheduleSync(next, nextActivity, configRef.current);
        return next;
      });
    },
    [logActivity, scheduleSync]
  );

  const updateTask = useCallback(
    (id, patch) => {
      mutate(
        (prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        "Updated task",
        id
      );
    },
    [mutate]
  );

  const updatePanelState = useCallback(
    (id, panelPatch) => {
      mutate(
        (prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  panel_state: {
                    ...t.panel_state,
                    ...panelPatch,
                    last_updated_at: new Date().toISOString(),
                  },
                }
              : t
          ),
        "Updated panel",
        id
      );
    },
    [mutate]
  );

  const deleteTask = useCallback(
    (id) => {
      mutate(
        (prev) => prev.filter((t) => t.id !== id),
        "Deleted task",
        id
      );
    },
    [mutate]
  );

  const duplicateTask = useCallback(
    (id) => {
      mutate((prev) => {
        const source = prev.find((t) => t.id === id);
        if (!source) return prev;
        const copy = {
          ...source,
          id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          created_at: new Date().toISOString(),
          published_url: undefined,
          panel_state: { ...source.panel_state, workflow_step: "Scheduled" },
        };
        return [...prev, copy];
      }, "Duplicated task", id);
    },
    [mutate]
  );

  const rescheduleTask = useCallback(
    (id, { publishing_date, generation_slot_date }) => {
      const task = tasksRef.current.find((t) => t.id === id);
      if (!task) return { ok: false };
      const updated = {
        ...task,
        publishing_date: publishing_date || task.publishing_date,
        generation_slot_date: generation_slot_date || task.generation_slot_date,
      };
      const conflicts = detectConflicts(
        tasksRef.current.filter((t) => t.id !== id),
        updated
      );
      updateTask(id, {
        publishing_date: updated.publishing_date,
        generation_slot_date: updated.generation_slot_date,
      });
      return { ok: true, conflicts };
    },
    [updateTask]
  );

  const importPreviewRows = useCallback(
    (rows, { brandId, generationStartDate, publishingStartDate, meta }) => {
      const newTasks = rows.map((row) =>
        createTaskFromPlanRow(row, { brandId, generationStartDate, publishingStartDate, meta })
      );
      const issues = detectImportConflicts(tasksRef.current, newTasks);
      mutate((prev) => [...prev, ...newTasks], `Imported ${newTasks.length} tasks`);
      return { imported: newTasks.length, issues };
    },
    [mutate]
  );

  const persistNow = useCallback(async () => {
    const snapshot = {
      tasks: tasksRef.current,
      activity: activityRef.current,
      schedulingConfig: configRef.current,
      updatedAt: new Date().toISOString(),
    };
    await persistToApi(snapshot);
  }, [persistToApi]);

  const exportBackup = useCallback(() => {
    return JSON.stringify(
      { tasks: tasksRef.current, activity: activityRef.current, schedulingConfig: configRef.current },
      null,
      2
    );
  }, []);

  const importBackup = useCallback(
    (jsonString) => {
      const data = JSON.parse(jsonString);
      applySnapshot(data);
      scheduleSync(data.tasks || [], data.activity || [], data.schedulingConfig || {});
    },
    [applySnapshot, scheduleSync]
  );

  return {
    tasks,
    activity,
    schedulingConfig,
    hydrated,
    syncWarning,
    syncing,
    ownerEmail,
    setSchedulingConfig: (cfg) => {
      setSchedulingConfig(cfg);
      scheduleSync(tasksRef.current, activityRef.current, cfg);
    },
    updateTask,
    updatePanelState,
    deleteTask,
    duplicateTask,
    rescheduleTask,
    importPreviewRows,
    persistNow,
    exportBackup,
    importBackup,
    detectConflicts: (candidate) => detectConflicts(tasksRef.current, candidate),
  };
}
