import { Link } from "react-router";
import LogoColabo from "@/assets/colabo_logo-white-border.svg";
import Instagram from "@/assets/social/instagram.svg";
import Tiktok from "@/assets/social/tiktok.svg";
import "@/styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link className="footer-brand" to="/">
          <figure className="footer-logo">
            <img src={LogoColabo} alt="Logo de Colabo" />
          </figure>
        </Link>
        <nav className="footer-nav" aria-label="Navegación del pie de página">
          <Link className="footer-nav-link" to="/precios">
            Precios
          </Link>
          <Link className="footer-nav-link" to="/iniciar-sesion">
            Iniciar sesión
          </Link>
          <Link className="footer-nav-link" to="/registrarse">
            Registrarse
          </Link>
        </nav>
        <div className="footer-socials">
          <span className="footer-socials-label">Seguinos</span>
          <div className="footer-socials-list" aria-label="Redes sociales">
            <figure className="footer-social-icon">
              <img src={Instagram} alt="Instagram" />
            </figure>
            <figure className="footer-social-icon">
              <img src={Tiktok} alt="TikTok" />
            </figure>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copyright">© 2026 Colabo</span>
      </div>
    </footer>
  );
}
