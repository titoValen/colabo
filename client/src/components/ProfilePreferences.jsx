import { useState } from "react";
import BellIcon from "@/assets/icons/bell.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import GlobeIcon from "@/assets/icons/globe.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import ChevronIcon from "@/assets/icons/chevron_down.svg";

export default function ProfilePreferences({ initialNotificationsEnabled }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialNotificationsEnabled,
  );

  return (
    <section className="profile-card">
      <h2 className="profile-card-title">
        <img src={SettingsIcon} alt="" />
        Preferencias
      </h2>

      <ul className="profile-nav-list">
        <li className="profile-nav-row">
          <img src={BellIcon} alt="" />
          <div>
            <p>Notificaciones</p>
            <span>Gestioná cómo y cuándo recibir notificaciones.</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            aria-label="Notificaciones"
            className={`profile-switch${notificationsEnabled ? " is-on" : ""}`}
            onClick={() => setNotificationsEnabled((value) => !value)}
          >
            <span />
          </button>
        </li>

        <li className="profile-nav-row" aria-disabled="true" title="Disponible próximamente">
          <img src={EyeIcon} alt="" />
          <div>
            <p>Privacidad</p>
            <span>Controlá quién puede ver tu información.</span>
          </div>
          <img src={ChevronIcon} alt="" className="profile-nav-chevron" />
        </li>

        <li className="profile-nav-row">
          <img src={GlobeIcon} alt="" />
          <div>
            <p>Idioma</p>
            <span>Por ahora Colabo solo está disponible en español.</span>
          </div>
          <select className="profile-select" value="es" disabled>
            <option value="es">Español</option>
          </select>
        </li>
      </ul>
    </section>
  );
}
