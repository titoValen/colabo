import GroupPreview from "@/components/groups/GroupPreview";
import WizardStepLayout from "@/components/groups/WizardStepLayout";
import {
  CURRENCIES,
  EXPENSE_SPLITS,
  formatDate,
  formatMoney,
  getRuleTypeLabel,
} from "@/components/groups/groupWizardConfig";
import ReviewIllustration from "@/assets/illustration/colabo_paso_1.webp";

function ReviewSection({ title, onEdit, children }) {
  return (
    <section className="review-section">
      <header className="review-section-header">
        <h3>{title}</h3>
        <button type="button" className="wizard-link-button" onClick={onEdit}>
          Editar<span className="wizard-sr-only"> {title}</span>
        </button>
      </header>
      {children}
    </section>
  );
}

const Empty = ({ children }) => <p className="review-empty">{children}</p>;

export default function ReviewStep({ form, user, memberLabel, onEdit, headingRef }) {
  const { identity, members, organization } = form;
  const { purpose, goals, dates, rules, task, expenses } = organization;
  const permissions = [
    members.permissions.invite && "invitar personas",
    members.permissions.createTasks && "crear tareas",
    members.permissions.addExpenses && "registrar gastos",
  ].filter(Boolean);
  const split = EXPENSE_SPLITS.find((option) => option.value === expenses.split);
  const currency = CURRENCIES.find((option) => option.value === expenses.currency);

  return (
    <WizardStepLayout
      eyebrow="Revisión final"
      title="Todo listo para crear tu grupo"
      description="Revisa el resumen. Puedes editar cualquier sección antes de confirmar."
      illustration={ReviewIllustration}
      headingRef={headingRef}
    >
      <div className="review-list">
        <ReviewSection title="Nombre, imagen y categoría" onEdit={() => onEdit(0)}>
          <GroupPreview
            name={identity.name.trim()}
            description={identity.description.trim()}
            category={identity.category}
            color={identity.color}
            preset={identity.avatarPreset}
            avatarUrl={identity.avatar.preview}
            coverUrl={identity.cover.preview}
            memberLabel={memberLabel}
          />
        </ReviewSection>

        <ReviewSection title="Administrador e integrantes" onEdit={() => onEdit(1)}>
          <dl className="review-facts">
            <div>
              <dt>Administrador</dt>
              <dd>{user?.name ?? "Tú"} (tú)</dd>
            </div>
            <div>
              <dt>Invitados</dt>
              <dd>
                {members.invitees.length > 0
                  ? members.invitees.join(", ")
                  : "Nadie por ahora. Puedes invitar después."}
              </dd>
            </div>
            <div>
              <dt>Enlace y QR</dt>
              <dd>{members.inviteCode ? "Listo para compartir" : "Sin generar"}</dd>
            </div>
            <div>
              <dt>Límite</dt>
              <dd>Hasta {members.memberLimit} integrantes</dd>
            </div>
            <div>
              <dt>Los integrantes pueden</dt>
              <dd>{permissions.length > 0 ? permissions.join(", ") : "Solo participar"}</dd>
            </div>
          </dl>
        </ReviewSection>

        <ReviewSection title="Objetivos compartidos" onEdit={() => onEdit(2)}>
          {purpose.trim() || goals.length > 0 || dates.length > 0 ? (
            <div className="review-block">
              {purpose.trim() && <p>{purpose.trim()}</p>}
              {goals.length > 0 && (
                <ul className="review-bullets">
                  {goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              )}
              {dates.length > 0 && (
                <ul className="review-bullets">
                  {dates.map((item) => (
                    <li key={`${item.title}-${item.date}`}>
                      {item.title} · {formatDate(item.date, { day: "numeric", month: "long", year: "numeric" })}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <Empty>Sin configurar. Puedes agregarlo después.</Empty>
          )}
        </ReviewSection>

        <ReviewSection title="Acuerdos y convivencia" onEdit={() => onEdit(2)}>
          {rules.length > 0 ? (
            <ul className="review-bullets">
              {rules.map((rule) => (
                <li key={`${rule.type}-${rule.description}`}>
                  {rule.description}{" "}
                  <span className="review-meta">
                    {getRuleTypeLabel(rule.type)}
                    {rule.requiresAcceptance ? " · requiere aceptación" : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Sin acuerdos iniciales.</Empty>
          )}
        </ReviewSection>

        <ReviewSection title="Tarea inicial" onEdit={() => onEdit(2)}>
          {task.title.trim() ? (
            <div className="review-block">
              <p>
                <strong>{task.title.trim()}</strong>
              </p>
              {task.description.trim() && <p>{task.description.trim()}</p>}
              <p className="review-meta">
                Responsable: {user?.name ?? "tú"}
                {task.dueDate
                  ? ` · hasta el ${formatDate(task.dueDate, { day: "numeric", month: "long", year: "numeric" })}`
                  : ""}
              </p>
            </div>
          ) : (
            <Empty>Sin tareas iniciales.</Empty>
          )}
        </ReviewSection>

        {expenses.enabled && (
          <ReviewSection title="Economía compartida" onEdit={() => onEdit(2)}>
            <dl className="review-facts">
              <div>
                <dt>Moneda</dt>
                <dd>{currency?.label}</dd>
              </div>
              <div>
                <dt>Presupuesto inicial</dt>
                <dd>
                  {expenses.budget !== ""
                    ? formatMoney(expenses.budget, expenses.currency)
                    : "Sin definir"}
                </dd>
              </div>
              <div>
                <dt>Distribución</dt>
                <dd>
                  {split?.label}
                  {expenses.split === "contribution" &&
                    ` · ${formatMoney(expenses.contribution || 0, expenses.currency)} por integrante`}
                </dd>
              </div>
            </dl>
          </ReviewSection>
        )}
      </div>
    </WizardStepLayout>
  );
}
