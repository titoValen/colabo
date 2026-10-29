import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@components/dashboard/DashboardSidebar";
import "@/styles/dashboard.css";

export default function Dashboard() {
  const { usuario } = useAuth();

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-page">
        <h1>Dashboard</h1>
        <p>¡Todo listo{usuario?.name ? `, ${usuario.name}` : ""}!</p>
        <p>Tu espacio de Colabo ya está preparado.</p>
      </main>
    </div>
  );
}
