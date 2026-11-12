const ROUTES = {
  group_message: (data) => `/grupos/${data.group_id}`,
  payment_due: () => `/gastos`,
  event_reminder: () => `/eventos/`,
};

export function getNotificationText(notification) {
  const { type, data = {} } = notification;

  switch (type) {
    case "group_message":
      return {
        title: `Mensaje de ${data.from ?? "un miembro del grupo"}`,
        body: data.message,
        link: ROUTES.group_message(data),
      };
    case "payment_due":
      return {
        title: "Pago pendiente",
        body: "Tienes un pago pendiente",
        link: ROUTES.payment_due(),
      };
    case "event_reminder":
      return {
        title: "Recordatorio de evento",
        body: `Recordatorio: ${data.event_name}`,
        link: ROUTES.event_reminder(),
      };
    default:
      return {
        title: "Notificación desconocida",
        body: "No se reconoce el tipo de notificación",
      };
  }
}

export function getNotificationRoute(notification) {
  const build = ROUTES[notification.type];
  return build ? build(notification.data) : null;
}
