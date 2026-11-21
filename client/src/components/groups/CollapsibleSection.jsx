export default function CollapsibleSection({
  id,
  badge,
  title,
  description,
  summary,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <section
      className={`collapsible${isOpen ? " is-open" : ""}${summary ? " is-configured" : ""}`}
    >
      <h3 className="collapsible-heading">
        <button
          type="button"
          id={`${id}-trigger`}
          className="collapsible-trigger"
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
        >
          <span className="collapsible-badge" aria-hidden="true">
            {badge}
          </span>
          <span className="collapsible-titles">
            <span className="collapsible-title">{title}</span>
            <span className="collapsible-description">
              {summary || description}
            </span>
          </span>
          <span className="wizard-tag collapsible-tag">
            {summary ? "Configurado" : "Opcional"}
          </span>
          <span className="collapsible-chevron" aria-hidden="true" />
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="collapsible-panel"
        inert={!isOpen}
      >
        <div className="collapsible-content">
          <div className="collapsible-inner">{children}</div>
        </div>
      </div>
    </section>
  );
}
