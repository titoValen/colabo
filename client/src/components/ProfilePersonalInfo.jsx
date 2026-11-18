import { useState } from "react";
import toast from "react-hot-toast";
import ProfileIcon from "@/assets/icons/profile.svg";

const BIO_MAX_LENGTH = 500;

export default function ProfilePersonalInfo({
  name,
  email,
  location,
  bio,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name, email, location, bio });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setForm({
      name: name ?? "",
      email: email ?? "",
      location: location ?? "",
      bio: bio ?? "",
    });
    setErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((current) => ({ ...current, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setErrors({});
    try {
      await onSave(form);
      toast.success("Información personal actualizada.");
      setIsEditing(false);
    } catch (err) {
      setErrors(
        err.errors && Object.keys(err.errors).length
          ? err.errors
          : { general: [err.message] },
      );
    } finally {
      setSaving(false);
    }
  };

  const error = (field) =>
    errors[field]?.[0] && (
      <p className="profile-error" role="alert">
        {errors[field][0]}
      </p>
    );

  return (
    <section className="profile-card">
      <div className="profile-card-header">
        <h2 className="profile-card-title">
          <img src={ProfileIcon} alt="" />
          Información personal
        </h2>
        {!isEditing && (
          <button
            type="button"
            className="profile-edit-button"
            onClick={startEditing}
          >
            Editar
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          {error("general")}

          <dl className="profile-info-list">
            <div className="profile-info-row">
              <dt>
                <label htmlFor="profile-name">Nombre</label>
              </dt>
              <dd>
                <input
                  className="profile-input"
                  type="text"
                  id="profile-name"
                  name="name"
                  autoComplete="name"
                  maxLength={255}
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.name)}
                  required
                />
                {error("name")}
              </dd>
            </div>
            <div className="profile-info-row">
              <dt>
                <label htmlFor="profile-email">Email</label>
              </dt>
              <dd>
                <input
                  className="profile-input"
                  type="email"
                  id="profile-email"
                  name="email"
                  autoComplete="email"
                  maxLength={255}
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  required
                />
                {error("email")}
              </dd>
            </div>
            <div className="profile-info-row">
              <dt>
                <label htmlFor="profile-location">Ubicación</label>
              </dt>
              <dd>
                <input
                  className="profile-input"
                  type="text"
                  id="profile-location"
                  name="location"
                  autoComplete="address-level2"
                  maxLength={255}
                  value={form.location}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.location)}
                />
                {error("location")}
              </dd>
            </div>
            <div className="profile-info-row profile-info-row--block">
              <dt>
                <label htmlFor="profile-bio">Biografía</label>
              </dt>
              <dd>
                <textarea
                  className="profile-input profile-textarea"
                  id="profile-bio"
                  name="bio"
                  rows={4}
                  maxLength={BIO_MAX_LENGTH}
                  value={form.bio}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.bio)}
                />
                <span className="profile-counter">
                  {form.bio.length}/{BIO_MAX_LENGTH}
                </span>
                {error("bio")}
              </dd>
            </div>
          </dl>

          <div className="profile-form-actions">
            <button
              type="button"
              className="profile-cancel-button"
              onClick={cancelEditing}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      ) : (
        <dl className="profile-info-list">
          <div className="profile-info-row">
            <dt>Nombre</dt>
            <dd>{name}</dd>
          </div>
          <div className="profile-info-row">
            <dt>Email</dt>
            <dd>{email}</dd>
          </div>
          <div className="profile-info-row">
            <dt>Ubicación</dt>
            <dd className={location ? undefined : "is-empty"}>
              {location || "Sin especificar"}
            </dd>
          </div>
          <div className="profile-info-row profile-info-row--block">
            <dt>Biografía</dt>
            <dd className={bio ? undefined : "is-empty"}>
              {bio || "Sin especificar"}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
