import "@/styles/price.css";
import { useState } from "react";

const plusPlans = {
  monthly: {
    amount: "4.999",
    period: "/mes por grupo",
  },
  annual: {
    amount: "49.999",
    period: "/año por grupo",
  },
};

export default function Price() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const selectedPlan = plusPlans[billingPeriod];

  return (
    <main className="price-page">
      <h1 className="price-title">Elegí cómo colaborar</h1>

      <div
        className="price-billing-options"
        aria-label="Periodo de facturación"
      >
        <button
          className={`price-billing-button ${billingPeriod === "monthly" ? "is-selected" : ""}`}
          type="button"
          aria-pressed={billingPeriod === "monthly"}
          onClick={() => setBillingPeriod("monthly")}
        >
          Mensual
        </button>
        <button
          className={`price-billing-button ${billingPeriod === "annual" ? "is-selected" : ""}`}
          type="button"
          aria-pressed={billingPeriod === "annual"}
          onClick={() => setBillingPeriod("annual")}
        >
          Anual · Ahorrá $9.998
        </button>
      </div>

      <section className="price-plans" aria-label="Planes de Colabo">
        <article className="price-card">
          <h2 className="price-card-title">Colabo Free</h2>
          <div className="price-value">
            <span className="price-currency">$</span>
            <span className="price-amount">0</span>
          </div>
          <p className="price-description">
            Para todos los grupos que quieran empezar con lo básico.
          </p>
          <button className="price-action" type="button">
            Usar Colabo Free
          </button>
          <p className="price-features-intro">Todo lo que trae free:</p>
          <ul className="price-features">
            <li className="price-feature">Creación y gestión de grupos.</li>
            <li className="price-feature">
              Asignación de tareas y responsabilidades.
            </li>
            <li className="price-feature">
              Creación de acuerdos y reglas de convivencia
            </li>
            <li className="price-feature">
              Fechas de vencimiento y recordatorio
            </li>
            <li className="price-feature">Historial básico de actividad.</li>
            <li className="price-feature">
              Organización de actividades compartidas.
            </li>
          </ul>
        </article>

        <article className="price-card price-card-plus">
          <h2 className="price-card-title">Colabo Plus</h2>
          <div className="price-value">
            <span className="price-currency">$</span>
            <span className="price-amount">{selectedPlan.amount}</span>
            <span className="price-period">{selectedPlan.period}</span>
          </div>
          <p className="price-description">
            Para grupos que buscan una organización más completa.
          </p>
          <button className="price-action" type="button">
            Obtener Plus
          </button>
          <p className="price-features-intro">Todo lo que trae free, más:</p>
          <ul className="price-features">
            <li className="price-feature">
              Historial completo de cumplimiento e incumplimiento de acuerdos.
            </li>
            <li className="price-feature">
              Panel de gastos compartidos, aportes y saldos.
            </li>
            <li className="price-feature">
              Estadísticas de participación y responsabilidades.
            </li>
            <li className="price-feature">
              Recordatorios y automatizaciones avanzadas.
            </li>
            <li className="price-feature">
              Personalización avanzada y exportación de información.
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
}
