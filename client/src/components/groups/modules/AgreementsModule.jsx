import { useState } from "react";
import ChoiceGroup from "@/components/groups/ChoiceGroup";
import ItemList from "@/components/groups/ItemList";
import ToggleSwitch from "@/components/groups/ToggleSwitch";
import {
  LIST_MAX_ITEMS,
  RULE_TYPES,
  getRuleTypeLabel,
} from "@/components/groups/groupWizardConfig";

const EMPTY_DRAFT = { type: "rule", description: "", requiresAcceptance: false };

const PLACEHOLDERS = {
  rule: "Ej: Avisar con 24 hs si no puedes asistir",
  commitment: "Ej: Cada uno trae algo para compartir",
  condition: "Ej: Los gastos del hogar se dividen en partes iguales",
};

export default function AgreementsModule({ value, onChange }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [error, setError] = useState("");

  const addRule = () => {
    const description = draft.description.trim();

    if (!description) return setError("Escriba el acuerdo antes de agregarlo.");
    if (value.rules.length >= LIST_MAX_ITEMS) {
      return setError(`Puedes cargar hasta ${LIST_MAX_ITEMS} acuerdos.`);
    }

    onChange({ rules: [...value.rules, { ...draft, description }] });
    setDraft({ ...EMPTY_DRAFT, type: draft.type });
    setError("");
  };

  return (
    <div className="module-fields">
      <ChoiceGroup
        name="rule-type"
        legend="¿Qué quieres definir?"
        options={RULE_TYPES}
        value={draft.type}
        onChange={(type) => setDraft({ ...draft, type })}
      />

      <div className="wizard-fieldset">
        <label htmlFor="rule-input" className="wizard-label">
          Acuerdo
        </label>
        <div className="add-row">
          <input
            id="rule-input"
            className="wizard-input"
            value={draft.description}
            maxLength={500}
            placeholder={PLACEHOLDERS[draft.type]}
            aria-invalid={Boolean(error)}
            onChange={(event) => {
              setDraft({ ...draft, description: event.target.value });
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              addRule();
            }}
            autoComplete="off"
          />
          <button type="button" className="btn btn-secondary" onClick={addRule}>
            Agregar
          </button>
        </div>
        {error && (
          <p className="wizard-error" role="alert">
            {error}
          </p>
        )}
        <ToggleSwitch
          id="rule-requires-acceptance"
          label="Los integrantes deberán aceptarlo"
          description="Cuando se sumen, van a poder aceptar este acuerdo."
          checked={draft.requiresAcceptance}
          onChange={(requiresAcceptance) => setDraft({ ...draft, requiresAcceptance })}
        />
        <ItemList
          label="Acuerdos del grupo"
          items={value.rules}
          getLabel={(rule) => rule.description}
          getMeta={(rule) =>
            `${getRuleTypeLabel(rule.type)}${rule.requiresAcceptance ? " · requiere aceptación" : ""}`
          }
          onRemove={(index) =>
            onChange({ rules: value.rules.filter((_, position) => position !== index) })
          }
        />
      </div>
    </div>
  );
}
