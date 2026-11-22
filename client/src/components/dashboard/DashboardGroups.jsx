import { Link } from "react-router";
import GroupCard from "@components/groups/GroupCard";

const VISIBLE_GROUPS_COUNT = 4;

export default function DashboardGroups({ groups, loading, error, onDelete }) {
  let content;

  if (loading) {
    content = <p className="dashboard-card-message">Cargando grupos...</p>;
  } else if (error) {
    content = (
      <p className="dashboard-card-message">No se pudieron cargar los grupos.</p>
    );
  } else if (groups.length === 0) {
    content = (
      <p className="dashboard-card-message">
        Todavía no perteneces a ningún grupo.
      </p>
    );
  }

  return (
    <section className="dashboard-groups">
      <header className="dashboard-groups-header">
        <h2 className="dashboard-card-title">Tus grupos</h2>
        <Link to="/grupos" className="dashboard-groups-all">
          Ver todos
        </Link>
      </header>

      {content ? (
        <div className="dashboard-card">{content}</div>
      ) : (
        <ul className="dashboard-group-grid">
          {groups.slice(0, VISIBLE_GROUPS_COUNT).map((group) => (
            <li key={group.id}>
              <GroupCard group={group} onDeleted={onDelete} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
