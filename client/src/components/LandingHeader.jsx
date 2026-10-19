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
        <a className="header-nav-link" href="#antes-y-despues">Antes y después </a>
        <a className="header-nav-link" href="#como-funciona">Como funciona</a>
        <a className="header-nav-link" href="#preguntas-frecuentes">Preguntas frecuentes</a>
        <Link className="header-nav-link header-nav-link--primary" to="/registrarse">Registrarse</Link>
      </nav>
    </header>
  );
}
