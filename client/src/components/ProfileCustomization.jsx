import { useState } from "react";
import toast from "react-hot-toast";
import PaletteIcon from "@/assets/icons/palette.svg";
import ProfileAvatar from "@components/ProfileAvatar";
import { BLOBATAR_SHAPES } from "@components/blobatarShapes";

const COLOR_OPTIONS = [
  { value: "#cb4528", label: "Naranja" },
  { value: "#6196bd", label: "Celeste" },
  { value: "#e87961", label: "Coral" },
  { value: "#243b53", label: "Azul oscuro" },
  { value: "#7c5cbf", label: "Violeta" },
];

const AVATAR_STYLE_OPTIONS = [
  { value: "initials", label: "Logo con inicial" },
  { value: "blobatar", label: "Blobatar" },
];

export default function ProfileCustomization({
  name,
  seed,
  avatarColor,
  avatarStyle,
  blobatarShape,
  hasChanges,
  onSave,
  onAvatarColorChange,
  onAvatarStyleChange,
  onBlobatarShapeChange,
}) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      toast.success("Personalización guardada.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="profile-card">
      <h2 className="profile-card-title">
        <img src={PaletteIcon} alt="" />
        Personalización
      </h2>

      <div className="profile-customization-block">
        <p className="profile-customization-label">Color de tu perfil</p>
        <p className="profile-customization-hint">
          Elegí un color para identificar tus grupos.
        </p>

        <div className="profile-color-options" role="radiogroup" aria-label="Color de tu perfil">
          {COLOR_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={avatarColor === value}
              aria-label={label}
              className={`profile-color-swatch${avatarColor === value ? " is-selected" : ""}`}
              style={{ backgroundColor: value }}
              onClick={() => onAvatarColorChange(value)}
            />
          ))}
        </div>
      </div>

      <div className="profile-customization-block">
        <p className="profile-customization-label">Estilo de avatar</p>
        <p className="profile-customization-hint">
          Usá tu inicial o probá un blobatar, una criaturita única generada a partir de tu cuenta.
        </p>

        <div className="profile-avatar-style-options" role="radiogroup" aria-label="Estilo de avatar">
          {AVATAR_STYLE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={avatarStyle === value}
              className={`profile-avatar-style-option${avatarStyle === value ? " is-selected" : ""}`}
              onClick={() => onAvatarStyleChange(value)}
            >
              <ProfileAvatar name={name} seed={seed} color={avatarColor} style={value} size="sm" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {avatarStyle === "blobatar" && (
        <div className="profile-customization-block">
          <p className="profile-customization-label">Forma del blobatar</p>
          <p className="profile-customization-hint">
            Dejá que se elija sola según tu cuenta o fijá la forma que más te guste.
          </p>

          <div className="profile-shape-options" role="radiogroup" aria-label="Forma del blobatar">
            <button
              type="button"
              role="radio"
              aria-checked={!blobatarShape}
              aria-label="Automática"
              className={`profile-shape-option${!blobatarShape ? " is-selected" : ""}`}
              onClick={() => onBlobatarShapeChange(null)}
            >
              <ProfileAvatar name={name} seed={seed} color={avatarColor} style="blobatar" size="md" />
              <span>Automática</span>
            </button>

            {BLOBATAR_SHAPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={blobatarShape === value}
                aria-label={label}
                className={`profile-shape-option${blobatarShape === value ? " is-selected" : ""}`}
                onClick={() => onBlobatarShapeChange(value)}
              >
                <ProfileAvatar
                  name={name}
                  seed={seed}
                  shape={value}
                  color={avatarColor}
                  style="blobatar"
                  size="md"
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="profile-form-actions">
        <button
          type="button"
          className="profile-save-button"
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </section>
  );
}
