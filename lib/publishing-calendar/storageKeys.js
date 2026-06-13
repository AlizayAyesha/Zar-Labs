/** Per-user localStorage keys so subscribers don't share calendar cache */

export function calendarStorageKeys(ownerEmail) {
  const slug = (ownerEmail || "default").toLowerCase().replace(/[^a-z0-9@._-]/g, "_");
  return {
    tasks: `zar_cal_tasks_${slug}`,
    activity: `zar_cal_activity_${slug}`,
    updatedAt: `zar_cal_updated_${slug}`,
    schedulingConfig: `zar_cal_config_${slug}`,
    ownerEmail: `zar_cal_owner_${slug}`,
  };
}

/** @deprecated use calendarStorageKeys(email) */
export const LEGACY_STORAGE_KEYS = {
  tasks: "zar_publishing_calendar_tasks",
  activity: "zar_publishing_calendar_activity",
  updatedAt: "zar_publishing_calendar_updated_at",
  schedulingConfig: "zar_publishing_calendar_scheduling_config",
};
