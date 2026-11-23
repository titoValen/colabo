import SuccessIllustration from "@/assets/illustration/colabo_register.webp";

export default function SuccessScreen({ groupName, onContinue, delayMs }) {
  return (
    <section
      className="wizard-success"
      role="status"
      aria-live="polite"
      style={{ "--redirect-delay": `${delayMs}ms` }}
    >
      <span className="confetti confetti--1" aria-hidden="true" />
      <span className="confetti confetti--2" aria-hidden="true" />
      <span className="confetti confetti--3" aria-hidden="true" />
      <span className="confetti confetti--4" aria-hidden="true" />

      <figure className="wizard-success-illustration" aria-hidden="true">
        <img src={SuccessIllustration} alt="" />
      </figure>
      <h2>¡Tu grupo está listo!</h2>
      <p>
        Creamos <strong>{groupName}</strong>. Te llevamos al lobby, donde vas a
        centralizar actividades, integrantes, acuerdos y responsabilidades.
      </p>
      <div className="wizard-success-bar" aria-hidden="true">
        <span />
      </div>
      <button type="button" className="btn btn-primary" onClick={onContinue}>
        Ir al lobby ahora
      </button>
    </section>
  );
}
