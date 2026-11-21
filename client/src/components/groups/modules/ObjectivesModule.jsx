import { useState } from "react";
import ItemList from "@/components/groups/ItemList";
import WizardField from "@/components/groups/WizardField";
import {
  LIST_MAX_ITEMS,
  formatDate,
} from "@/components/groups/groupWizardConfig";

const PURPOSE_MAX = 500;

export default function ObjectivesModule({ value, errors, onChange }) {
  const [goalDraft, setGoalDraft] = useState("");
  const [goalError, setGoalError] = useState("");
  const [dateDraft, setDateDraft] = useState({ title: "", date: "" });
  const [dateError, setDateError] = useState("");

  const addGoal = () => {
    const goal = goalDraft.trim();

    if (!goal) return setGoalError("Escriba un objetivo antes de agregarlo.");
    if (value.goals.length >= LIST_MAX_ITEMS) {
      return setGoalError(`Puedes cargar hasta ${LIST_MAX_ITEMS} objetivos.`);
    }

    onChange({ goals: [...value.goals, goal] });
    setGoalDraft("");
    setGoalError("");
  };

  const addDate = () => {
    const title = dateDraft.title.trim();

    if (!title || !dateDraft.date) {
      return setDateError("Completa el nombre y la fecha para agregarla.");
    }
    if (value.dates.length >= LIST_MAX_ITEMS) {
      return setDateError(`Puedes cargar hasta ${LIST_MAX_ITEMS} fechas.`);
    }

    onChange({ dates: [...value.dates, { title, date: dateDraft.date }] });
    setDateDraft({ title: "", date: "" });
    setDateError("");
  };

  const onEnter = (action) => (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    action();
  };

  return (
    <div className="module-fields">
      <WizardField
        id="group-purpose"
        label="Propósito del grupo"
        hint="¿Para qué existe este grupo?"
        error={errors.purpose}
        counter={`${value.purpose.length}/${PURPOSE_MAX}`}
      >
        <textarea
          id="group-purpose"
          className="wizard-input wizard-textarea"
          rows={2}
          maxLength={PURPOSE_MAX}
          value={value.purpose}
          aria-invalid={Boolean(errors.purpose)}
          onChange={(event) => onChange({ purpose: event.target.value })}
        />
      </WizardField>

      <div className="wizard-fieldset">
        <label htmlFor="goal-input" className="wizard-label">
          Metas u objetivos
        </label>
        <div className="add-row">
          <input
            id="goal-input"
            className="wizard-input"
            value={goalDraft}
            maxLength={255}
            placeholder="Ej: Ahorrar para el viaje"
            aria-invalid={Boolean(goalError)}
            onChange={(event) => {
              setGoalDraft(event.target.value);
              setGoalError("");
            }}
            onKeyDown={onEnter(addGoal)}
            autoComplete="off"
          />
          <button type="button" className="btn btn-secondary" onClick={addGoal}>
            Agregar
          </button>
        </div>
        {goalError && (
          <p className="wizard-error" role="alert">
            {goalError}
          </p>
        )}
        <ItemList
          label="Objetivos del grupo"
          items={value.goals}
          getLabel={(goal) => goal}
          onRemove={(index) =>
            onChange({ goals: value.goals.filter((_, position) => position !== index) })
          }
        />
      </div>

      <div className="wizard-fieldset">
        <label htmlFor="date-title-input" className="wizard-label">
          Fechas importantes
        </label>
        <div className="add-row add-row--dates">
          <input
            id="date-title-input"
            className="wizard-input"
            value={dateDraft.title}
            maxLength={255}
            placeholder="Ej: Cumpleaños de Sol"
            aria-invalid={Boolean(dateError)}
            onChange={(event) => {
              setDateDraft({ ...dateDraft, title: event.target.value });
              setDateError("");
            }}
            onKeyDown={onEnter(addDate)}
            autoComplete="off"
          />
          <input
            type="date"
            className="wizard-input"
            aria-label="Fecha"
            value={dateDraft.date}
            aria-invalid={Boolean(dateError)}
            onChange={(event) => {
              setDateDraft({ ...dateDraft, date: event.target.value });
              setDateError("");
            }}
            onKeyDown={onEnter(addDate)}
          />
          <button type="button" className="btn btn-secondary" onClick={addDate}>
            Agregar
          </button>
        </div>
        {dateError && (
          <p className="wizard-error" role="alert">
            {dateError}
          </p>
        )}
        <ItemList
          label="Fechas importantes"
          items={value.dates}
          getLabel={(item) => item.title}
          getMeta={(item) => formatDate(item.date, { day: "numeric", month: "long", year: "numeric" })}
          onRemove={(index) =>
            onChange({ dates: value.dates.filter((_, position) => position !== index) })
          }
        />
      </div>
    </div>
  );
}
