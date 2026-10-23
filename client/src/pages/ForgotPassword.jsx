import { useState } from "react";
import { Link } from "react-router";
import AuthField from "@components/AuthField";
import { apiFetch } from "@/services/api";
import Logo from "@/assets/colabo_logo.svg";
import "@/styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await apiFetch("/forgot-password", {
        method: "POST",
        body: { email },
      });
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message);
      setFieldError(requestError.errors?.email?.[0] ?? "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <figure className="auth-logo">
          <img src={Logo} alt="Logo de Colabo" />
        </figure>
        <h1 id="auth-title">Recuperar contraseña</h1>
        <p className="auth-description">
          Ingresa tu email y te enviaremos un enlace para crear una nueva contraseña.
        </p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthField
            label="Email"
            input={{
              type: "email",
              id: "email",
              name: "email",
              autoComplete: "email",
              value: email,
              onChange: (event) => {
                setEmail(event.target.value);
                setError("");
                setFieldError("");
              },
              "aria-invalid": Boolean(fieldError),
              required: true,
              error: fieldError && (
                <p className="auth-error" role="alert">{fieldError}</p>
              ),
            }}
          />
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
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