import { NavLink } from "react-router";
import Logo from "@/assets/colabo_logo.svg";
import IconoInicio from "@/assets/icons/home.svg";
import IconoGrupos from "@/assets/icons/groups.svg";
import IconoTareas from "@/assets/icons/tasks.svg";
import IconoEventos from "@/assets/icons/events.svg";
import IconoGastos from "@/assets/icons/money.svg";
import IconoAcuerdos from "@/assets/icons/assignment.svg";
import IconoPerfil from "@/assets/icons/user.svg";

const ITEMS_NAVEGATION = [
  { etiqueta: "Inicio", icono: IconoInicio, ruta: "/dashboard" },
  { etiqueta: "Mis grupos", icono: IconoGrupos, ruta: null },
  { etiqueta: "Tareas", icono: IconoTareas, ruta: null },
  { etiqueta: "Eventos", icono: IconoEventos, ruta: null },
  { etiqueta: "Gastos", icono: IconoGastos, ruta: null },
  { etiqueta: "Acuerdos", icono: IconoAcuerdos, ruta: null },
  { etiqueta: "Perfil", icono: IconoPerfil, ruta: null },
];

export default function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar">
      <figure className="dashboard-sidebar-logo">
        <img src={Logo} alt="Logo de Colabo" />
      </figure>

      <nav className="dashboard-nav" aria-label="Navegación del dashboard">
        <ul className="dashboard-nav-list">
          {ITEMS_NAVEGATION.map(({ etiqueta, icono, ruta }) => (
            <li key={etiqueta}>
              {ruta ? (
                <NavLink
                  to={ruta}
                  className={({ isActive }) =>
                    `dashboard-nav-link${isActive ? " is-active" : ""}`
                  }
                >
                  <img src={icono} alt="" />
                  <span>{etiqueta}</span>
                </NavLink>
              ) : (
                <span
                  className="dashboard-nav-link is-disabled"
                  aria-disabled="true"
                  title="Próximamente"
                >
                  <img src={icono} alt="" />
                  <span>{etiqueta}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
