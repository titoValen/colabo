import WizardField from "@/components/groups/WizardField";

export default function TaskModule({ value, user, errors, today, onChange }) {
  return (
    <div className="module-fields">
      <WizardField
        id="task-title"
        label="¿Qué hay que hacer primero?"
        error={errors["task.title"]}
      >
        <input
          id="task-title"
          className="wizard-input"
          value={value.title}
          maxLength={255}
          placeholder="Ej: Armar la lista de compras"
          aria-invalid={Boolean(errors["task.title"])}
          aria-describedby={errors["task.title"] ? "task-title-error" : undefined}
          onChange={(event) => onChange({ title: event.target.value })}
          autoComplete="off"
        />
      </WizardField>

      <WizardField id="task-description" label="Descripción">
        <textarea
          id="task-description"
          className="wizard-input wizard-textarea"
          rows={2}
          maxLength={1000}
          value={value.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </WizardField>

      <div className="module-row">
        <WizardField
          id="task-responsible"
          label="Responsable"
          hint="Después vas a poder asignarla a otros integrantes."
        >
          <select id="task-responsible" className="wizard-input" defaultValue="me">
            <option value="me">{user?.name ? `${user.name} (vos)` : "Vos"}</option>
          </select>
        </WizardField>

        <WizardField id="task-due-date" label="Fecha límite">
          <input
            id="task-due-date"
            type="date"
            className="wizard-input"
            min={today}
            value={value.dueDate}
            onChange={(event) => onChange({ dueDate: event.target.value })}
          />
        </WizardField>
      </div>
    </div>
  );
}
