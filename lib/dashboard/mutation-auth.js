import { getDashboardUser } from "./auth";

export async function requireDashboardMutationAuth() {
  const user = await getDashboardUser();
  if (!user) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return user;
}
