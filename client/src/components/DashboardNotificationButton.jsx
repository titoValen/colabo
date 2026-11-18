import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import BellIcon from "@/assets/icons/bell.svg";
import useNotifications from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { savePushSubscription } from "@/services/notifications";
import {
  isPushSupported,
  subscribeToPush,
  getCurrentPushSubscription,
} from "@/services/pushSubscription";
import {
  getNotificationText,
  getNotificationRoute,
} from "@/utils/notificationText";

function formatRelative(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

export default function DashboardNotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  // Estado real del navegador: "unsupported" | "denied" | "default" | "enabled"
  const [pushStatus, setPushStatus] = useState("default");

  const {
    items,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications({
    onNewNotifications: (fresh) => {
      fresh.forEach((notification) => {
        const { title, body } = getNotificationText(notification);
        toast(body ? `${title}: ${body}` : title, {
          id: `notification-${notification.id}`,
          icon: "🔔",
        });
      });
    },
  });

  useEffect(() => {
    let active = true;

    async function checkPushStatus() {
      if (!isPushSupported()) {
        if (active) setPushStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        if (active) setPushStatus("denied");
        return;
      }
      const subscription = await getCurrentPushSubscription();
      if (active) setPushStatus(subscription ? "enabled" : "default");
    }

    checkPushStatus();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  async function enablePush() {
    const permission = await Notification.requestPermission();
    if (permission === "denied") {
      setPushStatus("denied");
      return;
    }
    if (permission !== "granted") return;

    const subscription = await subscribeToPush();
    await savePushSubscription(subscription, { token });
    setPushStatus("enabled");
    toast.success("Avisos del sistema activados");
  }

  function handleItemClick(notification) {
    if (!notification.read_at) markAsRead(notification.id);
    const route = getNotificationRoute(notification);
    if (route) {
      setIsOpen(false);
      navigate(route);
    }
  }

  return (
    <div className="dashboard-notifications" ref={containerRef}>
      <button
        type="button"
        className="dashboard-notification-button"
        aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ""}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <img src={BellIcon} alt="" />
        {unreadCount > 0 && (
          <span className="dashboard-notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="dashboard-notifications-panel"
          role="dialog"
          aria-label="Notificaciones"
        >
          <header className="dashboard-notifications-header">
            <h2>Notificaciones</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                className="dashboard-notifications-action"
                onClick={markAllAsRead}
              >
                Marcar todas como leídas
              </button>
            )}
          </header>

          {error && (
            <p className="dashboard-notifications-error" role="alert">
              {error}
            </p>
          )}

          {!loading && items.length === 0 && (
            <p className="dashboard-notifications-empty">
              No tienes notificaciones.
            </p>
          )}

          <ul className="dashboard-notifications-list">
            {items.map((notification) => {
              const { title, body } = getNotificationText(notification);
              const isUnread = !notification.read_at;
              return (
                <li key={notification.id}>
                  <button
                    type="button"
                    className={`dashboard-notifications-item${isUnread ? " is-unread" : ""}`}
                    onClick={() => handleItemClick(notification)}
                  >
                    <span className="dashboard-notifications-title">{title}</span>
                    {body && (
                      <span className="dashboard-notifications-body">{body}</span>
                    )}
                    <span className="dashboard-notifications-time">
                      {formatRelative(notification.created_at)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <button
              type="button"
              className="dashboard-notifications-more"
              onClick={loadMore}
            >
              Cargar más
            </button>
          )}

          {pushStatus === "default" && (
            <button
              type="button"
              className="dashboard-notifications-more"
              onClick={enablePush}
            >
              Activar avisos del sistema
            </button>
          )}

          {pushStatus === "denied" && (
            <p className="dashboard-notifications-empty">
              Los avisos están bloqueados en este navegador. Podés habilitarlos
              desde la configuración del sitio.
            </p>
          )}
        </div>
      )}
    </div>
  );
}