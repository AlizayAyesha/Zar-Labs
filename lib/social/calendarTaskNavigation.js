import { LEGACY_STORAGE_KEYS } from "../publishing-calendar/storageKeys";

const STUDIO_TASK_KEY = "zar_studio_active_task";

export function stashTaskForStudio(task) {
  if (typeof window === "undefined" || !task?.id) return;
  sessionStorage.setItem(STUDIO_TASK_KEY, JSON.stringify(task));
}

export function readStashedStudioTask() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STUDIO_TASK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readTasksFromLocalStorage() {
  if (typeof window === "undefined") return [];
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEYS.tasks);
    if (legacy) {
      const tasks = JSON.parse(legacy);
      if (Array.isArray(tasks) && tasks.length) return tasks;
    }
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith("zar_cal_tasks_")) {
        const tasks = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(tasks) && tasks.length) return tasks;
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function readCalendarTaskById(taskId) {
  if (typeof window === "undefined" || !taskId) return null;
  const tasks = readTasksFromLocalStorage();
  return tasks.find((t) => t.id === taskId) || null;
}

export async function fetchCalendarTaskById(taskId) {
  try {
    const res = await fetch("/api/publishing-calendar-data?view=draft");
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.tasks?.find((t) => t.id === taskId) || null;
  } catch {
    return null;
  }
}

export function resolveStudioTask(taskId) {
  if (taskId) {
    const fromCalendar = readCalendarTaskById(taskId);
    if (fromCalendar) return fromCalendar;
  }
  return readStashedStudioTask();
}

export function strategyChatPathForTask(task) {
  stashTaskForStudio(task);
  return `/dashboard/site-system/social-engine/strategy-chat?taskId=${encodeURIComponent(task.id)}`;
}

export function imageStudioPathForTask(task) {
  return strategyChatPathForTask(task);
}
