import { apiFetch } from "./api";

export function fetchNotifications({ page = 1, token }) {
  return apiFetch(`/notifications?page=${page}`, { token });
}

export function makeNotificationsAsRead(id, { token }) {
  return apiFetch(`/notifications/${id}/read`, { method: "PATCH", token });
}

export function makeAllNotificationsAsRead({ token }) {
  return apiFetch("/notifications/read-all", { method: "POST", token });
}

export function sendPresenceHeartbeat({ token }) {
  return apiFetch("/presence/heartbeat", { method: "POST", token });
}

export function savePushSubscription(subscription, { token }) {
  return apiFetch("/push-subscriptions", {
    method: "POST",
    body: subscription.toJSON(),
    token,
  });
}

export function deletePushSubscription(endpoint, { token }) {
  return apiFetch("/push-subscriptions", {
    method: "DELETE",
    body: { endpoint },
    token,
  });
}
