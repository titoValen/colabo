import IconGroups from "@/assets/icons/groups.svg";
import IconPending from "@/assets/icons/pending.svg";
import IconEvent from "@/assets/icons/events-summary.svg";
import IconTasks from "@/assets/icons/tasks-summary.svg";

export default function DashboardSummaryCards({ summary, loading, error }) {
  const show = (value) => (loading || error || value == null ? "—" : value);

  const completed = summary?.commitments?.completed;
  const onTime = summary?.commitments?.on_time;
  const total = summary?.commitments?.total;

  const commitmentValue = loading || error || completed == null ? "—" : completed;
  const commitmentDetail =
    loading || error || total == null || total === 0
      ? "Sin compromisos en 30 días"
      : `${onTime} a tiempo de ${completed} cumplidos`;

  const cards = [
    {
      title: "Mis grupos",
      value: show(summary?.groups?.total),
      detail: loading || error ? "" : `${summary?.groups?.active ?? 0} tienen tareas pendientes`,
      icon: IconGroups,
      alt: "Icono de equipo",
    },
    {
      title: "Tareas pendientes",
      value: show(summary?.pending_tasks),
      detail: "en todos mis grupos",
      icon: IconPending,
      alt: "Icono de tarea pendiente",
    },
    {
      title: "Próximos eventos",
      value: show(summary?.upcoming_events),
      detail: "esta semana",
      icon: IconEvent,
      alt: "Icono de evento",
    },
    {
      title: "Compromisos cumplidos",
      value: commitmentValue,
      detail: commitmentDetail,
      icon: IconTasks,
      alt: "Icono de compromisos cumplidos",
    },
  ];

  return (
    <section className="dashboard-summary-grid">
      {error && (
        <p className="dashboard-summary-error" role="alert">
          No se pudo cargar el resumen.
        </p>
      )}
      {cards.map((card) => (
        <article key={card.title} className="dashboard-summary-card">
          <figure className="dashboard-summary-figure">
            <img className="dashboard-summary-image" src={card.icon} alt={card.alt} />
          </figure>
          <h2 className="dashboard-summary-card-title">{card.title}</h2>
          <strong className="dashboard-summary-card-value">{card.value}</strong>
          <p className="dashboard-summary-card-detail">{card.detail}</p>
        </article>
      ))}
    </section>
  );
}
