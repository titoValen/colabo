import { useState } from "react";
import CollapsibleSection from "@/components/groups/CollapsibleSection";
import WizardStepLayout from "@/components/groups/WizardStepLayout";
import AgreementsModule from "@/components/groups/modules/AgreementsModule";
import ExpensesModule from "@/components/groups/modules/ExpensesModule";
import ObjectivesModule from "@/components/groups/modules/ObjectivesModule";
import TaskModule from "@/components/groups/modules/TaskModule";
import { formatMoney } from "@/components/groups/groupWizardConfig";
import OrganizeIllustration from "@/assets/illustration/colabo_paso_3.webp";

const plural = (count, singular, pluralForm) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

function getModuleSummaries({ purpose, goals, dates, rules, task, expenses }) {
  const objectives = [
    purpose.trim() && "propósito",
    goals.length > 0 && plural(goals.length, "objetivo", "objetivos"),
    dates.length > 0 && plural(dates.length, "fecha", "fechas"),
  ].filter(Boolean);

  return {
    objectives: objectives.join(" · "),
    agreements: rules.length > 0 ? plural(rules.length, "acuerdo", "acuerdos") : "",
    task: task.title.trim() ? task.title.trim() : "",
    expenses: expenses.enabled
      ? `Activados en ${expenses.currency}${
          expenses.budget !== "" ? ` · presupuesto ${formatMoney(expenses.budget, expenses.currency)}` : ""
        }`
      : "",
  };
}

const MODULES = [
  {
    id: "objectives",
    badge: "A",
    title: "Objetivos compartidos",
    description: "Propósito, metas y fechas importantes.",
  },
  {
    id: "agreements",
    badge: "B",
    title: "Acuerdos y convivencia",
    description: "Reglas, compromisos y condiciones iniciales.",
  },
  {
    id: "task",
    badge: "C",
    title: "Organización de tareas",
    description: "Deje preparada la primera tarea del grupo.",
  },
  {
    id: "expenses",
    badge: "D",
    title: "Economía compartida",
    description: "Gastos, moneda, presupuesto y aportes.",
  },
];

export default function OrganizationStep({
  value,
  user,
  errors,
  today,
  onChange,
  headingRef,
}) {
  const summaries = getModuleSummaries(value);
  const [openModules, setOpenModules] = useState(() =>
    Object.fromEntries(MODULES.map(({ id }) => [id, Boolean(summaries[id])])),
  );

  // Si hay un error dentro de un módulo, se muestra abierto para que se vea.
  const hasErrorIn = (prefix) =>
    Object.keys(errors).some((key) => key.startsWith(prefix));
  const forcedOpen = {
    objectives: hasErrorIn("purpose"),
    task: hasErrorIn("task"),
    expenses: hasErrorIn("expenses"),
  };
  const isOpen = (id) => openModules[id] || Boolean(forcedOpen[id]);

  const toggle = (id) =>
    setOpenModules((current) => ({ ...current, [id]: !isOpen(id) }));

  return (
    <WizardStepLayout
      eyebrow="Etapa 3 · Organización inicial"
      title="¿Cómo va a funcionar?"
      description="Todo esto es opcional. Configura solo lo que necesites; puedes completar el resto después."
      illustration={OrganizeIllustration}
      headingRef={headingRef}
      aside={
        <div className="wizard-tip">
          <strong>Empezá simple</strong>
          <p>
            Puedes crear el grupo sin completar estos datos y organizarlos después desde el lobby.
          </p>
        </div>
      }
    >
      <div className="collapsible-list">
        {MODULES.map(({ id, badge, title, description }) => (
          <CollapsibleSection
            key={id}
            id={`module-${id}`}
            badge={badge}
            title={title}
            description={description}
            summary={summaries[id]}
            isOpen={isOpen(id)}
            onToggle={() => toggle(id)}
          >
            {id === "objectives" && (
              <ObjectivesModule value={value} errors={errors} onChange={onChange} />
            )}
            {id === "agreements" && (
              <AgreementsModule value={value} onChange={onChange} />
            )}
            {id === "task" && (
              <TaskModule
                value={value.task}
                user={user}
                errors={errors}
                today={today}
                onChange={(patch) => onChange({ task: { ...value.task, ...patch } })}
              />
            )}
            {id === "expenses" && (
              <ExpensesModule
                value={value.expenses}
                errors={errors}
                onChange={(patch) =>
                  onChange({ expenses: { ...value.expenses, ...patch } })
                }
              />
            )}
          </CollapsibleSection>
        ))}
      </div>
    </WizardStepLayout>
  );
}
