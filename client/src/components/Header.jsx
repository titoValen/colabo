import { Link } from "react-router";
import LogoColabo from "@/assets/colabo_logo.svg";
import "@/styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <Link to="/">
        <figure>
          <img src={LogoColabo} alt="Logo de Colabo" />
        </figure>
      </Link>
      <nav className="header-nav">
        <Link className="header-nav-link" to="/precios">Precios</Link>
        <Link className="header-nav-link" to="/iniciar-sesion">Iniciar sesión</Link>
        <Link className="header-nav-link header-nav-link--primary" to="/registrarse">Registrarse</Link>
      </nav>
    </header>
  );
}
