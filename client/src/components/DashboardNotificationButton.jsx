import BellIcon from "@/assets/icons/bell.svg";

export default function DashboardNotificationButton() {
  return (
    <button
      type="button"
      className="dashboard-notification-button"
      aria-label="Notificaciones"

    >
      <img src={BellIcon} alt="" />
    </button>
  );
}
