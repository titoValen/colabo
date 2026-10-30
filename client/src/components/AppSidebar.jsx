import { Link, NavLink } from "react-router";
import Logo from "@/assets/colabo_logo.svg";
import HomeIcon from "@/assets/icons/home.svg";
import GroupsIcon from "@/assets/icons/groups.svg";
import TasksIcon from "@/assets/icons/tasks.svg";
import EventsIcon from "@/assets/icons/events.svg";
import ExpensesIcon from "@/assets/icons/expenses.svg";
import AgreementsIcon from "@/assets/icons/agreements.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

const NAV_ITEMS = [
  { label: "Inicio", icon: HomeIcon, path: "/dashboard" },
  { label: "Mis grupos", icon: GroupsIcon, path: "/grupos" },
  { label: "Tareas", icon: TasksIcon, path: "/tareas" },
  { label: "Eventos", icon: EventsIcon, path: "/eventos" },
  { label: "Gastos", icon: ExpensesIcon, path: "/gastos" },
  { label: "Acuerdos", icon: AgreementsIcon, path: "/acuerdos" },
  { label: "Perfil", icon: ProfileIcon, path: "/perfil" },
];

export default function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <Link to="/dashboard" className="app-sidebar-logo" aria-label="Colabo, ir al inicio">
        <img src={Logo} alt="" />
      </Link>

      <nav className="app-nav" aria-label="Navegación principal">
        <ul className="app-nav-list">
          {NAV_ITEMS.map(({ label, icon, path }) => (
            <li key={path}>
              <NavLink to={path} className="app-nav-link">
                <img src={icon} alt="" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
