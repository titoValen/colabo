import { Link, NavLink, useLocation } from "react-router";
import Logo from "@/assets/colabo_logo.svg";
import HideSidebarIcon from "@/assets/icons/hide_sidebar.svg";
import HomeIcon from "@/assets/icons/home.svg";
import GroupsIcon from "@/assets/icons/groups.svg";
import TasksIcon from "@/assets/icons/tasks.svg";
import EventsIcon from "@/assets/icons/events.svg";
import ExpensesIcon from "@/assets/icons/expenses.svg";
import AgreementsIcon from "@/assets/icons/agreements.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

const NAV_ITEMS = [
  {
    label: "Inicio",
    name: "dashboard",
    icon: HomeIcon,
    alt: "Icono Inicio",
    path: "/dashboard",
  },
  {
    label: "Mis grupos",
    name: "grupos",
    icon: GroupsIcon,
    alt: "Icono Mis grupos",
    path: "/grupos",
  },
  {
    label: "Tareas",
    name: "tareas",
    icon: TasksIcon,
    alt: "Icono Tareas",
    path: "/tareas",
  },
  {
    label: "Eventos",
    name: "eventos",
    icon: EventsIcon,
    alt: "Icono Eventos",
    path: "/eventos",
  },
  {
    label: "Gastos",
    name: "gastos",
    icon: ExpensesIcon,
    alt: "Icono Gastos",
    path: "/gastos",
  },
  {
    label: "Acuerdos",
    name: "acuerdos",
    icon: AgreementsIcon,
    alt: "Icono Acuerdos",
    path: "/acuerdos",
  },
  {
    label: "Perfil",
    name: "perfil",
    icon: ProfileIcon,
    alt: "Icono ",
    path: "/perfil",
  },
];

export default function AppSidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const currentSection = NAV_ITEMS.find(
    (item) => item.path === location.pathname,
  );

  return (
    <aside id="app-sidebar" className="app-sidebar">
      <div className="app-sidebar-header">
        <Link
          to="/dashboard"
          className="app-sidebar-logo"
          aria-label="Colabo, ir al inicio"
        >
          <img src={Logo} alt="" />
        </Link>

        <button
          type="button"
          className="app-sidebar-toggle"
          onClick={onToggle}
          aria-label="Ocultar menú lateral"
          aria-expanded={isOpen}
          aria-controls="app-sidebar"
        >
          <img src={HideSidebarIcon} alt="" />
        </button>
      </div>

      <nav className="app-nav" aria-label="Navegación principal">
        <ul className="app-nav-list">
          {NAV_ITEMS.map(({ label, icon, alt, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className="app-nav-link"
                style={{
                  background:
                    currentSection?.path === path
                      ? "var(--color-fur)"
                      : "transparent",
                }}
              >
                <img src={icon} alt={alt} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
