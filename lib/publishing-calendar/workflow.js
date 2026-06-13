import { WORKFLOW_STEPS } from "./types";

export function advanceWorkflowStep(current, target) {
  const cur = WORKFLOW_STEPS.indexOf(current);
  const next = WORKFLOW_STEPS.indexOf(target);
  if (next < 0) return current;
  if (cur < 0) return target;
  return next > cur ? target : current;
}

export function applyTimeDrivenWorkflow(task, now = new Date()) {
  const step = task.panel_state?.workflow_step || "Scheduled";
  if (step === "Posted" || step === "Completed" || step === "Missed") return step;

  const dateStr = task.publishing_date;
  const timeStr = task.scheduled_time || "23:59";
  const slot = new Date(`${dateStr}T${timeStr}:00`);
  if (Number.isNaN(slot.getTime())) return step;

  const msToSlot = slot.getTime() - now.getTime();
  if (msToSlot <= 0 && msToSlot > -2 * 60 * 60 * 1000 && step !== "Time to Post") {
    return "Time to Post";
  }
  if (msToSlot < -2 * 60 * 60 * 1000 && !task.published_url && step !== "Posted") {
    return "Missed";
  }
  return step;
}

export function tasksWithWorkflowRefresh(tasks) {
  return tasks.map((task) => {
    const workflow_step = applyTimeDrivenWorkflow(task);
    if (workflow_step === task.panel_state?.workflow_step) return task;
    return {
      ...task,
      panel_state: {
        ...task.panel_state,
        workflow_step,
        last_updated_at: new Date().toISOString(),
      },
    };
  });
}
