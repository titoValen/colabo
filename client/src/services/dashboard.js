import { apiFetch } from "./api";

export function fetchDashboardSummary({ token }) {
  return apiFetch("/dashboard/summary", { token });
}
