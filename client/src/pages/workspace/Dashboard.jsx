import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import AppLayout from "@components/layout/AppLayout";
import DashboardGroups from "@components/dashboard/DashboardGroups";
import DashboardNotificationButton from "@components/dashboard/DashboardNotificationButton";
import DashboardSearchBar from "@components/dashboard/DashboardSearchBar";
import DashboardUserMenu from "@components/dashboard/DashboardUserMenu";
import DashboardNewGroup from "@components/dashboard/DashboardNewGroup";
import DashboardRecentActivity from "@components/dashboard/DashboardRecentActivity";
import DashboardStatEvents from "@components/dashboard/DashboardStatEvents";
import DashboardUpcomingEvents from "@components/dashboard/DashboardUpcomingEvents";
import "@/styles/dashboard/dashboard.css";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const VISIBLE_EVENTS_COUNT = 3;

export default function Dashboard() {
  const { token, user } = useAuth();
  const [now] = useState(() => Date.now());
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
