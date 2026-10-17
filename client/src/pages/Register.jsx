import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import AuthField from "@components/AuthField";
import "@/styles/register.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
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
      navigate("/");
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
    <main className="auth-page">
      <section className="auth-image"></section>

      <section className="auth-panel" aria-labelledby="auth-title">
        <h1 id="auth-title" className="auth-title">
          ¡Bienvenido!
        </h1>
        <span className="auth-description">
          Registrate para crear tu cuenta
        </span>
        {error("general")}

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthField
            label={"Nombre"}
            input={{
              type: "text",
              id: "nombre",
              name: "nombre",
              autoComplete: "name",
              value: form.nombre,
              onChange: handleChange,
              "aria-invalid": Boolean(errors.nombre),
              required: true,
              error: error("nombre")
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
              error: error("email")
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
              error: error("password")
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
              error: error("password_confirmation")
            }}
          />

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}
