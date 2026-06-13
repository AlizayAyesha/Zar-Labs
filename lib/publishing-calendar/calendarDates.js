export function startOfWeek(date, weekStartsOn = 1) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDaysDate(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function getWeekDates(anchorDate) {
  const start = startOfWeek(anchorDate);
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDaysDate(start, i);
    return { date: toISODate(d), label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) };
  });
}

export function isToday(isoDate) {
  return isoDate === toISODate(new Date());
}
