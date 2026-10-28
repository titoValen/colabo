import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { usuario } = useAuth();

  return (
    <main className="dashboard-page">
      <h1>Dashboard</h1>
      <p>¡Todo listo{usuario?.name ? `, ${usuario.name}` : ""}!</p>
      <p>Tu espacio de Colabo ya está preparado.</p>
    </main>
  );
}
