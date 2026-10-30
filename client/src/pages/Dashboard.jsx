import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import AppLayout from "@components/AppLayout";
import DashboardStatEvents from "@components/DashboardStatEvents";
import DashboardUpcomingEvents from "@components/DashboardUpcomingEvents";
import "@/styles/dashboard.css";

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

  return (
    <AppLayout>
      <header className="dashboard-header">
        <h1>Hola{user?.name ? `, ${user.name}` : ""}</h1>
        <p>Organizá, compartí y hacé que las cosas pasen.</p>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-summary">
          <DashboardStatEvents
            events={events}
            loading={loadingEvents}
            error={eventsError}
            now={now}
          />
        </section>

        <aside className="dashboard-aside">
          <DashboardUpcomingEvents
            events={events}
            loading={loadingEvents}
            error={eventsError}
            now={now}
          />
        </aside>
      </div>
    </AppLayout>
  );
}
