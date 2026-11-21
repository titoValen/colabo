import GroupsIcon from "@/assets/icons/groups.svg";
import EventsIcon from "@/assets/icons/events.svg";
import TasksIcon from "@/assets/icons/tasks.svg";
import ExpensesIcon from "@/assets/icons/expenses.svg";
import AgreementsIcon from "@/assets/icons/agreements.svg";
import HomeIcon from "@/assets/icons/home.svg";
import GlobeIcon from "@/assets/icons/globe.svg";
import EquipmentIcon from "@/assets/icons/equipment.svg";

export const WIZARD_STEPS = [
  { id: "identity", label: "Identidad" },
  { id: "members", label: "Integrantes" },
  { id: "organization", label: "Organización" },
];

export const REVIEW_STEP = WIZARD_STEPS.length;
export const SUCCESS_STEP = WIZARD_STEPS.length + 1;

export const GROUP_CATEGORIES = [
  "Amigos",
  "Familia",
  "Pareja",
  "Viajes",
  "Eventos y salidas",
  "Estudios",
  "Proyectos",
  "Convivencia",
  "Otros",
];

export const GROUP_COLORS = [
  { value: "#cb4528", label: "Terracota" },
  { value: "#e87961", label: "Coral" },
  { value: "#6196bd", label: "Azul" },
  { value: "#243b53", label: "Azul noche" },
  { value: "#4f9a7a", label: "Salvia" },
  { value: "#9c4f7a", label: "Ciruela" },
];

export const DEFAULT_GROUP_COLOR = GROUP_COLORS[0].value;

export const AVATAR_PRESETS = [
  { key: "groups", label: "Equipo", icon: GroupsIcon },
  { key: "events", label: "Eventos", icon: EventsIcon },
  { key: "tasks", label: "Tareas", icon: TasksIcon },
  { key: "expenses", label: "Gastos", icon: ExpensesIcon },
  { key: "agreements", label: "Acuerdos", icon: AgreementsIcon },
  { key: "home", label: "Hogar", icon: HomeIcon },
  { key: "globe", label: "Mundo", icon: GlobeIcon },
  { key: "equipment", label: "Herramientas", icon: EquipmentIcon },
];

export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Colabo Free permite hasta 10 integrantes; Colabo Plus, hasta 50.
export const MEMBER_LIMIT_MIN = 2;
export const MEMBER_LIMIT_FREE = 10;
export const MEMBER_LIMIT_PLUS = 50;

export const INVITE_LINK_PATH = "/unirse";
export const INVITE_CODE_LENGTH = 12;
export const INVITE_VALID_DAYS = 7;

export const RULE_TYPES = [
  { value: "rule", label: "Regla" },
  { value: "commitment", label: "Compromiso" },
  { value: "condition", label: "Condición" },
];

export const CURRENCIES = [
  { value: "ARS", label: "Peso argentino (ARS)" },
  { value: "USD", label: "Dólar estadounidense (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "BRL", label: "Real brasileño (BRL)" },
  { value: "CLP", label: "Peso chileno (CLP)" },
  { value: "UYU", label: "Peso uruguayo (UYU)" },
  { value: "MXN", label: "Peso mexicano (MXN)" },
  { value: "COP", label: "Peso colombiano (COP)" },
];

export const EXPENSE_SPLITS = [
  {
    value: "equal",
    label: "Partes iguales",
    hint: "Cada gasto se divide entre todos.",
  },
  {
    value: "contribution",
    label: "Aporte fijo",
    hint: "Cada integrante aporta un monto acordado.",
  },
];

export const LIST_MAX_ITEMS = 20;

export const INITIAL_FORM = {
  identity: {
    name: "",
    description: "",
    category: GROUP_CATEGORIES[0],
    color: DEFAULT_GROUP_COLOR,
    avatarPreset: AVATAR_PRESETS[0].key,
    avatar: { file: null, preview: null },
    cover: { file: null, preview: null },
  },
  members: {
    invitees: [],
    inviteCode: "",
    memberLimit: MEMBER_LIMIT_FREE,
    permissions: { invite: false, createTasks: true, addExpenses: true },
  },
  organization: {
    purpose: "",
    goals: [],
    dates: [],
    rules: [],
    task: { title: "", description: "", dueDate: "" },
    expenses: {
      enabled: false,
      currency: "ARS",
      budget: "",
      split: "equal",
      contribution: "",
    },
  },
};

export const getPresetIcon = (key) =>
  AVATAR_PRESETS.find((preset) => preset.key === key)?.icon ?? GroupsIcon;

export const getRuleTypeLabel = (type) =>
  RULE_TYPES.find((ruleType) => ruleType.value === type)?.label ?? "Regla";

export function createInviteCode() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(INVITE_CODE_LENGTH));

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export const buildInviteLink = (code) =>
  `${window.location.origin}${INVITE_LINK_PATH}/${code}`;

export function formatDate(value, options = { day: "numeric", month: "long" }) {
  if (!value) return "";

  // Las fechas llegan como medianoche UTC; sin timeZone se corren un día.
  return new Date(value).toLocaleDateString("es-AR", {
    ...options,
    timeZone: "UTC",
  });
}

export function formatMoney(amount, currency) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}
