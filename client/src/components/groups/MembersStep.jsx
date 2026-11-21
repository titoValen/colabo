import { useState } from "react";
import CollapsibleSection from "@/components/groups/CollapsibleSection";
import InviteLinkCard from "@/components/groups/InviteLinkCard";
import ItemList from "@/components/groups/ItemList";
import ToggleSwitch from "@/components/groups/ToggleSwitch";
import WizardStepLayout from "@/components/groups/WizardStepLayout";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import {
  MEMBER_LIMIT_FREE,
  MEMBER_LIMIT_MIN,
  MEMBER_LIMIT_PLUS,
  createInviteCode,
} from "@/components/groups/groupWizardConfig";
import { validateInvitee } from "@/components/groups/groupWizardValidation";
import { Link } from "react-router";
import InviteIllustration from "@/assets/illustration/colabo_paso_2.webp";

const PERMISSIONS = [
  { key: "invite", label: "Pueden invitar a otras personas" },
  { key: "createTasks", label: "Pueden crear tareas" },
  { key: "addExpenses", label: "Pueden registrar gastos" },
];

export default function MembersStep({ value, user, errors, onChange, headingRef }) {
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const avatar = user?.avatar_preference;

  const addInvitee = () => {
    const error = validateInvitee(draft, value.invitees, value.memberLimit);
    setDraftError(error);
    if (error) return;

    onChange({ invitees: [...value.invitees, draft.trim()] });
    setDraft("");
  };

  const handleDraftKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addInvitee();
  };

  const setLimit = (limit) =>
    onChange({
      memberLimit: Math.min(MEMBER_LIMIT_FREE, Math.max(MEMBER_LIMIT_MIN, limit)),
    });

  const enabledPermissions = PERMISSIONS.filter(
    ({ key }) => value.permissions[key],
  ).length;

  return (
    <WizardStepLayout
      eyebrow="Etapa 2 · Integrantes"
      title="¿Quiénes forman parte?"
      description="Invitar es opcional: puedes crear el grupo solo y sumar personas más tarde."
      illustration={InviteIllustration}
      headingRef={headingRef}
      aside={
        <div className="wizard-tip">
          <strong>Tranquilidad total</strong>
          <p>
            Siempre podrá invitar, quitar personas y cambiar los permisos desde el grupo.
          </p>
        </div>
      }
    >
      <div className="wizard-fields">
        <div className="role-cards">
          <article className="role-card is-you">
            <ProfileAvatar
              name={user?.name}
              seed={user?.email}
              shape={avatar?.blobatar_shape}
              color={avatar?.avatar_color}
              style={avatar?.avatar_style}
              size="sm"
            />
            <div>
              <h3>
                {user?.name ?? "Usuario actual"} <span className="role-pill">Administrador</span>
              </h3>
              <p>Controla la configuración y administración del grupo. Se asigna automáticamente.</p>
            </div>
          </article>
          <article className="role-card">
            <span className="role-card-icon" aria-hidden="true" />
            <div>
              <h3>
                Integrantes <span className="role-pill is-soft">Integrante</span>
              </h3>
              <p>Participan en las actividades, tareas y acuerdos del grupo.</p>
            </div>
          </article>
        </div>

        <fieldset className="wizard-fieldset">
          <legend className="wizard-label">
            Invitar personas
            <span className="wizard-tag">Opcional</span>
          </legend>
          <div className="add-row">
            <input
              id="invitee-input"
              className="wizard-input"
              value={draft}
              placeholder="Nombre de usuario o correo electrónico"
              aria-invalid={Boolean(draftError)}
              aria-describedby={draftError ? "invitee-error" : undefined}
              onChange={(event) => {
                setDraft(event.target.value);
                setDraftError("");
              }}
              onKeyDown={handleDraftKeyDown}
              autoComplete="off"
            />
            <button type="button" className="btn btn-secondary" onClick={addInvitee}>
              Agregar
            </button>
          </div>
          {draftError && (
            <p className="wizard-error" id="invitee-error" role="alert">
              {draftError}
            </p>
          )}
          <ItemList
            label="Personas invitadas"
            items={value.invitees}
            getLabel={(invitee) => invitee}
            onRemove={(index) =>
              onChange({
                invitees: value.invitees.filter((_, position) => position !== index),
              })
            }
          />
        </fieldset>

        <fieldset className="wizard-fieldset">
          <legend className="wizard-label">
            Enlace y código QR
            <span className="wizard-tag">Opcional</span>
          </legend>
          <InviteLinkCard
            code={value.inviteCode}
            onGenerate={() => onChange({ inviteCode: createInviteCode() })}
            onRemove={() => onChange({ inviteCode: "" })}
          />
        </fieldset>

        <CollapsibleSection
          id="members-settings"
          badge={
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
          title="Límite y permisos"
          description="Ya viene configurado con valores recomendados."
          summary={
            isSettingsOpen
              ? ""
              : `Hasta ${value.memberLimit} integrantes · ${enabledPermissions} permisos activos`
          }
          isOpen={isSettingsOpen || Boolean(errors.memberLimit)}
          onToggle={() => setIsSettingsOpen((open) => !open)}
        >
          <div className="limit-control">
            <div>
              <p className="wizard-label" id="limit-label">
                Límite de participantes
              </p>
              <p className="wizard-hint">
                Tu plan permite hasta {MEMBER_LIMIT_FREE} integrantes.{" "}
                <Link to="/precios">Con Colabo Plus puedes sumar hasta {MEMBER_LIMIT_PLUS}</Link>.
              </p>
            </div>
            <div className="stepper-control" role="group" aria-labelledby="limit-label">
              <button
                type="button"
                aria-label="Reducir límite"
                onClick={() => setLimit(value.memberLimit - 1)}
                disabled={value.memberLimit <= MEMBER_LIMIT_MIN}
              >
                −
              </button>
              <output aria-live="polite">{value.memberLimit}</output>
              <button
                type="button"
                aria-label="Aumentar límite"
                onClick={() => setLimit(value.memberLimit + 1)}
                disabled={value.memberLimit >= MEMBER_LIMIT_FREE}
              >
                +
              </button>
            </div>
          </div>
          {errors.memberLimit && (
            <p className="wizard-error" id="member-limit-error" role="alert">
              {errors.memberLimit}
            </p>
          )}

          <p className="wizard-label permissions-title">Permisos de los integrantes</p>
          <div className="switch-list">
            {PERMISSIONS.map(({ key, label }) => (
              <ToggleSwitch
                key={key}
                id={`permission-${key}`}
                label={label}
                checked={value.permissions[key]}
                onChange={(checked) =>
                  onChange({ permissions: { ...value.permissions, [key]: checked } })
                }
              />
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </WizardStepLayout>
  );
}
