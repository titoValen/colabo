import "@/styles/price.css";
import PriceCard from "@/components/PriceCard";
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

const freeFeatures = [
  "Creación y gestión de grupos.",
  "Asignación de tareas y responsabilidades.",
  "Creación de acuerdos y reglas de convivencia",
  "Fechas de vencimiento y recordatorio",
  "Historial básico de actividad.",
  "Organización de actividades compartidas.",
];

const plusFeatures = [
  "Historial completo de cumplimiento e incumplimiento de acuerdos.",
  "Panel de gastos compartidos, aportes y saldos.",
  "Estadísticas de participación y responsabilidades.",
  "Recordatorios y automatizaciones avanzadas.",
  "Personalización avanzada y exportación de información.",
];

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
        <PriceCard
          title="Colabo Free"
          price="0"
          description="Para todos los grupos que quieran empezar con lo básico."
          button="Usar Colabo Free"
          features={freeFeatures}
        />
        <PriceCard
          title="Colabo Plus"
          price={selectedPlan.amount}
          period={selectedPlan.period}
          description="Para grupos que buscan una organización más completa."
          button="Obtener Plus"
          featuresIntro="Todo lo que trae free, más:"
          features={plusFeatures}
          className="price-card-plus"
        />
      </section>
    </main>
  );
}
