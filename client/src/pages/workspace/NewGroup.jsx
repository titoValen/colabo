import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import AppLayout from "@components/layout/AppLayout";
import IdentityStep from "@components/groups/IdentityStep";
import MembersStep from "@components/groups/MembersStep";
import OrganizationStep from "@components/groups/OrganizationStep";
import ReviewStep from "@components/groups/ReviewStep";
import SuccessScreen from "@components/groups/SuccessScreen";
import WizardStepper from "@components/groups/WizardStepper";
import {
  INITIAL_FORM,
  REVIEW_STEP,
  SUCCESS_STEP,
  WIZARD_STEPS,
} from "@components/groups/groupWizardConfig";
import {
  STEP_VALIDATORS,
  buildGroupPayload,
} from "@components/groups/groupWizardValidation";
import "@/styles/groups/group-wizard.css";

const REDIRECT_DELAY_MS = 3200;

const getLobbyTarget = ({ group, imageFailed }) => [
  `/grupos/${group.id}`,
  { replace: true, state: { justCreated: true, imageFailed } },
];

export default function NewGroup() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const isEditing = Boolean(groupId);
  const [form, setForm] = useState(INITIAL_FORM);
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [errors, setErrors] = useState({});
  const [returnToReview, setReturnToReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [created, setCreated] = useState(null);
  const [today] = useState(() => new Date().toLocaleDateString("en-CA"));
  const headingRef = useRef(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!isEditing) return undefined;

    let cancelled = false;
    apiFetch(`/groups/${groupId}`, { token })
      .then((data) => {
        if (cancelled) return;
        if (data.my_role !== "admin") {
          navigate(`/grupos/${groupId}`, { replace: true });
          return;
        }

        const { group, invitations, goals, rules, events, tasks } = data;
        const sharedInvitation = invitations.find((invitation) => !invitation.invitee);
        const task = tasks[0];

        setForm({
          identity: {
            name: group.name ?? "",
            description: group.description ?? "",
            category: group.type ?? "Otros",
            color: group.color,
            avatarPreset: group.avatar_preset,
            avatar: { file: null, preview: group.avatar_url },
            cover: { file: null, preview: group.cover_url },
          },
          members: {
            invitees: invitations
              .filter((invitation) => invitation.invitee)
              .map((invitation) => invitation.invitee),
            inviteCode: sharedInvitation?.code ?? "",
            memberLimit: group.member_limit,
            permissions: {
              invite: group.members_can_invite,
              createTasks: group.members_can_create_tasks,
              addExpenses: group.members_can_add_expenses,
            },
          },
          organization: {
            purpose: group.purpose ?? "",
            goals: goals.map((goal) => goal.description),
            dates: events.map((event) => ({
              title: event.title,
              date: String(event.starts_at).slice(0, 10),
            })),
            rules: rules.map((rule) => ({
              type: rule.type,
              description: rule.description,
              requiresAcceptance: rule.requires_acceptance,
            })),
            task: {
              title: task?.title ?? "",
              description: task?.description ?? "",
              dueDate: task?.due_date ? String(task.due_date).slice(0, 10) : "",
            },
            expenses: {
              enabled: group.expenses_enabled,
              currency: group.currency ?? "ARS",
              budget: group.budget ?? "",
              split: group.expense_split ?? "equal",
              contribution: group.contribution_amount ?? "",
            },
          },
        });
      })
      .catch((error) => setSubmitError(error));

    return () => {
      cancelled = true;
    };
  }, [groupId, isEditing, navigate, token]);

  // Al cambiar de etapa, el foco pasa al título para lectores de pantalla.
  useEffect(() => {
    if (!hasNavigated.current) return;
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  // Tras crear el grupo, se muestra la confirmación y se pasa al lobby.
  useEffect(() => {
    if (!created) return undefined;

    const timer = setTimeout(
      () => navigate(...getLobbyTarget(created)),
      REDIRECT_DELAY_MS,
    );

    return () => clearTimeout(timer);
  }, [created, navigate]);

  const goTo = (index) => {
    hasNavigated.current = true;
    setStep(index);
    setMaxReached((current) => Math.max(current, index));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateSection = (section, patch) => {
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], ...patch },
    }));
    setErrors({});
    setSubmitError(null);
  };

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const target =
        document.querySelector('[aria-invalid="true"]') ??
        document.querySelector(".wizard-error");

      target?.scrollIntoView({ block: "center" });
      target?.focus?.();
    });

  const validateStep = (index) => {
    const found = STEP_VALIDATORS[index](form);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      focusFirstError();
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateStep(step)) return;

    goTo(returnToReview ? REVIEW_STEP : step + 1);
    setReturnToReview(false);
  };

  const handleEdit = (index) => {
    setReturnToReview(returnToReview || step === REVIEW_STEP);
    setErrors({});
    goTo(index);
  };

  const handleConfirm = async () => {
    for (let index = 0; index < WIZARD_STEPS.length; index += 1) {
      const found = STEP_VALIDATORS[index](form);

      if (Object.keys(found).length > 0) {
        setErrors(found);
        setReturnToReview(true);
        goTo(index);
        focusFirstError();
        return;
      }
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditing) {
        const payload = buildGroupPayload(form);
        payload.invite_code = null;

        const { group } = await apiFetch(`/groups/${groupId}`, {
          method: "PATCH",
          body: payload,
          token,
        });

        const { avatar, cover } = form.identity;
        if (avatar.file || cover.file) {
          const images = new FormData();
          if (avatar.file) images.append("avatar", avatar.file);
          if (cover.file) images.append("cover", cover.file);

          await apiFetch(`/groups/${group.id}/images`, {
            method: "POST",
            body: images,
            token,
          }).catch(() => {
            toast.error("El grupo se actualizó, pero no pudimos subir las imágenes.");
          });
        }

        toast.success("Los cambios del grupo fueron guardados.");
        navigate(`/grupos/${group.id}`, { replace: true });
        return;
      }

      const { group } = await apiFetch("/groups", {
        method: "POST",
        body: buildGroupPayload(form),
        token,
      });

      // Las imágenes se suben aparte: si fallan, el grupo igual queda creado.
      let imageFailed = false;
      const { avatar, cover } = form.identity;

      if (avatar.file || cover.file) {
        const images = new FormData();
        if (avatar.file) images.append("avatar", avatar.file);
        if (cover.file) images.append("cover", cover.file);

        try {
          await apiFetch(`/groups/${group.id}/images`, {
            method: "POST",
            body: images,
            token,
          });
        } catch {
          imageFailed = true;
        }
      }

      setCreated({ group, imageFailed });
      goTo(SUCCESS_STEP);
    } catch (error) {
      setSubmitError({
        message: error.message,
        details: Object.values(error.errors ?? {})
          .flat()
          .slice(0, 3),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (step === REVIEW_STEP) handleConfirm();
    else handleContinue();
  };

  const invitedCount = form.members.invitees.length;
  const memberLabel =
    invitedCount > 0
      ? `${invitedCount + 1} integrantes · ${invitedCount} por invitar`
      : "1 integrante · vos";

  const primaryLabel =
    step === REVIEW_STEP
      ? submitting
        ? isEditing
          ? "Guardando cambios…"
          : "Creando grupo…"
        : isEditing
          ? "Guardar cambios"
          : "Crear grupo"
      : returnToReview
        ? "Guardar y volver al resumen"
        : step === WIZARD_STEPS.length - 1
          ? isEditing
            ? "Revisar y guardar"
            : "Revisar y crear"
          : "Continuar";

  return (
    <AppLayout>
      <header className="wizard-header">
        <div>
          <h1>{isEditing ? "Editar grupo" : "Crear un nuevo grupo"}</h1>
          <p>
            {isEditing
              ? "Actualizá la información y la organización de tu grupo."
              : "Es rápido y sencillo. Después lo organizás en profundidad."}
          </p>
        </div>
        {step < SUCCESS_STEP && (
          <Link to="/grupos" className="btn btn-secondary">
            Cancelar
          </Link>
        )}
      </header>

      <div className="wizard">
        {step < SUCCESS_STEP && (
          <WizardStepper
            steps={WIZARD_STEPS}
            current={step}
            maxReached={maxReached}
            onSelect={handleEdit}
          />
        )}

        {step === SUCCESS_STEP && created ? (
          <SuccessScreen
            groupName={created.group.name}
            delayMs={REDIRECT_DELAY_MS}
            onContinue={() => navigate(...getLobbyTarget(created))}
          />
        ) : (
          <form className="wizard-stage" key={step} onSubmit={handleSubmit} noValidate>
            {step === 0 && (
              <IdentityStep
                value={form.identity}
                errors={errors}
                memberLabel={memberLabel}
                headingRef={headingRef}
                onChange={(patch) => updateSection("identity", patch)}
              />
            )}
            {step === 1 && (
              <MembersStep
                value={form.members}
                user={user}
                errors={errors}
                headingRef={headingRef}
                onChange={(patch) => updateSection("members", patch)}
              />
            )}
            {step === 2 && (
              <OrganizationStep
                value={form.organization}
                user={user}
                errors={errors}
                today={today}
                headingRef={headingRef}
                onChange={(patch) => updateSection("organization", patch)}
              />
            )}
            {step === REVIEW_STEP && (
              <ReviewStep
                form={form}
                user={user}
                memberLabel={memberLabel}
                headingRef={headingRef}
                onEdit={handleEdit}
              />
            )}

            {submitError && (
              <div className="wizard-alert" role="alert">
                <strong>{submitError.message}</strong>
                {submitError.details.length > 0 && (
                  <ul>
                    {submitError.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
                <p>Tus datos siguen acá: podés reintentar cuando quieras.</p>
              </div>
            )}

            <div className="wizard-actions">
              {step > 0 ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => goTo(step - 1)}
                  disabled={submitting}
                >
                  Volver
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {primaryLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
