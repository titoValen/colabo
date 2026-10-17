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
      <nav>
        <Link to="/precios">Precios</Link>
        <Link to="/iniciar-sesion">Iniciar sesión</Link>
        <Link to="/registrarse">Registrarse</Link>
      </nav>
    </header>
  );
}
