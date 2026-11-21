import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { apiFetch } from "@/services/api";
import LockIcon from "@/assets/icons/lock.svg";
import ShieldIcon from "@/assets/icons/shield.svg";
import ChevronIcon from "@/assets/icons/chevron_down.svg";
import "@/styles/profile/profile-security.css";

const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_UPDATED_MESSAGE =
  "Tu contraseña se actualizó. Cerramos tus otras sesiones por seguridad.";
const EMPTY_FORM = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

function PasswordField({ label, name, autoComplete, value, error, showPassword, ...inputProps }) {
  const id = `security-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="profile-security-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="profile-security-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ProfileSecurity() {
  const { token, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const closePanel = () => {
    setIsOpen(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowPasswords(false);
  };

  const togglePanel = () => {
    if (isOpen) {
      closePanel();
      return;
    }

    setSuccessMessage("");
    setIsOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: ["Las contraseñas no coinciden."] });
      return;
    }

    if (form.password === form.current_password) {
      setErrors({ password: ["La nueva contraseña debe ser distinta a la actual."] });
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      await apiFetch("/password", { method: "PUT", body: form, token });
      closePanel();
      setSuccessMessage(PASSWORD_UPDATED_MESSAGE);
    } catch (error) {
      setErrors(
        error.errors && Object.keys(error.errors).length
          ? error.errors
          : { general: [error.message] },
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fieldError = (field) => errors[field]?.[0];

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteAccount();
      navigate("/iniciar-sesion", { replace: true });
    } catch (error) {
      setDeleteError(error.message);
      setIsDeleting(false);
    }
  };

  return (
    <section className="profile-card">
      <h2 className="profile-card-title">
        <img src={LockIcon} alt="" />
        Seguridad
      </h2>

      <ul className="profile-nav-list">
        <li className="profile-nav-group">
          <button
            type="button"
            className="profile-nav-trigger"
            aria-expanded={isOpen}
            aria-controls="change-password-panel"
            onClick={togglePanel}
          >
            <img src={LockIcon} alt="" />
            <span className="profile-nav-text">
              <span className="profile-nav-title">Cambiar contraseña</span>
              <span className="profile-nav-description">
                Actualiza tu contraseña para mayor seguridad.
              </span>
            </span>
            <img src={ChevronIcon} alt="" className="profile-nav-chevron" />
          </button>

          {successMessage && (
            <p className="profile-security-success" role="status">
              {successMessage}
            </p>
          )}

          {isOpen && (
            <form
              id="change-password-panel"
              className="profile-security-form"
              onSubmit={handleSubmit}
            >
              {fieldError("general") && (
                <p className="profile-security-error" role="alert">
                  {fieldError("general")}
                </p>
              )}

              <PasswordField
                label="Contraseña actual"
                name="current_password"
                autoComplete="current-password"
                value={form.current_password}
                error={fieldError("current_password")}
                showPassword={showPasswords}
                onChange={handleChange}
                disabled={isSaving}
                autoFocus
              />

              <PasswordField
                label="Nueva contraseña"
                name="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                value={form.password}
                error={fieldError("password")}
                showPassword={showPasswords}
                onChange={handleChange}
                disabled={isSaving}
              />

              <PasswordField
                label="Repetir nueva contraseña"
                name="password_confirmation"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                value={form.password_confirmation}
                error={fieldError("password_confirmation")}
                showPassword={showPasswords}
                onChange={handleChange}
                disabled={isSaving}
              />

              <label className="profile-security-toggle">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(event) => setShowPasswords(event.target.checked)}
                />
                Mostrar contraseñas
              </label>

              <div className="profile-security-actions">
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? "Guardando…" : "Guardar contraseña"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closePanel}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </li>

        <li className="profile-nav-group">
          <div className="profile-delete-account">
            <img src={ShieldIcon} alt="" className="profile-delete-icon" />
            <span className="profile-nav-text">
              <span className="profile-nav-title">Eliminar cuenta</span>
              <span className="profile-nav-description">
                Se eliminarán permanentemente tu cuenta y tus datos.
              </span>
            </span>
            <button
              type="button"
              className="btn profile-delete-button"
              onClick={() => {
                setDeleteError("");
                setIsDeleteModalOpen(true);
              }}
            >
              Eliminar cuenta
            </button>
          </div>
        </li>
      </ul>

      {isDeleteModalOpen && (
        <div
          className="profile-delete-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setIsDeleteModalOpen(false);
            }
          }}
        >
          <div
            className="profile-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <h2 id="delete-account-title">¿Eliminar la cuenta?</h2>
            <p>
              Esta acción es permanente. Se eliminarán tu cuenta y todos los
              datos asociados.
            </p>
            {deleteError && (
              <p className="profile-security-error" role="alert">
                {deleteError}
              </p>
            )}
            <div className="profile-security-actions">
              <button
                type="button"
                className="btn profile-delete-confirm"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando…" : "Sí, eliminar cuenta"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
