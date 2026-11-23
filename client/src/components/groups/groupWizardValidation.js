import {
  IMAGE_MAX_BYTES,
  IMAGE_TYPES,
  MEMBER_LIMIT_FREE,
  MEMBER_LIMIT_MIN,
} from "@/components/groups/groupWizardConfig";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateImage(file) {
  if (!file) return "";
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Elige una imagen JPG, PNG o WebP.";
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return "La imagen pesa más de 2 MB. Prueba con una más liviana.";
  }
  return "";
}

export function validateInvitee(value, invitees, memberLimit) {
  const invitee = value.trim();

  if (invitee.length < 2) {
    return "Escribí un nombre de usuario o un correo electrónico.";
  }
  if (invitee.includes("@") && !EMAIL_PATTERN.test(invitee)) {
    return "Ese correo electrónico no parece válido.";
  }
  if (invitees.some((item) => item.toLowerCase() === invitee.toLowerCase())) {
    return "Ya agregaste a esa persona.";
  }
  if (invitees.length + 1 >= memberLimit) {
    return `Con un límite de ${memberLimit} integrantes puedes invitar hasta ${memberLimit - 1} personas.`;
  }
  return "";
}

export function validateIdentity({ name, description }) {
  const errors = {};

  if (!name.trim()) errors.name = "Coloca un nombre para tu grupo.";
  else if (name.trim().length > 80) {
    errors.name = "El nombre puede tener hasta 80 caracteres.";
  }
  if (description.length > 500) {
    errors.description = "La descripción puede tener hasta 500 caracteres.";
  }

  return errors;
}

export function validateMembers({ invitees, memberLimit }) {
  const errors = {};

  if (
    !Number.isInteger(memberLimit) ||
    memberLimit < MEMBER_LIMIT_MIN ||
    memberLimit > MEMBER_LIMIT_FREE
  ) {
    errors.memberLimit = `El límite debe estar entre ${MEMBER_LIMIT_MIN} y ${MEMBER_LIMIT_FREE} integrantes.`;
  } else if (invitees.length + 1 > memberLimit) {
    errors.memberLimit = `Invitaste a ${invitees.length} personas y el límite es de ${memberLimit} integrantes. Subí el límite o quitá invitaciones.`;
  }

  return errors;
}

export function validateOrganization({ task, expenses, purpose }) {
  const errors = {};

  if (purpose.length > 500) {
    errors.purpose = "El propósito puede tener hasta 500 caracteres.";
  }

  const hasTaskDetails =
    task.description.trim() || task.dueDate || task.title.trim();
  if (hasTaskDetails && !task.title.trim()) {
    errors["task.title"] =
      "Coloca un título para la tarea o deja vacíos los demás campos.";
  }

  if (expenses.enabled) {
    if (expenses.budget !== "" && Number(expenses.budget) < 0) {
      errors["expenses.budget"] = "El presupuesto no puede ser negativo.";
    }
    if (
      expenses.split === "contribution" &&
      !(Number(expenses.contribution) > 0)
    ) {
      errors["expenses.contribution"] =
        "Indicá cuánto aporta cada integrante (mayor a cero).";
    }
  }

  return errors;
}

export const STEP_VALIDATORS = [
  (form) => validateIdentity(form.identity),
  (form) => validateMembers(form.members),
  (form) => validateOrganization(form.organization),
];

export function buildGroupPayload({ identity, members, organization }) {
  const { task, expenses } = organization;
  const toNumber = (value) => (value === "" ? null : Number(value));

  return {
    name: identity.name.trim(),
    description: identity.description.trim() || null,
    category: identity.category,
    color: identity.color,
    avatar_preset: identity.avatarPreset,
    member_limit: members.memberLimit,
    members_can_invite: members.permissions.invite,
    members_can_create_tasks: members.permissions.createTasks,
    members_can_add_expenses: members.permissions.addExpenses,
    invite_code: members.inviteCode || null,
    invitees: members.invitees,
    purpose: organization.purpose.trim() || null,
    goals: organization.goals,
    important_dates: organization.dates.map(({ title, date }) => ({
      title: title.trim(),
      date,
    })),
    rules: organization.rules.map(
      ({ type, description, requiresAcceptance }) => ({
        type,
        description: description.trim(),
        requires_acceptance: requiresAcceptance,
      }),
    ),
    task: task.title.trim()
      ? {
          title: task.title.trim(),
          description: task.description.trim() || null,
          due_date: task.dueDate || null,
        }
      : null,
    expenses: expenses.enabled
      ? {
          currency: expenses.currency,
          budget: toNumber(expenses.budget),
          split: expenses.split,
          contribution_amount:
            expenses.split === "contribution"
              ? toNumber(expenses.contribution)
              : null,
        }
      : null,
  };
}
