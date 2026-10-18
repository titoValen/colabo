import "@/styles/landing.css";
import { Link } from "react-router";
import AcuerdoVisible from "@/assets/icons/eye.svg";
import PlanCompartido from "@/assets/icons/equipment.svg";
import InvitarPersona from "@/assets/icons/invite_person.svg";

export default function Landing() {
  return (
    <main className="landing">
      <section className="landing-section landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">Ponerse de acuerdo no debería ser un caos</h1>
          <p className="landing-hero-description">
            Fechas, responsabilidades y acuerdos claros para todo el grupo.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-action landing-action-primary" to="#">
              Crear un grupo
            </Link>
            <Link className="landing-action landing-action-secondary" to="#como-funciona">
              Ver cómo funciona
            </Link>
          </div>
        </div>
        <div className="landing-hero-media">
          <figure className="landing-hero-figure">
            <img className="landing-hero-image" src="" alt="" />
          </figure>
        </div>
      </section>

      <section className="landing-section landing-features">
        <div className="landing-feature">
          <figure className="landing-feature-figure">
            <img className="landing-feature-icon" src={AcuerdoVisible} alt="" />
          </figure>
          <h3 className="landing-feature-title">Acuerdos visibles</h3>
          <p className="landing-feature-description">Toda la información clara en un solo lugar.</p>
        </div>
        <div className="landing-feature">
          <figure className="landing-feature-figure">
            <img className="landing-feature-icon" src={PlanCompartido} alt="" />
          </figure>
          <h3 className="landing-feature-title">Plan compartido</h3>
          <p className="landing-feature-description">Organizá con otras personas de forma simple.</p>
        </div>
        <div className="landing-feature">
          <figure className="landing-feature-figure">
            <img className="landing-feature-icon" src={InvitarPersona} alt="" />
          </figure>
          <h3 className="landing-feature-title">Todos saben como sumarse</h3>
          <p className="landing-feature-description">Es fácil organizarse y saber como colaborar.</p>
        </div>
      </section>

      <section id="antes-y-despues" className="landing-section landing-comparison">
        <div className="landing-comparison-intro">
          <h2 className="landing-comparison-title">Antes y Después</h2>
          <p className="landing-comparison-description">De mensajes sueltos a un plan claro para todos.</p>
        </div>
        <div className="landing-comparison-panel landing-comparison-before">
          <span className="landing-comparison-label">Antes</span>
          <figure className="landing-comparison-figure">
            <img className="landing-comparison-image" src="" alt="" />
          </figure>
        </div>
        <div className="landing-comparison-panel landing-comparison-after">
          <span className="landing-comparison-label">Después</span>
          <figure className="landing-comparison-figure">
            <img className="landing-comparison-image" src="" alt="" />
          </figure>
        </div>
      </section>

      <section id="como-funciona" className="landing-section landing-how-it-works">
        <div className="landing-how-it-works-content">
          <h2 className="landing-how-it-works-title">¿Cómo funcionan los planes compartidos?</h2>
          <p className="landing-how-it-works-description">
            Reuní los datos importantes, definí quién se encarga de cada
            responsabilidad pendiente y dejá los acuerdos claros para todos.
          </p>
        </div>
        <div className="landing-how-it-works-media">
          <figure className="landing-how-it-works-figure">
            <img className="landing-how-it-works-image" src="" alt="" />
          </figure>
        </div>
      </section>

      <section id="preguntas-frecuentes" className="landing-section landing-faq">
        <div className="landing-faq-intro">
          <h2 className="landing-faq-title">Preguntas frecuentes</h2>
          <p className="landing-faq-description">Todo lo que necesitás saber para empezar a usar Colabo.</p>
        </div>
        <div className="landing-faq-list">
          {/* Acordion de preguntas frecuentes */}
        </div>
      </section>

      <section className="landing-section landing-cta"></section>
    </main>
  );
}
