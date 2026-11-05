export default function DashboardStatEvents({ count, loading, error }) {
  let value = "—";
  let detail = "";

  if (error) {
    detail = "No se pudieron cargar los eventos";
  } else if (!loading) {
    value = count;
    detail = "esta semana";
  }

  return (
    <article className="dashboard-card dashboard-stat">
      <h2 className="dashboard-stat-title">Resumen</h2>
      <strong className="dashboard-stat-value">{value}</strong>
      <p className="dashboard-stat-detail">{detail}</p>
    </article>
  );
}
