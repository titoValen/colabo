import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import ChevronIcon from "@/assets/icons/chevron_down.svg";

function getInitials(name) {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function DashboardUserMenu() {
  const { usuario: user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    logout();
  }

  return (
    <div className="dashboard-user" ref={menuRef}>
      <button
        type="button"
        className="dashboard-user-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Menú de usuario"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="dashboard-user-avatar">
          {getInitials(user?.name)}
        </span>
        <img
          src={ChevronIcon}
          className={`dashboard-user-chevron${isOpen ? " is-open" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="dashboard-user-menu">
          <Link
            to="/perfil"
            className="dashboard-user-menu-item"
            onClick={() => setIsOpen(false)}
          >
            Mi perfil
          </Link>
          <button
            type="button"
            className="dashboard-user-menu-item is-danger"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
