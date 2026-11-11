import ProfileIcon from "@/assets/icons/profile.svg";

export default function ProfilePersonalInfo({ name, email }) {
  return (
    <section className="profile-card">
      <div className="profile-card-header">
        <h2 className="profile-card-title">
          <img src={ProfileIcon} alt="" />
          Información personal
        </h2>
        <button type="button" className="profile-edit-button" disabled title="Disponible próximamente">
          Editar
        </button>
      </div>

      <dl className="profile-info-list">
        <div className="profile-info-row">
          <dt>Nombre</dt>
          <dd>{name}</dd>
        </div>
        <div className="profile-info-row">
          <dt>Email</dt>
          <dd>{email}</dd>
        </div>
        <div className="profile-info-row">
          <dt>Ubicación</dt>
          <dd className="is-empty">Sin especificar</dd>
        </div>
        <div className="profile-info-row profile-info-row--block">
          <dt>Biografía</dt>
          <dd className="is-empty">Sin especificar</dd>
        </div>
      </dl>
    </section>
  );
}
