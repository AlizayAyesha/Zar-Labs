/** Fire-and-forget auth audit log from the browser. */
export function logAuthClient(eventType, email = null, metadata = {}) {
  fetch("/api/dashboard/auth/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, email, metadata }),
  }).catch(() => {});
}
