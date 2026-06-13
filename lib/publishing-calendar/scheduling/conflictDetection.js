export function detectConflicts(tasks, candidateTask) {
  const warnings = [];
  const critical = [];

  const sameDay = tasks.filter(
    (t) =>
      t.id !== candidateTask.id &&
      (t.publishing_date === candidateTask.publishing_date ||
        t.generation_slot_date === candidateTask.generation_slot_date)
  );

  const sameBrandChannel = sameDay.filter(
    (t) => t.brand_id === candidateTask.brand_id && t.channel === candidateTask.channel
  );
  if (sameBrandChannel.length) {
    warnings.push(`Same brand (${candidateTask.brand_shortcut}) and channel on this date.`);
  }

  const dayCount = tasks.filter(
    (t) => t.id !== candidateTask.id && t.publishing_date === candidateTask.publishing_date
  ).length;
  if (dayCount >= 6) {
    warnings.push("Publishing day at capacity (6+ tasks).");
  }

  const duplicate = tasks.find(
    (t) =>
      t.id !== candidateTask.id &&
      t.publishing_date === candidateTask.publishing_date &&
      t.channel === candidateTask.channel &&
      t.brand_id === candidateTask.brand_id
  );
  if (duplicate) {
    critical.push("Duplicate: same brand, channel, and publishing date.");
  }

  return { warnings, critical, hasCritical: critical.length > 0 };
}

export function detectImportConflicts(existingTasks, newTasks) {
  const all = [...existingTasks];
  const issues = [];
  for (const task of newTasks) {
    const result = detectConflicts(all, task);
    if (result.hasCritical || result.warnings.length) {
      issues.push({ task, ...result });
    }
    all.push(task);
  }
  return issues;
}
