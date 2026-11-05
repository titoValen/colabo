import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import ImageOnBoarding from "@/assets/illustration/onboarding_01.webp";
import ArrowLeft from "@/assets/icons/arrow_left.svg";
import Logo from "@/assets/colabo_logo.svg";
import "@/styles/onboarding.css";

const GROUP_TYPES = [
  "Amigos",
  "Familia",
  "Compañeros de piso",
  "Viaje",
  "Otro",
];

const INITIAL_FORM = {
  grupo: {
    nombre: "",
    tipo: "Amigos",
    tipoPersonalizado: "",
    descripcion: "",
  },
  evento: {
    titulo: "",
    fecha_hora: "",
    descripcion: "",
  },
};

export default function Onboarding() {
  const { completeOnboarding, skipOnboarding } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleGroupChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      grupo: { ...current.grupo, [name]: value },
    }));
    setErrors((current) => ({ ...current, [`grupo.${name}`]: undefined }));
    setGeneralError("");
  };

  const handleEventChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      evento: { ...current.evento, [name]: value },
    }));
    setErrors((current) => ({ ...current, [`evento.${name}`]: undefined }));
    setGeneralError("");
  };

  const showError = (field) =>
    errors[field]?.[0] && (
      <p className="onboarding-error" role="alert">
        {errors[field][0]}
      </p>
    );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setGeneralError("");

    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    const { tipoPersonalizado, ...group } = form.grupo;
    try {
      await completeOnboarding({
        grupo: {
          ...group,
          tipo:
            group.tipo === "Otro" ? tipoPersonalizado.trim() : group.tipo,
        },
        evento: form.evento,
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (Object.keys(error.errors ?? {}).length) {
        setErrors(error.errors);
      } else {
        setGeneralError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    setErrors({});
    setGeneralError("");
    try {
      await skipOnboarding();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setGeneralError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="onboarding-page">
      <section className="onboarding-panel" aria-labelledby="onboarding-title">
        <figure className="onboarding-logo">
          <img src={Logo} alt="Logo de Colabo" />
        </figure>
        <h1 id="onboarding-title">Empecemos a organizar</h1>
        <p className="onboarding-intro">
          Crea tu primer grupo y evento para tener todo en un mismo lugar.
        </p>

        {generalError && (
          <p className="onboarding-error" role="alert">
            {generalError}
          </p>
        )}

        <nav className="onboarding-steps" aria-label="Pasos del onboarding">
          <span
            className={step === 1 ? "is-active" : "is-complete"}
            aria-current={step === 1 ? "step" : undefined}
          >
            <span className="onboarding-step-number">1</span>
            <span className="onboarding-step-label">Tu grupo</span>
          </span>
          <span className="onboarding-step-line" aria-hidden="true" />
          <span
            className={step === 2 ? "is-active" : "is-inactive"}
            aria-current={step === 2 ? "step" : undefined}
          >
            <span className="onboarding-step-number">2</span>
            <span className="onboarding-step-label">Tu evento</span>
          </span>
        </nav>

        <form className="onboarding-form" onSubmit={handleSubmit}>
          {step === 1 ? (
            <fieldset disabled={loading}>
              <legend>Tu grupo</legend>

              <label htmlFor="grupo-nombre">Nombre del grupo</label>
              <input
                id="grupo-nombre"
                name="nombre"
                value={form.grupo.nombre}
                onChange={handleGroupChange}
                maxLength={255}
                required
              />
              {showError("grupo.nombre")}

              <label htmlFor="grupo-tipo">Tipo de grupo</label>
              <select
                id="grupo-tipo"
                name="tipo"
                value={form.grupo.tipo}
                onChange={handleGroupChange}
                required
              >
                {GROUP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {form.grupo.tipo === "Otro" && (
                <>
                  <label htmlFor="grupo-tipo-personalizado">
                    ¿Qué tipo de grupo?
                  </label>
                  <input
                    id="grupo-tipo-personalizado"
                    name="tipoPersonalizado"
                    value={form.grupo.tipoPersonalizado}
                    onChange={handleGroupChange}
                    maxLength={255}
                    required
                  />
                </>
              )}
              {showError("grupo.tipo")}

              <label htmlFor="grupo-descripcion">
                Descripción <span>(opcional)</span>
              </label>
              <textarea
                id="grupo-descripcion"
                name="descripcion"
                value={form.grupo.descripcion}
                onChange={handleGroupChange}
                rows="2"
              />
              {showError("grupo.descripcion")}
            </fieldset>
          ) : (
            <fieldset disabled={loading}>
              <legend>Tu primer evento</legend>

              <label htmlFor="evento-titulo">Título</label>
              <input
                id="evento-titulo"
                name="titulo"
                value={form.evento.titulo}
                onChange={handleEventChange}
                maxLength={255}
                required
              />
              {showError("evento.titulo")}

              <label htmlFor="evento-fecha-hora">Fecha y hora</label>
              <input
                id="evento-fecha-hora"
                name="fecha_hora"
                type="datetime-local"
                value={form.evento.fecha_hora}
                onChange={handleEventChange}
                required
              />
              {showError("evento.fecha_hora")}

              <label htmlFor="evento-descripcion">
                Descripción <span>(opcional)</span>
              </label>
              <textarea
                id="evento-descripcion"
                name="descripcion"
                value={form.evento.descripcion}
                onChange={handleEventChange}
                rows="2"
              />
              {showError("evento.descripcion")}
            </fieldset>
          )}

          <div className="onboarding-actions">
            {step === 2 && (
              <button
                type="button"
                className="onboarding-back"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                <figure>
                  <img
                    src={ArrowLeft}
                    alt="Icono de una flecha hacia la izquierda, haciando referencia para volver al paso anterior"
                  />
                </figure>
                <span>Volver</span>
              </button>
            )}

            <button
              className="onboarding-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : step === 1
                  ? "Continuar al evento"
                  : "Crear grupo y evento"}
            </button>
          </div>
        </form>

        <button
          className="onboarding-skip"
          type="button"
          onClick={handleSkip}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Saltar todo"}
        </button>
      </section>

      <aside className="onboarding-image" aria-hidden="true">
        <figure>
          <img src={ImageOnBoarding} alt="" />
        </figure>
      </aside>
    </main>
  );
}
