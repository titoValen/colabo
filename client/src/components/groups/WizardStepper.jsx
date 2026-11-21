export default function WizardStepper({ steps, current, maxReached, onSelect }) {
  const isReview = current >= steps.length;
  const progress = isReview ? 100 : ((current + 1) / (steps.length + 1)) * 100;

  return (
    <nav
      className="wizard-stepper"
      aria-label="Progreso de creación del grupo"
      style={{ "--progress": `${progress}%` }}
    >
      <p className="wizard-stepper-summary" aria-live="polite">
        {isReview
          ? "Revisión final"
          : `Etapa ${current + 1} de ${steps.length} · ${steps[current].label}`}
      </p>

      <ol className="wizard-stepper-list">
        {steps.map((step, index) => {
          const state =
            index < current ? "is-complete" : index === current ? "is-current" : "is-upcoming";

          return (
            <li key={step.id} className={`wizard-stepper-item ${state}`}>
              <button
                type="button"
                className="wizard-stepper-button"
                onClick={() => onSelect(index)}
                disabled={index > maxReached}
                aria-current={index === current ? "step" : undefined}
              >
                <span className="wizard-stepper-bubble">
                  {index < current ? (
                    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="wizard-stepper-label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="wizard-stepper-track" aria-hidden="true">
        <span className="wizard-stepper-fill" />
      </div>
    </nav>
  );
}
