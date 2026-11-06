import { Link } from "react-router";
import NotFoundIllustration from "@/assets/illustration/colabo_404.webp";
import "@/styles/not-found.css";

export default function NotFound() {
  return (
    <main className="not-found">
      <section className="not-found-content">
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">
          Ups... parece que esta página se perdió
        </h1>
        <p className="not-found-message">
          La página que buscas no existe, fue movida o puede que haya ocurrido
          un error.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Ir al dashboard
          </Link>
        </div>
      </section>

      <figure className="not-found-figure">
        <img
          src={NotFoundIllustration}
          alt="Tres personas mirando un mapa junto a carteles de dirección"
        />
      </figure>
    </main>
  );
}
