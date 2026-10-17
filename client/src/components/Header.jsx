import { Link } from "react-router";

export default function Header() {
  return <header>
    <nav>
      <Link to="/precios">Precios</Link>
      <Link to="/iniciar-sesion">Iniciar sesión</Link>
      <Link to="/registrarse">Registrarse</Link>
    </nav>
  </header>;
}
