import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import ProfileAvatar from "@components/ProfileAvatar";
import ChevronIcon from "@/assets/icons/chevron_down.svg";

export default function DashboardUserMenu() {
  const { user, logout } = useAuth();
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
        <ProfileAvatar
          name={user?.name}
          seed={user?.email}
          shape={user?.avatar_preference?.blobatar_shape}
          color={user?.avatar_preference?.avatar_color}
          style={user?.avatar_preference?.avatar_style}
          size="sm"
        />
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
