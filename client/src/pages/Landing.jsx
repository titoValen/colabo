import "@/styles/landing.css";
import { Link } from "react-router";
import Hero from "@/assets/illustration/colabo_hero_background.webp";
import HeroMobile from "@/assets/illustration/colabo_hero_background_mobile.webp";
import HeroTablet from "@/assets/illustration/colabo_hero_background_tablet.webp";
import ComparacionAntes from "@/assets/illustration/colabo_antes_comparacion.webp";
import ComparacionDespues from "@/assets/illustration/colabo_despues_comparacion.webp";
import AcuerdoVisible from "@/assets/icons/eye.svg";
import PlanCompartido from "@/assets/icons/equipment.svg";
import InvitarPersona from "@/assets/icons/invite_person.svg";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import ArrowDown from "@/assets/icons/arrow_down.svg";
import Paso1 from "@/assets/illustration/colabo_paso_1.webp";
import Paso2 from "@/assets/illustration/colabo_paso_2.webp";
import Paso3 from "@/assets/illustration/colabo_paso_3.webp";

export default function Landing() {
  return (
    <main className="landing">
      <section className="landing-section landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Ponerse de acuerdo no debería ser un caos
          </h1>
          <p className="landing-hero-description">
            Fechas, responsabilidades y acuerdos claros para todo el grupo.
          </p>
          <div className="landing-hero-actions">
            <Link
              className="landing-action landing-action-primary"
              to="/registrarse"
            >
              Empezar ahora
              <figure className="landing-action-figure">
                <img src={ArrowRight} alt="Icono de flecha hacia la derecha" />
              </figure>
            </Link>
            <a
              className="landing-action landing-action-secondary"
              href="#como-funciona"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>
        <div className="landing-hero-media">
          <figure className="landing-hero-figure">
            <picture>
              <source media="(max-width: 480px)" srcSet={HeroMobile} />
              <source media="(max-width: 1023px)" srcSet={HeroTablet} />
              <img className="landing-hero-image" src={Hero} alt="Background para el hero de la página de inicio" />
            </picture>
          </figure>
        </div>
      </section>

      <section
        id="antes-y-despues"
        className="landing-section landing-comparison"
        aria-labelledby="landing-comparison-title"
      >
        <div className="landing-comparison-intro">
          <h2
            id="landing-comparison-title"
            className="landing-comparison-title"
          >
            Antes y Después
          </h2>
          <p className="landing-comparison-description">
            De mensajes sueltos a un plan claro para todos.
          </p>
        </div>
        <div className="landing-comparison-container">
          <article className="landing-comparison-panel landing-comparison-before">
            <h3 className="landing-comparison-label">Antes</h3>
            <figure className="landing-comparison-figure">
              <img
                className="landing-comparison-image"
                src={ComparacionAntes}
                alt="Conversación desordenada con dudas sobre horarios y responsabilidades"
                loading="lazy"
              />
            </figure>
          </article>
          <article className="landing-comparison-panel landing-comparison-after">
            <h3 className="landing-comparison-label">Después</h3>
            <figure className="landing-comparison-figure">
              <img
                className="landing-comparison-image"
                src={ComparacionDespues}
                alt="Plan compartido con fecha, lugar, pendientes, responsables y acuerdos"
                loading="lazy"
              />
            </figure>
          </article>
        </div>
      </section>

      <section
        id="como-funciona"
        className="landing-section landing-how-it-works"
        aria-labelledby="landing-how-it-works-title"
      >
        <div className="landing-how-it-works-content">
          <h2
            id="landing-how-it-works-title"
            className="landing-how-it-works-title"
          >
            ¿Cómo funcionan los planes compartidos?
          </h2>
          <p className="landing-how-it-works-description">
            Organizá cada plan en pocos pasos y mantené a todas las personas al
            tanto.
          </p>
        </div>
        <div className="landing-how-it-works-steps">
          <article className="landing-how-it-works-step">
            <figure
              className="landing-how-it-works-step-image"
              aria-label="Imagen del paso 1"
              role="img"
              alt="Imagen del paso 1"
            >
              <img src={Paso1} alt="Imagen del paso 1" />
            </figure>
            <span className="landing-how-it-works-step-number">PASO 01</span>
            <h3 className="landing-how-it-works-step-title">Creá</h3>
            <p className="landing-how-it-works-step-description">
              Definí la idea, la fecha y el lugar.
            </p>
          </article>
          <article className="landing-how-it-works-step">
            <figure
              className="landing-how-it-works-step-image"
              aria-label="Imagen del paso 2"
              role="img"
              alt="Imagen del paso 2"
            >
              <img src={Paso2} alt="Imagen del paso 2" />
            </figure>
            <span className="landing-how-it-works-step-number">PASO 02</span>
            <h3 className="landing-how-it-works-step-title">Compartí</h3>
            <p className="landing-how-it-works-step-description">
              Invitá a quienes forman parte del plan.
            </p>
          </article>
          <article className="landing-how-it-works-step">
            <figure
              className="landing-how-it-works-step-image"
              aria-label="Imagen del paso 3"
              role="img"
              alt="Imagen del paso 3"
            >
              <img src={Paso3} alt="Imagen del paso 3" />
            </figure>
            <span className="landing-how-it-works-step-number">PASO 03</span>
            <h3 className="landing-how-it-works-step-title">Organizá</h3>
            <p className="landing-how-it-works-step-description">
              Repartí tareas y dejá los acuerdos claros.
            </p>
          </article>
        </div>
        <div className="landing-how-it-works-callout">
          <strong>Un mismo plan. Todos en la misma página.</strong>
          <p>Menos confusión, más tiempo para disfrutar juntos.</p>
        </div>
      </section>

      <h2 className="landing-how-it-works-title landing-features-title">
        ¿Qué ofrecemos?
      </h2>
      <section className="landing-section landing-features">

        <div className="landing-feature">
          <figure className="landing-feature-figure">
            <img
              className="landing-feature-icon"
              src={AcuerdoVisible}
              alt="Icono de un ojo visible, haciendo referencia a un acuerdo visible"
            />
          </figure>
          <h3 className="landing-feature-title">Acuerdos visibles</h3>
          <p className="landing-feature-description">
            Toda la información clara en un solo lugar.
          </p>
        </div>
        <div className="landing-feature">
          <figure className="landing-feature-figure">
            <img
              className="landing-feature-icon"
              src={PlanCompartido}
              alt="Icono de gente alrededor, dando referencia a un plan compartido"
            />
          </figure>
          <h3 className="landing-feature-title">Plan compartido</h3>
          <p className="landing-feature-description">
            Organizá con otras personas de forma simple.
          </p>
        </div>
        <div className="landing-feature">
          <figure className="landing-feature-figure">
            <img
              className="landing-feature-icon"
              src={InvitarPersona}
              alt="Icono de una persona más, dando referencia a que todos deben sumarse"
            />
          </figure>
          <h3 className="landing-feature-title">Todos saben como sumarse</h3>
          <p className="landing-feature-description">
            Es fácil organizarse y saber como colaborar.
          </p>
        </div>
      </section>
      
      <section
        id="preguntas-frecuentes"
        className="landing-section landing-section-faq"
      >
        <div className="landing-faq-intro">
          <h2 className="landing-faq-title">Preguntas frecuentes</h2>
          <p className="landing-faq-description">
            Todo lo que necesitás saber para empezar a usar Colabo.
          </p>
        </div>
        <div className="landing-faq-list">
          <div className="landing-faq-item">
            <input
              className="landing-faq-toggle"
              type="checkbox"
              name="plan_compartido"
              id="plan_compartido"
            />
            <label className="landing-faq-question" htmlFor="plan_compartido">
              ¿Qué es un plan compartido?
              <figure className="landing-faq-question-figure">
                <img
                  className="landing-faq-question-img"
                  src={ArrowDown}
                  alt="Icono de flecha hacia abajo"
                />
              </figure>
            </label>
            <div className="landing-faq-answer">
              <p className="landing-faq-answer-text">
                Un espacio común para reunir datos, tareas y acuerdos
              </p>
            </div>
          </div>
          <div className="landing-faq-item">
            <input
              className="landing-faq-toggle"
              type="checkbox"
              name="invitar_personas"
              id="invitar_personas"
            />
            <label className="landing-faq-question" htmlFor="invitar_personas">
              ¿Cómo sumo a otras personas?
              <figure className="landing-faq-question-figure">
                <img
                  className="landing-faq-question-img"
                  src={ArrowDown}
                  alt="Icono de flecha hacia abajo"
                />
              </figure>
            </label>
            <div className="landing-faq-answer">
              <p className="landing-faq-answer-text">
                Podés hacerlo mediante un link de invitación o buscando su
                usuario en el panel de búsqueda de usuarios.
              </p>
            </div>
          </div>
          <div className="landing-faq-item">
            <input
              className="landing-faq-toggle"
              type="checkbox"
              name="organizar_planes"
              id="organizar_planes"
            />
            <label className="landing-faq-question" htmlFor="organizar_planes">
              ¿Qué tipo de planes puedo organizar?
              <figure className="landing-faq-question-figure">
                <img
                  className="landing-faq-question-img"
                  src={ArrowDown}
                  alt="Icono de flecha hacia abajo"
                />
              </figure>
            </label>
            <div className="landing-faq-answer">
              <p className="landing-faq-answer-text">
                Podés organizar salidas, viajes, eventos y otros planes en
                grupo.
              </p>
            </div>
          </div>
          <div className="landing-faq-item">
            <input
              className="landing-faq-toggle"
              type="checkbox"
              name="colaborar_en_grupo"
              id="colaborar_en_grupo"
            />
            <label
              className="landing-faq-question"
              htmlFor="colaborar_en_grupo"
            >
              ¿Cómo puedo colaborar en el grupo?
              <figure className="landing-faq-question-figure">
                <img
                  className="landing-faq-question-img"
                  src={ArrowDown}
                  alt="Icono de flecha hacia abajo"
                />
              </figure>
            </label>
            <div className="landing-faq-answer">
              <p className="landing-faq-answer-text">
                Cada persona puede asumir responsabilidades y mantener los
                acuerdos visibles para todo el grupo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta">
        <h2 className="landing-cta-title">Los planes salen mejor en equipo</h2>
        <Link className="landing-action landing-action-primary" to="/registrarse">
          Empezar ahora
          <figure className="landing-action-figure">
            <img src={ArrowRight} alt="Icono de flecha hacia la derecha" />
          </figure>
        </Link>
      </section>
    </main>
  );
}
