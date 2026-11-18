import { apiFetch } from "./api";

export function fetchNotifications({ page = 1, token }) {
  return apiFetch(`/notifications?page=${page}`, { token });
}

export function makeNotificationsAsRead(id, { token }) {
  return apiFetch(`/notifications/${id}/read`, { method: "PATCH", token });
}

export function makeAllNotificationsAsRead({ token }) {
  return apiFetch("/notifications/read", { method: "POST", token });
}
