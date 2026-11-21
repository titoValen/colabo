export default function WizardField({
  id,
  label,
  required = false,
  hint,
  error,
  counter,
  children,
}) {
  return (
    <div className={`wizard-field${error ? " has-error" : ""}`}>
      <div className="wizard-field-head">
        <label htmlFor={id} className="wizard-label">
          {label}
        </label>
        <span className={`wizard-tag${required ? " is-required" : ""}`}>
          {required ? "Obligatorio" : "Opcional"}
        </span>
      </div>

      {children}

      <div className="wizard-field-foot">
        {error ? (
          <p className="wizard-error" id={`${id}-error`} role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="wizard-hint" id={`${id}-hint`}>
            {hint}
          </p>
        ) : (
          <span className="wizard-hint" id={`${id}-hint`}>
            &nbsp;
          </span>
        )}
        {counter !== undefined && (
          <span className="wizard-counter">{counter}</span>
        )}
      </div>
    </div>
  );
}
