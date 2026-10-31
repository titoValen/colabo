import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import AppLayout from "@components/AppLayout";
import DashboardGroups from "@components/DashboardGroups";
import DashboardNotificationButton from "@components/DashboardNotificationButton";
import DashboardSearchBar from "@components/DashboardSearchBar";
import DashboardUserMenu from "@components/DashboardUserMenu";
import DashboardNewGroup from "@components/DashboardNewGroup";
import DashboardRecentActivity from "@components/DashboardRecentActivity";
import DashboardStatEvents from "@components/DashboardStatEvents";
import DashboardUpcomingEvents from "@components/DashboardUpcomingEvents";
import "@/styles/dashboard.css";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const VISIBLE_EVENTS_COUNT = 3;

export default function Dashboard() {
  const { token, usuario: user } = useAuth();
  const [now] = useState(() => Date.now());
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");

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

  const upcomingEvents = events
    .filter((event) => new Date(event.starts_at).getTime() >= now)
    .slice(0, VISIBLE_EVENTS_COUNT);

  const eventsThisWeek = events.filter((event) => {
    const start = new Date(event.starts_at).getTime();
    return start >= now && start <= now + WEEK_MS;
  }).length;

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
        <section className="dashboard-summary">
          <DashboardStatEvents
            count={eventsThisWeek}
            loading={loadingEvents}
            error={eventsError}
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
