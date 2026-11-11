import LockIcon from "@/assets/icons/lock.svg";
import ShieldIcon from "@/assets/icons/shield.svg";
import ChevronIcon from "@/assets/icons/chevron_down.svg";

export default function ProfileSecurity() {
  return (
    <section className="profile-card">
      <h2 className="profile-card-title">
        <img src={LockIcon} alt="" />
        Seguridad
      </h2>

      <ul className="profile-nav-list">
        <li className="profile-nav-row" aria-disabled="true" title="Disponible próximamente">
          <img src={LockIcon} alt="" />
          <div>
            <p>Cambiar contraseña</p>
            <span>Actualizá tu contraseña para mayor seguridad.</span>
          </div>
          <img src={ChevronIcon} alt="" className="profile-nav-chevron" />
        </li>
        <li className="profile-nav-row" aria-disabled="true" title="Disponible próximamente">
          <img src={ShieldIcon} alt="" />
          <div>
            <p>Autenticación en dos pasos</p>
            <span>Agregá una capa extra de seguridad a tu cuenta.</span>
          </div>
          <img src={ChevronIcon} alt="" className="profile-nav-chevron" />
        </li>
      </ul>
    </section>
  );
}
