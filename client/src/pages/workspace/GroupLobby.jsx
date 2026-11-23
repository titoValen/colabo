import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import AppLayout from "@components/layout/AppLayout";
import GroupAvatar from "@components/groups/GroupAvatar";
import Loading from "@components/shared/Loading";
import ProfileAvatar from "@components/profile/ProfileAvatar";
import ArrowBackIcon from "@/assets/icons/arrowBackRounded.svg";
import {
  CURRENCIES,
  EXPENSE_SPLITS,
  buildInviteLink,
  formatDate,
  formatMoney,
  getRuleTypeLabel,
} from "@components/groups/groupWizardConfig";
import "@/styles/groups/group-shared.css";
import "@/styles/groups/group-lobby.css";

const DATE_WITH_YEAR = { day: "numeric", month: "long", year: "numeric" };

function LobbyCard({ title, count, children }) {
  return (
    <section className="lobby-card">
      <h2 className="lobby-card-title">
        {title}
        {count !== undefined && <span className="lobby-count">{count}</span>}
      </h2>
      {children}
    </section>
  );
}

const Empty = ({ children }) => <p className="lobby-empty">{children}</p>;

export default function GroupLobby() {
  const { groupId } = useParams();
  const { token, user } = useAuth();
  const { state } = useLocation();
  const [result, setResult] = useState({ id: null, data: null, error: null });

  useEffect(() => {
    let isCancelled = false;

    apiFetch(`/groups/${groupId}`, { token })
      .then((data) => {
        if (isCancelled) return;

        setResult({ id: groupId, data, error: null });
        if (state?.imageFailed) {
          toast.error(
            "El grupo se creó, pero no pudimos subir las imágenes. Probá de nuevo más tarde.",
            { id: "group-images" },
          );
        }
      })
      .catch((error) => {
        if (!isCancelled) setResult({ id: groupId, data: null, error });
      });

    return () => {
      isCancelled = true;
    };
  }, [groupId, token, state]);

  const handleCopy = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Enlace copiado.");
    } catch {
      toast.error("No pudimos copiar el enlace.");
    }
  };

  const header = (
    <header className="lobby-header">
      <Link to="/grupos" className="lobby-back">
        <img src={ArrowBackIcon} alt="" />
        Volver a mis grupos
      </Link>
    </header>
  );

  if (result.id !== groupId) {
    return (
      <AppLayout>
        {header}
        <Loading status="Cargando el grupo..." />
      </AppLayout>
    );
  }

  if (result.error) {
    return (
      <AppLayout>
        {header}
        <section className="lobby-error" role="alert">
          <h1>
            {result.error.status === 404
              ? "No encontramos este grupo"
              : "No pudimos cargar el grupo"}
          </h1>
          <p>{result.error.message}</p>
          <Link to="/grupos" className="btn btn-primary">
            Volver a mis grupos
          </Link>
        </section>
      </AppLayout>
    );
  }

  const { group, my_role: myRole, members, goals, rules, events, tasks, invitations } =
    result.data;
  const isAdmin = myRole === "admin";
  const sharedInvitation = invitations.find((invitation) => !invitation.invitee);
  const pendingInvitees = invitations.filter((invitation) => invitation.invitee);
  const split = EXPENSE_SPLITS.find((option) => option.value === group.expense_split);
  const currency = CURRENCIES.find((option) => option.value === group.currency);
  const memberName = (id) => members.find((member) => member.id === id)?.name;

  return (
    <AppLayout>
      {header}

      <div className="lobby">
        {state?.justCreated && (
          <p className="lobby-welcome" role="status">
            ¡Grupo creado! Este es su lobby: desde acá vas a organizar todo.
          </p>
        )}

        <section className="lobby-hero" style={{ "--group-color": group.color }}>
          <div
            className="lobby-cover group-cover"
            style={{
              backgroundImage: group.cover_url ? `url("${group.cover_url}")` : undefined,
            }}
          />
          <div className="lobby-hero-body">
            <GroupAvatar
              name={group.name}
              color={group.color}
              preset={group.avatar_preset}
              imageUrl={group.avatar_url}
              size="xl"
            />
            <div className="lobby-hero-text">
              <h1>{group.name}</h1>
              <div className="lobby-badges">
                {group.type && <span className="group-badge">{group.type}</span>}
                <span className="group-badge">{isAdmin ? "Administrador" : "Integrante"}</span>
                <span className="lobby-members-count">
                  {members.length} de {group.member_limit} integrantes
                </span>
              </div>
              {group.description && <p>{group.description}</p>}
              {group.purpose && (
                <p className="lobby-purpose">
                  <strong>Propósito:</strong> {group.purpose}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="lobby-grid">
          <LobbyCard title="Integrantes" count={members.length}>
            <ul className="lobby-members">
              {members.map((member) => (
                <li key={member.id}>
                  <ProfileAvatar
                    name={member.name}
                    seed={member.id === user?.id ? user.email : member.name}
                    shape={member.avatar_preference?.blobatar_shape}
                    color={member.avatar_preference?.avatar_color}
                    style={member.avatar_preference?.avatar_style}
                    size="sm"
                  />
                  <span className="lobby-member-name">{member.name}</span>
                  <span className="group-badge">
                    {member.role === "admin" ? "Administrador" : "Integrante"}
                  </span>
                </li>
              ))}
            </ul>
            {members.length === 1 && (
              <Empty>Por ahora sos la única persona. Invitá a quien quieras.</Empty>
            )}
          </LobbyCard>

          {isAdmin && (
            <LobbyCard title="Invitaciones">
              {sharedInvitation ? (
                <div className="lobby-invite">
                  <input
                    readOnly
                    value={buildInviteLink(sharedInvitation.code)}
                    aria-label="Enlace de invitación"
                    onFocus={(event) => event.target.select()}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleCopy(buildInviteLink(sharedInvitation.code))}
                  >
                    Copiar
                  </button>
                </div>
              ) : (
                <Empty>Todavía no generaste un enlace de invitación.</Empty>
              )}
              {pendingInvitees.length > 0 && (
                <ul className="lobby-list">
                  {pendingInvitees.map((invitation) => (
                    <li key={invitation.id}>
                      <span>{invitation.invitee}</span>
                      <span className="lobby-meta">Pendiente</span>
                    </li>
                  ))}
                </ul>
              )}
            </LobbyCard>
          )}

          <LobbyCard title="Objetivos" count={goals.length}>
            {goals.length > 0 ? (
              <ul className="lobby-list">
                {goals.map((goal) => (
                  <li key={goal.id}>{goal.description}</li>
                ))}
              </ul>
            ) : (
              <Empty>Todavía no hay objetivos. Sumalos cuando quieras.</Empty>
            )}
          </LobbyCard>

          <LobbyCard title="Acuerdos y convivencia" count={rules.length}>
            {rules.length > 0 ? (
              <ul className="lobby-list">
                {rules.map((rule) => (
                  <li key={rule.id}>
                    <span>{rule.description}</span>
                    <span className="lobby-meta">
                      {getRuleTypeLabel(rule.type)}
                      {rule.requires_acceptance ? " · requiere aceptación" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>Todavía no hay acuerdos ni reglas.</Empty>
            )}
          </LobbyCard>

          <LobbyCard title="Tareas" count={tasks.length}>
            {tasks.length > 0 ? (
              <ul className="lobby-list">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <span>
                      <strong>{task.title}</strong>
                      {task.description && ` · ${task.description}`}
                    </span>
                    <span className="lobby-meta">
                      Responsable: {memberName(task.assigned_user_id) ?? "sin asignar"}
                      {task.due_date ? ` · hasta el ${formatDate(task.due_date, DATE_WITH_YEAR)}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No hay tareas todavía. ¡Creá la primera!</Empty>
            )}
          </LobbyCard>

          <LobbyCard title="Fechas importantes" count={events.length}>
            {events.length > 0 ? (
              <ul className="lobby-list">
                {events.map((event) => (
                  <li key={event.id}>
                    <span>{event.title}</span>
                    <span className="lobby-meta">
                      {formatDate(event.starts_at, DATE_WITH_YEAR)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No hay fechas cargadas.</Empty>
            )}
          </LobbyCard>

          <LobbyCard title="Economía compartida">
            {group.expenses_enabled ? (
              <dl className="lobby-facts">
                <div>
                  <dt>Moneda</dt>
                  <dd>{currency?.label ?? group.currency}</dd>
                </div>
                <div>
                  <dt>Presupuesto inicial</dt>
                  <dd>
                    {group.budget !== null
                      ? formatMoney(group.budget, group.currency)
                      : "Sin definir"}
                  </dd>
                </div>
                <div>
                  <dt>Distribución</dt>
                  <dd>
                    {split?.label}
                    {group.expense_split === "contribution" &&
                      group.contribution_amount !== null &&
                      ` · ${formatMoney(group.contribution_amount, group.currency)} por integrante`}
                  </dd>
                </div>
              </dl>
            ) : (
              <Empty>La gestión de gastos está desactivada en este grupo.</Empty>
            )}
          </LobbyCard>
        </div>
      </div>
    </AppLayout>
  );
}
