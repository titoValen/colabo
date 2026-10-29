import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import DashboardSidebar from "@components/dashboard/DashboardSidebar";
import DashboardStatEvents from "@components/dashboard/DashboardStatEvents";
import DashboardUpcomingEvents from "@components/dashboard/DashboardUpcomingEvents";
import "@/styles/dashboard.css";

export default function Dashboard() {
  const { token, usuario } = useAuth();
  const [ahora] = useState(() => Date.now());
  const [eventos, setEventos] = useState([]);
  const [cargandoEventos, setCargandoEventos] = useState(true);
  const [errorEventos, setErrorEventos] = useState("");

  useEffect(() => {
    let activo = true;

    apiFetch("/events", { token })
      .then((data) => {
        if (activo) setEventos(data);
      })
      .catch((error) => {
        if (activo) setErrorEventos(error.message);
      })
      .finally(() => {
        if (activo) setCargandoEventos(false);
      });

    return () => {
      activo = false;
    };
  }, [token]);

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-page">
        <header className="dashboard-header">
          <h1>Hola{usuario?.name ? `, ${usuario.name}` : ""}</h1>
          <p>Organizá, compartí y hacé que las cosas pasen.</p>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-summary">
            <DashboardStatEvents
              eventos={eventos}
              cargando={cargandoEventos}
              error={errorEventos}
              ahora={ahora}
            />
          </section>

          <aside className="dashboard-aside">
            <DashboardUpcomingEvents
              eventos={eventos}
              cargando={cargandoEventos}
              error={errorEventos}
              ahora={ahora}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
