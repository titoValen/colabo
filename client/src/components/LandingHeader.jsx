import { Link } from "react-router";
import LogoColabo from "@/assets/colabo_logo.svg";
import "@/styles/landingHeader.css";

export default function Header() {
  return (
    <header className="header">
      <Link to="/">
        <figure>
          <img src={LogoColabo} alt="Logo de Colabo" />
        </figure>
      </Link>
      <nav className="header-nav">
        <Link className="header-nav-link" to="#antes-y-despues">Antes y después </Link>
        <Link className="header-nav-link" to="#como-funciona">Como funciona</Link>
        <Link className="header-nav-link" to="#preguntas-frecuentes">Preguntas frecuentes</Link>
        <Link className="header-nav-link header-nav-link--primary" to="/registrarse">Registrarse</Link>
      </nav>
    </header>
  );
}
