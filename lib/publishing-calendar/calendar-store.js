import { getCmsCollection, saveCmsCollection } from "../cms/cms-store";
import { DEFAULT_TIMEZONE } from "../../constants/social/publishingBrands";

export function buildDefaultCalendarData() {
  return {
    tasks: [],
    activity: [],
    schedulingConfig: {
      timezone: DEFAULT_TIMEZONE,
      maxTasksPerDay: 6,
      leadTimeDays: 2,
      skipWeekends: false,
    },
    updatedAt: new Date().toISOString(),
  };
}

export async function getPublishingCalendarData(view = "draft") {
  const stored = await getCmsCollection("publishing-calendar", view);
  if (stored?.tasks) return { ...buildDefaultCalendarData(), ...stored };
  if (view === "draft") {
    const published = await getCmsCollection("publishing-calendar", "published");
    if (published?.tasks) return { ...buildDefaultCalendarData(), ...published };
  }
  return buildDefaultCalendarData();
}

export async function savePublishingCalendarData(view, data) {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  return saveCmsCollection("publishing-calendar", view, payload, {
    page: "social",
    section: "publishing-calendar",
  });
}
