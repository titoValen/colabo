import ChoiceGroup from "@/components/groups/ChoiceGroup";
import ToggleSwitch from "@/components/groups/ToggleSwitch";
import WizardField from "@/components/groups/WizardField";
import {
  CURRENCIES,
  EXPENSE_SPLITS,
} from "@/components/groups/groupWizardConfig";

export default function ExpensesModule({ value, errors, onChange }) {
  return (
    <div className="module-fields">
      <ToggleSwitch
        id="expenses-enabled"
        label="Activar gestión de gastos"
        description="Lleva el control de gastos compartidos, aportes y saldos."
        checked={value.enabled}
        onChange={(enabled) => onChange({ enabled })}
      />

      {value.enabled && (
        <div className="module-fields module-fields--nested">
          <div className="module-row">
            <WizardField id="expenses-currency" label="Moneda">
              <select
                id="expenses-currency"
                className="wizard-input"
                value={value.currency}
                onChange={(event) => onChange({ currency: event.target.value })}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </WizardField>

            <WizardField
              id="expenses-budget"
              label="Presupuesto inicial"
              error={errors["expenses.budget"]}
            >
              <input
                id="expenses-budget"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                className="wizard-input"
                value={value.budget}
                placeholder="0,00"
                aria-invalid={Boolean(errors["expenses.budget"])}
                aria-describedby={
                  errors["expenses.budget"] ? "expenses-budget-error" : undefined
                }
                onChange={(event) => onChange({ budget: event.target.value })}
              />
            </WizardField>
          </div>

          <ChoiceGroup
            name="expenses-split"
            legend="¿Cómo se reparten los gastos?"
            variant="card"
            options={EXPENSE_SPLITS}
            value={value.split}
            onChange={(split) => onChange({ split })}
          />

          {value.split === "contribution" && (
            <WizardField
              id="expenses-contribution"
              label={`Aporte por integrante (${value.currency})`}
              required
              error={errors["expenses.contribution"]}
            >
              <input
                id="expenses-contribution"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                className="wizard-input"
                value={value.contribution}
                placeholder="0,00"
                aria-invalid={Boolean(errors["expenses.contribution"])}
                aria-describedby={
                  errors["expenses.contribution"]
                    ? "expenses-contribution-error"
                    : undefined
                }
                onChange={(event) => onChange({ contribution: event.target.value })}
              />
            </WizardField>
          )}
        </div>
      )}
    </div>
  );
}
