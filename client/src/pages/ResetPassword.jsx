import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import AuthField from "@components/AuthField";
import { apiFetch } from "@/services/api";
import Logo from "@/assets/colabo_logo.svg";
import "@/styles/auth.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors((current) => ({ ...current, [event.target.name]: undefined }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setMessage("");

    if (!token || !email) {
      setErrors({ general: ["El enlace de recuperación es inválido."] });
      return;
    }

    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: ["Las contraseñas no coinciden."] });
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch("/reset-password", {
        method: "POST",
        body: { ...form, token, email },
      });
      setMessage(response.message);
      setForm({ password: "", password_confirmation: "" });
    } catch (requestError) {
      setErrors(
        Object.keys(requestError.errors ?? {}).length
          ? requestError.errors
          : { general: [requestError.message] },
      );
    } finally {
      setLoading(false);
    }
  };

  const error = (field) =>
    errors[field]?.[0] && (
      <p className="auth-error" role="alert">{errors[field][0]}</p>
    );

  return (
    <main className="auth-page auth-page-centered">
      <section className="auth-panel" aria-labelledby="auth-title">
        <figure className="auth-logo">
          <img src={Logo} alt="Logo de Colabo" />
        </figure>
        <h1 id="auth-title">Nueva contraseña</h1>
        {error("general")}
        {message && <p className="auth-success" role="status">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthField
            label="Nueva contraseña"
            input={{
              type: "password",
              id: "password",
              name: "password",
              autoComplete: "new-password",
              minLength: 8,
              value: form.password,
              onChange: handleChange,
              "aria-invalid": Boolean(errors.password),
              required: true,
              error: error("password"),
            }}
          />
          <AuthField
            label="Repetir contraseña"
            input={{
              type: "password",
              id: "password_confirmation",
              name: "password_confirmation",
              autoComplete: "new-password",
              value: form.password_confirmation,
              onChange: handleChange,
              "aria-invalid": Boolean(errors.password_confirmation),
              required: true,
              error: error("password_confirmation"),
            }}
          />
          <button
            className="auth-submit"
            type="submit"
            disabled={loading || Boolean(message)}
          >
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>

        <div className="auth-links">
          <p className="auth-switch">
            <Link to="/iniciar-sesion">Volver al inicio de sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
