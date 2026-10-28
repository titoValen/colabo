import { useState } from "react";
import { Link } from "react-router";
import LogoColabo from "@/assets/colabo_logo.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import CloseIcon from "@/assets/icons/close.svg";
import "@/styles/header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <Link className="header-brand" to="/" onClick={closeMenu}>
        <figure>
          <img src={LogoColabo} alt="Logo de Colabo" />
        </figure>
      </Link>
      <button
        className="header-menu-button"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="header-navigation"
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <img src={MenuIcon} alt="" />
      </button>
      <nav
        id="header-navigation"
        className={`header-nav${isMenuOpen ? " header-nav--open" : ""}`}
        aria-label="Navegación principal"
      >
        <button
          className="header-nav-close"
          type="button"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        >
          <img src={CloseIcon} alt="" />
        </button>
        <Link className="header-nav-link" to="/precios" onClick={closeMenu}>
          Precios
        </Link>
        <Link
          className="header-nav-link"
          to="/iniciar-sesion"
          onClick={closeMenu}
        >
          Iniciar sesión
        </Link>
        <Link
          className="header-nav-link header-nav-link--primary"
          to="/registrarse"
          onClick={closeMenu}
        >
          Registrarse
        </Link>
      </nav>
      {isMenuOpen && (
        <button
          className="header-menu-overlay"
          type="button"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
