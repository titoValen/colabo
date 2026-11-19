function formatDay(date) {
  const weekday = date
    .toLocaleDateString("es-AR", { weekday: "short" })
    .replace(".", "")
    .toUpperCase();
  const month = date
    .toLocaleDateString("es-AR", { month: "short" })
    .replace(".", "");

  return { weekday, dayNumber: date.getDate(), month };
}

function formatTime(date) {
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export default function DashboardUpcomingEvents({ events, loading, error }) {
  let content;

  if (loading) {
    content = <p className="dashboard-card-message">Cargando eventos...</p>;
  } else if (error) {
    content = (
      <p className="dashboard-card-message">
        No se pudieron cargar los eventos.
      </p>
    );
  } else if (events.length === 0) {
    content = (
      <p className="dashboard-card-message">No tenés eventos próximos.</p>
    );
  } else {
    content = (
      <ul className="dashboard-event-list">
        {events.map((event) => {
          const date = new Date(event.starts_at);
          const { weekday, dayNumber, month } = formatDay(date);

          return (
            <li key={event.id} className="dashboard-event">
              <div className="dashboard-event-date">
                <span>{weekday}</span>
                <strong>{dayNumber}</strong>
                <span>{month}</span>
              </div>
              <div className="dashboard-event-info">
                <p className="dashboard-event-title">{event.title}</p>
                <p className="dashboard-event-meta">
                  {formatTime(date)}
                  {event.group?.name ? ` · ${event.group.name}` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className="dashboard-card">
      <h2 className="dashboard-card-title">Próximos eventos</h2>
      {content}
    </section>
  );
}
