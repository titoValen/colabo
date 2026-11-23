import { useRef, useState } from "react";
import ChoiceGroup from "@/components/groups/ChoiceGroup";
import GroupPreview from "@/components/groups/GroupPreview";
import WizardField from "@/components/groups/WizardField";
import WizardStepLayout from "@/components/groups/WizardStepLayout";
import {
  AVATAR_PRESETS,
  GROUP_CATEGORIES,
  GROUP_COLORS,
} from "@/components/groups/groupWizardConfig";
import { validateImage } from "@/components/groups/groupWizardValidation";
import NewGroupIllustration from "@/assets/illustration/colabo_new_group.webp";

const NAME_MAX = 80;
const DESCRIPTION_MAX = 500;
const EMPTY_IMAGE = { file: null, preview: null };

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function IdentityStep({
  value,
  errors,
  onChange,
  headingRef,
  memberLabel,
}) {
  const [imageErrors, setImageErrors] = useState({});
  const avatarInput = useRef(null);
  const coverInput = useRef(null);

  const handleImage = async (kind, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const error = validateImage(file);
    setImageErrors((current) => ({ ...current, [kind]: error }));
    if (error) return;

    try {
      onChange({ [kind]: { file, preview: await readAsDataUrl(file) } });
    } catch {
      setImageErrors((current) => ({
        ...current,
        [kind]: "No pudimos leer esa imagen. Prueba con otra.",
      }));
    }
  };

  const removeImage = (kind) => {
    setImageErrors((current) => ({ ...current, [kind]: "" }));
    onChange({ [kind]: EMPTY_IMAGE });
  };

  return (
    <WizardStepLayout
      eyebrow="Etapa 1 · Identidad"
      title="¿Cómo se va a llamar tu grupo?"
      description="Asigna un nombre y personalidad. Puedes cambiar todo esto después."
      illustration={NewGroupIllustration}
      headingRef={headingRef}
      aside={
        <GroupPreview
          name={value.name.trim()}
          description={value.description.trim()}
          category={value.category}
          color={value.color}
          preset={value.avatarPreset}
          avatarUrl={value.avatar.preview}
          coverUrl={value.cover.preview}
          memberLabel={memberLabel}
        />
      }
    >
      <div className="wizard-fields">
        <WizardField
          id="group-name"
          label="Nombre del grupo"
          required
          error={errors.name}
          counter={`${value.name.length}/${NAME_MAX}`}
        >
          <input
            id="group-name"
            className="wizard-input"
            value={value.name}
            maxLength={NAME_MAX}
            placeholder="Ej: Los del depto, Viaje a Bariloche…"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "group-name-error" : undefined}
            onChange={(event) => onChange({ name: event.target.value })}
            autoComplete="off"
          />
        </WizardField>

        <WizardField
          id="group-description"
          label="Descripción"
          hint="Contale al grupo de qué se trata."
          error={errors.description}
          counter={`${value.description.length}/${DESCRIPTION_MAX}`}
        >
          <textarea
            id="group-description"
            className="wizard-input wizard-textarea"
            rows={3}
            value={value.description}
            maxLength={DESCRIPTION_MAX}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "group-description-error" : "group-description-hint"
            }
            onChange={(event) => onChange({ description: event.target.value })}
          />
        </WizardField>

        <ChoiceGroup
          name="group-category"
          legend="Categoría"
          tag="Obligatorio"
          options={GROUP_CATEGORIES.map((category) => ({
            value: category,
            label: category,
          }))}
          value={value.category}
          onChange={(category) => onChange({ category })}
        />

        <fieldset className="wizard-fieldset">
          <legend className="wizard-label">
            Imagen de perfil
            <span className="wizard-tag">Opcional</span>
          </legend>
          <div className="avatar-picker" role="radiogroup" aria-label="Imágenes predeterminadas">
            {AVATAR_PRESETS.map((preset) => {
              const isSelected =
                !value.avatar.preview && value.avatarPreset === preset.key;

              return (
                <button
                  key={preset.key}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={preset.label}
                  title={preset.label}
                  className={`avatar-option${isSelected ? " is-selected" : ""}`}
                  style={{ backgroundColor: value.color }}
                  onClick={() => {
                    removeImage("avatar");
                    onChange({ avatarPreset: preset.key });
                  }}
                >
                  <img src={preset.icon} alt="" />
                </button>
              );
            })}
          </div>

          <div className="upload-row">
            <input
              ref={avatarInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="wizard-sr-only"
              tabIndex={-1}
              onChange={(event) => handleImage("avatar", event)}
            />
            <button
              type="button"
              className="wizard-link-button"
              onClick={() => avatarInput.current?.click()}
            >
              {value.avatar.preview ? "Cambiar imagen" : "Subir mi propia imagen"}
            </button>
            {value.avatar.preview && (
              <button
                type="button"
                className="wizard-link-button is-muted"
                onClick={() => removeImage("avatar")}
              >
                Quitar
              </button>
            )}
            <span className="wizard-hint">JPG, PNG o WebP · máx. 2 MB</span>
          </div>
          {imageErrors.avatar && (
            <p className="wizard-error" role="alert">
              {imageErrors.avatar}
            </p>
          )}
        </fieldset>

        <fieldset className="wizard-fieldset">
          <legend className="wizard-label">
            Imagen de portada
            <span className="wizard-tag">Opcional</span>
          </legend>
          <input
            ref={coverInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="wizard-sr-only"
            tabIndex={-1}
            onChange={(event) => handleImage("cover", event)}
          />
          <button
            type="button"
            className={`cover-picker${value.cover.preview ? " has-image" : ""}`}
            style={{
              backgroundImage: value.cover.preview
                ? `url("${value.cover.preview}")`
                : undefined,
            }}
            onClick={() => coverInput.current?.click()}
          >
            <span className="cover-picker-text">
              {value.cover.preview ? "Cambiar portada" : "Agregar una portada"}
            </span>
          </button>
          {value.cover.preview && (
            <div className="upload-row">
              <button
                type="button"
                className="wizard-link-button is-muted"
                onClick={() => removeImage("cover")}
              >
                Quitar portada
              </button>
            </div>
          )}
          {imageErrors.cover && (
            <p className="wizard-error" role="alert">
              {imageErrors.cover}
            </p>
          )}
        </fieldset>

        <fieldset className="wizard-fieldset">
          <legend className="wizard-label">
            Color del grupo
            <span className="wizard-tag">Opcional</span>
          </legend>
          <div className="color-picker" role="radiogroup" aria-label="Color identificador">
            {GROUP_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                role="radio"
                aria-checked={value.color === color.value}
                aria-label={color.label}
                title={color.label}
                className={`color-option${value.color === color.value ? " is-selected" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => onChange({ color: color.value })}
              />
            ))}
          </div>
        </fieldset>
      </div>
    </WizardStepLayout>
  );
}
