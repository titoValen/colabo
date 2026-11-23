import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";
import GroupAvatar from "@components/groups/GroupAvatar";
import ProfileAvatar from "@components/profile/ProfileAvatar";
import MembersIcon from "@/assets/icons/profile.svg";
import ChevronIcon from "@/assets/icons/chevron_down.svg";
import "@/styles/groups/group-shared.css";
import "@/styles/profile/profile-security.css";

export default function GroupCard({ group, onDeleted }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const members = group.members_preview ?? [];
  const extraMembers = Math.max(0, group.users_count - members.length);
  const isAdmin = group.my_role === "admin";

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!deleteOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !deleting) setDeleteOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteOpen, deleting]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await apiFetch(`/groups/${group.id}`, { method: "DELETE", token });
      setDeleteOpen(false);
      toast.success("El grupo fue eliminado.");
      onDeleted?.(group.id);
    } catch (error) {
      setDeleteError(error.message || "No pudimos eliminar el grupo.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group-card-wrapper" style={{ "--group-color": group.color }}>
      <Link to={`/grupos/${group.id}`} className="group-card">
      <span
        className="group-card-cover group-cover"
        style={{
          backgroundImage: group.cover_url
            ? `url("${group.cover_url}")`
            : undefined,
        }}
      />
      <span className="group-card-avatar">
        <GroupAvatar
          name={group.name}
          color={group.color}
          preset={group.avatar_preset}
          imageUrl={group.avatar_url}
          size="md"
        />
      </span>

      <span className="group-card-body">
        <span className="group-card-name">{group.name}</span>
        <span className="group-card-meta">
          <img src={MembersIcon} alt="" />
          {group.users_count}{" "}
          {group.users_count === 1 ? "integrante" : "integrantes"}
        </span>
        {group.type && (
          <span>
            <span className="group-badge">{group.type}</span>
          </span>
        )}

        <span className="group-card-footer">
          <span className="group-card-members">
            {members.map((member) => (
              <ProfileAvatar
                key={member.id}
                name={member.name}
                seed={member.id === user?.id ? user.email : member.name}
                shape={member.avatar_preference?.blobatar_shape}
                color={member.avatar_preference?.avatar_color}
                style={member.avatar_preference?.avatar_style}
                size="sm"
              />
            ))}
            {extraMembers > 0 && (
              <span className="group-card-more">+{extraMembers}</span>
            )}
          </span>
          <img className="group-card-chevron" src={ChevronIcon} alt="" />
        </span>
      </span>
    </Link>
      {isAdmin && (
        <div className="group-card-menu" ref={menuRef}>
          <button
            type="button"
            className="group-card-menu-button"
            aria-label={`Opciones de ${group.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={(event) => {
              event.preventDefault();
              setMenuOpen((open) => !open);
            }}
          >
            <span aria-hidden="true">•••</span>
          </button>
          {menuOpen && (
            <div className="group-card-menu-popover" role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={() => navigate(`/grupos/${group.id}/editar`)}
              >
                Editar grupo
              </button>
              <button
                type="button"
                role="menuitem"
                className="group-card-menu-danger"
                onClick={() => {
                  setMenuOpen(false);
                  setDeleteError("");
                  setDeleteOpen(true);
                }}
              >
                Eliminar grupo
              </button>
            </div>
          )}
        </div>
      )}

      {deleteOpen &&
        createPortal(
          <div
            className="profile-delete-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !deleting) setDeleteOpen(false);
            }}
          >
            <div
              className="profile-delete-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`delete-group-${group.id}-title`}
            >
              <h2 id={`delete-group-${group.id}-title`}>¿Eliminar el grupo?</h2>
              <p>
                Se eliminará <strong>{group.name}</strong> y sus datos asociados.
                Esta acción no se puede deshacer.
              </p>
              {deleteError && <p className="profile-security-error" role="alert">{deleteError}</p>}
              <div className="profile-security-actions">
                <button
                  type="button"
                  className="btn profile-delete-confirm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando…" : "Sí, eliminar"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
