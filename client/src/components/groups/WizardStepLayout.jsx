export default function WizardStepLayout({
  eyebrow,
  title,
  description,
  illustration,
  aside,
  headingRef,
  children,
}) {
  return (
    <div className="wizard-step">
      <section className="wizard-card" aria-labelledby="wizard-step-title">
        <p className="wizard-eyebrow">{eyebrow}</p>
        <h2 id="wizard-step-title" ref={headingRef} tabIndex={-1}>
          {title}
        </h2>
        <p className="wizard-description">{description}</p>
        {children}
      </section>

      <aside className="wizard-aside">
        {illustration && (
          <figure className="wizard-illustration" aria-hidden="true">
            <img src={illustration} alt="" />
          </figure>
        )}
        {aside}
      </aside>
    </div>
  );
}
