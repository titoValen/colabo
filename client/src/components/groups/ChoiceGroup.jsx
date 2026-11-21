export default function ChoiceGroup({
  name,
  legend,
  tag,
  options,
  value,
  onChange,
  variant = "chip",
}) {
  return (
    <fieldset className={`choice-group choice-group--${variant}`}>
      <legend className="wizard-label">
        {legend}
        {tag && (
          <span className={`wizard-tag${tag === "Obligatorio" ? " is-required" : ""}`}>
            {tag}
          </span>
        )}
      </legend>
      <div className="choice-options">
        {options.map((option) => (
          <label
            key={option.value}
            className={`choice${value === option.value ? " is-selected" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="choice-check" aria-hidden="true" />
            <span className="choice-text">
              <span className="choice-label">{option.label}</span>
              {option.hint && <span className="choice-hint">{option.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
