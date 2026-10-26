import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import ImageOnBoarding from "@/assets/illustration/onboarding_01.webp";
import "@/styles/onboarding.css";

const TIPOS_GRUPO = [
  "Amigos",
  "Familia",
  "Compañeros de piso",
  "Viaje",
  "Otro",
];

const FORM_INICIAL = {
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
  const { completarOnboarding, saltarOnboarding } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(FORM_INICIAL);
  const [errors, setErrors] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [loading, setLoading] = useState(false);
  const [paso, setPaso] = useState(1);

  const cambiarGrupo = (event) => {
    const { name, value } = event.target;
    setForm((actual) => ({
      ...actual,
      grupo: { ...actual.grupo, [name]: value },
    }));
    setErrors((actuales) => ({ ...actuales, [`grupo.${name}`]: undefined }));
    setErrorGeneral("");
  };

  const cambiarEvento = (event) => {
    const { name, value } = event.target;
    setForm((actual) => ({
      ...actual,
      evento: { ...actual.evento, [name]: value },
    }));
    setErrors((actuales) => ({ ...actuales, [`evento.${name}`]: undefined }));
    setErrorGeneral("");
  };

  const mostrarError = (campo) =>
    errors[campo]?.[0] && (
      <p className="onboarding-error" role="alert">
        {errors[campo][0]}
      </p>
    );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setErrorGeneral("");

    if (paso === 1) {
      setPaso(2);
      return;
    }

    setLoading(true);
    const { tipoPersonalizado, ...grupo } = form.grupo;
    try {
      await completarOnboarding({
        grupo: {
          ...grupo,
          tipo: grupo.tipo === "Otro" ? tipoPersonalizado.trim() : grupo.tipo,
        },
        evento: form.evento,
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (Object.keys(error.errors ?? {}).length) {
        setErrors(error.errors);
      } else {
        setErrorGeneral(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaltar = async () => {
    setLoading(true);
    setErrors({});
    setErrorGeneral("");
    try {
      await saltarOnboarding();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorGeneral(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="onboarding-page">
      <section className="onboarding-panel" aria-labelledby="onboarding-title">
        <h1 id="onboarding-title">Empecemos a organizar</h1>
        <p className="onboarding-intro">
          Crea tu primer grupo y evento para tener todo en un mismo lugar.
        </p>

        {errorGeneral && (
          <p className="onboarding-error" role="alert">
            {errorGeneral}
          </p>
        )}

        <nav className="onboarding-steps" aria-label="Pasos del onboarding">
          {paso === 2 && (
            <button
              type="button"
              className="onboarding-step"
              onClick={() => setPaso(1)}
              disabled={loading}
            >
              1
            </button>
          )}
          <span aria-current="step">
            {paso === 1 ? "1" : "2"}
          </span>
        </nav>

        <form className="onboarding-form" onSubmit={handleSubmit}>
          {paso === 1 ? (
            <fieldset disabled={loading}>
              <legend>Tu grupo</legend>

              <label htmlFor="grupo-nombre">Nombre del grupo</label>
              <input
                id="grupo-nombre"
                name="nombre"
                value={form.grupo.nombre}
                onChange={cambiarGrupo}
                maxLength={255}
                required
              />
              {mostrarError("grupo.nombre")}

              <label htmlFor="grupo-tipo">Tipo de grupo</label>
              <select
                id="grupo-tipo"
                name="tipo"
                value={form.grupo.tipo}
                onChange={cambiarGrupo}
                required
              >
                {TIPOS_GRUPO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
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
                    onChange={cambiarGrupo}
                    maxLength={255}
                    required
                  />
                </>
              )}
              {mostrarError("grupo.tipo")}

              <label htmlFor="grupo-descripcion">
                Descripción <span>(opcional)</span>
              </label>
              <textarea
                id="grupo-descripcion"
                name="descripcion"
                value={form.grupo.descripcion}
                onChange={cambiarGrupo}
                rows="2"
              />
              {mostrarError("grupo.descripcion")}
            </fieldset>
          ) : (
            <fieldset disabled={loading}>
              <legend>Tu primer evento</legend>

              <label htmlFor="evento-titulo">Título</label>
              <input
                id="evento-titulo"
                name="titulo"
                value={form.evento.titulo}
                onChange={cambiarEvento}
                maxLength={255}
                required
              />
              {mostrarError("evento.titulo")}

              <label htmlFor="evento-fecha-hora">Fecha y hora</label>
              <input
                id="evento-fecha-hora"
                name="fecha_hora"
                type="datetime-local"
                value={form.evento.fecha_hora}
                onChange={cambiarEvento}
                required
              />
              {mostrarError("evento.fecha_hora")}

              <label htmlFor="evento-descripcion">
                Descripción <span>(opcional)</span>
              </label>
              <textarea
                id="evento-descripcion"
                name="descripcion"
                value={form.evento.descripcion}
                onChange={cambiarEvento}
                rows="2"
              />
              {mostrarError("evento.descripcion")}
            </fieldset>
          )}

          <button
            className="onboarding-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : paso === 1
                ? "Continuar al evento"
                : "Crear grupo y evento"}
          </button>
        </form>

        <button
          className="onboarding-skip"
          type="button"
          onClick={handleSaltar}
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
