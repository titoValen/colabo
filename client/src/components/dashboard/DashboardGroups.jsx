import { Link } from "react-router";
import GroupAvatar from "@components/groups/GroupAvatar";

const VISIBLE_GROUPS_COUNT = 4;

export default function DashboardGroups({ groups, loading, error }) {
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
  } else {
    content = (
      <>
        <ul className="dashboard-group-list">
          {groups.slice(0, VISIBLE_GROUPS_COUNT).map((group) => (
            <li key={group.id}>
              <Link to={`/grupos/${group.id}`} className="dashboard-group-link">
                <GroupAvatar
                  name={group.name}
                  color={group.color}
                  preset={group.avatar_preset}
                  imageUrl={group.avatar_url}
                  size="sm"
                />
                <span className="dashboard-group-text">
                  <span className="dashboard-group-name">{group.name}</span>
                  <span className="dashboard-group-meta">
                    {group.users_count}{" "}
                    {group.users_count === 1 ? "integrante" : "integrantes"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {groups.length > VISIBLE_GROUPS_COUNT && (
          <Link to="/grupos" className="dashboard-group-all">
            Ver todos mis grupos
          </Link>
        )}
      </>
    );
  }

  return (
    <section className="dashboard-card">
      <h2 className="dashboard-card-title">Tus grupos</h2>
      {content}
    </section>
  );
}
