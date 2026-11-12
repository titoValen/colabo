import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useNotification from "../hooks/useNotifications.js";
import {
  getNotificationText,
  getNotificationRoute,
} from "@/utils/notificationstext";
import BellIcon from "@/assets/icons/bell.svg";

function formatRelative(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Hace unos segundos";
  if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DashboardNotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const {
    items,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handlekeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handlekeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handlekeyDown);
    };
  }, [isOpen]);

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
                    className={`dashboard-notifications-item${isUnread ? "is-unread" : ""}`}
                    onClick={() => handleItemClick(notification)}
                  >
                    <span className="dashboard-notifications-title">
                      {title}
                    </span>
                    {body && (
                      <span className="dashboard-notifications-body">
                        {body}
                      </span>
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
        </div>
      )}
    </div>
  );
}
