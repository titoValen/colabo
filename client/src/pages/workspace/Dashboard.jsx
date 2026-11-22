import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import { fetchDashboardSummary } from "@/services/dashboard";
import AppLayout from "@components/layout/AppLayout";
import DashboardGroups from "@components/dashboard/DashboardGroups";
import DashboardNotificationButton from "@components/dashboard/DashboardNotificationButton";
import DashboardSearchBar from "@components/dashboard/DashboardSearchBar";
import DashboardUserMenu from "@components/dashboard/DashboardUserMenu";
import DashboardNewGroup from "@components/dashboard/DashboardNewGroup";
import DashboardRecentActivity from "@components/dashboard/DashboardRecentActivity";
import DashboardSummaryCards from "@components/dashboard/DashboardSummaryCards";
import DashboardUpcomingEvents from "@components/dashboard/DashboardUpcomingEvents";
import "@/styles/dashboard/dashboard.css";
import "@/styles/dashboard/summary/index.css";

const VISIBLE_EVENTS_COUNT = 3;

export default function Dashboard() {
  const { token, user } = useAuth();

  // Resumen: números que calcula el servidor.
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  // Lista de próximos eventos: sigue saliendo de /events.
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");

  useEffect(() => {
    let active = true;

    fetchDashboardSummary({ token })
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch((error) => {
        if (active) setSummaryError(error.message);
      })
      .finally(() => {
        if (active) setLoadingSummary(false);
      });

    apiFetch("/events", { token })
      .then((data) => {
        if (active) setEvents(data);
      })
      .catch((error) => {
        if (active) setEventsError(error.message);
      })
      .finally(() => {
        if (active) setLoadingEvents(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  // La lista muestra solo eventos futuros, sin contar nada acá.
  const now = Date.now();
  const upcomingEvents = events
    .filter((event) => new Date(event.starts_at).getTime() >= now)
    .slice(0, VISIBLE_EVENTS_COUNT);

  return (
    <AppLayout>
      <header className="dashboard-header">
        <div>
          <h1>Hola{user?.name ? `, ${user.name}` : ""}</h1>
          <p>Organizá, compartí y hacé que las cosas pasen.</p>
        </div>

        <div className="dashboard-header-actions">
          <DashboardSearchBar />
          <DashboardNotificationButton />
          <DashboardUserMenu />
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-summary-section">
          <DashboardSummaryCards
            summary={summary}
            loading={loadingSummary}
            error={summaryError}
          />
          <DashboardGroups />
          <DashboardRecentActivity />
        </section>

        <aside className="dashboard-aside">
          <DashboardUpcomingEvents
            events={upcomingEvents}
            loading={loadingEvents}
            error={eventsError}
          />
          <DashboardNewGroup />
        </aside>
      </div>
    </AppLayout>
  );
}
