import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import AppLayout from "@components/layout/AppLayout";
import GroupCard from "@components/groups/GroupCard";
import Loading from "@components/shared/Loading";
import NewGroupIllustration from "@/assets/illustration/colabo_new_group.webp";
import "@/styles/groups/group-shared.css";
import "@/styles/groups/group-lobby.css";

export default function Groups() {
  const { token } = useAuth();
  const [result, setResult] = useState({ groups: null, error: null });

  useEffect(() => {
    let isCancelled = false;

    apiFetch("/groups", { token })
      .then((groups) => {
        if (!isCancelled) setResult({ groups, error: null });
      })
      .catch((error) => {
        if (!isCancelled) setResult({ groups: null, error });
      });

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const { groups, error } = result;

  return (
    <AppLayout>
      <header className="groups-header">
        <div>
          <h1>Mis grupos</h1>
          <p>Todos los espacios compartidos en los que participás.</p>
        </div>
        <Link to="/grupos/nuevo" className="btn btn-primary">
          Crear grupo
        </Link>
      </header>

      {error ? (
        <p className="lobby-error" role="alert">
          {error.message}
        </p>
      ) : !groups ? (
        <Loading status="Cargando tus grupos..." />
      ) : groups.length === 0 ? (
        <section className="groups-empty">
          <img src={NewGroupIllustration} alt="" />
          <h2>Todavía no tienes grupos</h2>
          <p>Crear un grupo es el primer paso para organizarse mejor.</p>
          <Link to="/grupos/nuevo" className="btn btn-primary">
            Crear mi primer grupo
          </Link>
        </section>
      ) : (
        <ul className="group-grid">
          {groups.map((group) => (
            <li key={group.id}>
              <GroupCard
                group={group}
                onDeleted={(groupId) =>
                  setResult((current) => ({
                    ...current,
                    groups: current.groups.filter((item) => item.id !== groupId),
                  }))
                }
              />
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
