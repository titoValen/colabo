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
const SUMMARY_REFRESH_INTERVAL = 30_000;

export default function Dashboard() {
  const { token, user } = useAuth();

  // Resumen: números que calcula el servidor.
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  // Lista de próximos eventos: sigue saliendo de /events.
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState("");

  useEffect(() => {
    let active = true;

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

  useEffect(() => {
    let active = true;
    let requestInFlight = false;

    const refreshSummary = () => {
      if (!active || requestInFlight) return;

      requestInFlight = true;
      setNow(Date.now());
      fetchDashboardSummary({ token })
        .then((data) => {
          if (active) {
            setSummary(data);
            setSummaryError("");
          }
        })
        .catch((error) => {
          if (active) setSummaryError(error.message);
        })
        .finally(() => {
          requestInFlight = false;
          if (active) setLoadingSummary(false);
        });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refreshSummary();
    };

    refreshSummary();
    const interval = window.setInterval(refreshSummary, SUMMARY_REFRESH_INTERVAL);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token]);

  useEffect(() => {
    let active = true;

    apiFetch("/groups", { token })
      .then((data) => {
        if (active) setGroups(data);
      })
      .catch((error) => {
        if (active) setGroupsError(error.message);
      })
      .finally(() => {
        if (active) setLoadingGroups(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  // La lista muestra solo eventos futuros, sin contar nada acá.
  const upcomingEvents = events
    .filter((event) => new Date(event.starts_at).getTime() >= now)
    .slice(0, VISIBLE_EVENTS_COUNT);

  return (
    <AppLayout>
      <header className="dashboard-header">
        <div>
          <h1>Hola{user?.name ? `, ${user.name}` : ""}</h1>
          <p>Organiza, comparte y haz que las cosas pasen.</p>
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
          <DashboardGroups
            groups={groups}
            onDelete={(groupId) =>
              setGroups((current) => current.filter((group) => group.id !== groupId))
            }
            loading={loadingGroups}
            error={groupsError}
          />
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
