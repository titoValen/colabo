import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import AuthField from "@components/AuthField";
import ColaboLogin from "@/assets/illustration/colabo_register.webp";
import Logo from "@/assets/colabo_logo.svg";
import "@/styles/auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((current) => ({ ...current, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      setErrors({ password: ["Las contraseñas no coinciden."] });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await register(form);
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setErrors(
        err.errors && Object.keys(err.errors).length
          ? err.errors
          : { general: [err.message] },
      );
    } finally {
      setLoading(false);
    }
  };

  const error = (campo) =>
    errors[campo]?.[0] && (
      <p className="auth-error" role="alert">
        {errors[campo][0]}
      </p>
    );

  return (
    <main className="auth-page auth-page-register">
      <section className="auth-image">
        <img src={ColaboLogin} alt="Ilustración de Colabo" loading="lazy" />
      </section>

      <section
        className="auth-panel auth-panel-register"
        aria-labelledby="auth-title"
      >
        <figure className="auth-logo auth-logo-register">
          <img src={Logo} alt="Logo de Colabo" />
        </figure>
        <h1 id="auth-title" className="auth-title">
          ¡Bienvenido!
        </h1>
        <span className="auth-description">
          Registrate para crear tu cuenta
        </span>
        {error("general")}

        <form className="auth-form auth-form-register" onSubmit={handleSubmit}>
          <AuthField
            label={"Nombre"}
            input={{
              type: "text",
              id: "name",
              name: "name",
              autoComplete: "name",
              value: form.name,
              onChange: handleChange,
              "aria-invalid": Boolean(errors.name),
              required: true,
              error: error("name"),
            }}
          />

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
              error: error("email"),
            }}
          />

          <AuthField
            label={"Contraseña"}
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
            label={"Repetir contraseña"}
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

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        
        <div className="auth-links">
          <p className="auth-switch">
            ¿Aún no tienes cuenta? <Link to="/iniciar-sesion">Iniciar sesión</Link>
          </p>
          <p className="auth-switch">
            Volver al <Link to="/">inicio</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
