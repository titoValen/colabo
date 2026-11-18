import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

function getPushPayload(event) {
  if (!event.data) return {};

  try {
    const payload = event.data.json();
    return payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : {};
  } catch {
    return {};
  }
}

self.addEventListener("push", (event) => {
  const payload = getPushPayload(event);
  const title =
    typeof payload.title === "string" && payload.title ? payload.title : "Colabo";
  const body = typeof payload.body === "string" ? payload.body : "";
  const icon = typeof payload.icon === "string" ? payload.icon : undefined;
  const badge =
    typeof payload.badge === "string" ? payload.badge : icon;
  const tag = typeof payload.tag === "string" ? payload.tag : undefined;
  const url =
    typeof payload.data?.url === "string" ? payload.data.url : "/dashboard";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag,
      data: { url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const existing = clientList.find((client) => "focus" in client);
        if (existing) {
          existing.navigate(url);
          return existing.focus();
        }
        return self.clients.openWindow(url);
      }),
  );
});
