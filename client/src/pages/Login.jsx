import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import AuthField from "@components/AuthField";
import ColaboLogin from "@/assets/illustration/colabo_login.webp";
import Logo from "@/assets/colabo_logo.svg";
import "@/styles/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((current) => ({ ...current, [e.target.name]: undefined }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({});

    try {
      await login(form);
      navigate("/onboarding");
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length) {
        setErrors(err.errors);
      } else {
        setError(err.message);
      }
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
        <h1>Inicia sesión</h1>
        {location.state?.message && (
          <p className="auth-success" role="status">
            {location.state.message}
          </p>
        )}
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthField
            label={"Email"}
            input={{
              type: "email",
              id: "email",
              name: "email",
              autoComplete: "email",
              value: form.email,
              onChange: handleChange,
              "aria-invalid": Boolean(errors.email),
              required: true,
            }}
          />

          <AuthField
            label={"Contraseña"}
            input={{
              type: "password",
              id: "password",
              name: "password",
              autoComplete: "current-password",
              value: form.password,
              onChange: handleChange,
              "aria-invalid": Boolean(errors.password),
              required: true,
            }}
          />
          <p className="auth-forgot">
            <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
          </p>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-links">
          <p className="auth-switch">
            ¿Aún no tienes cuenta? <Link to="/registrarse">Crear cuenta</Link>
          </p>
          <p className="auth-switch">
            Volver al <Link to="/">inicio</Link>
          </p>
        </div>
      </section>
      <section className="auth-image">
        <img src={ColaboLogin} alt="Ilustración de Colabo" loading="lazy" />
      </section>
    </main>
  );
}
