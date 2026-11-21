export default function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) {
  return (
    <div className={`switch-row${checked ? " is-on" : ""}`}>
      <div className="switch-text">
        <label htmlFor={id} className="switch-label">
          {label}
        </label>
        {description && (
          <p className="switch-description" id={`${id}-description`}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        className="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-description` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-thumb" />
      </button>
    </div>
  );
}
