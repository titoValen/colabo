import "@/styles/loading.css";

export default function Loading({ status = "Cargando..." }) {
  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <div className="loader-square" aria-hidden="true">
        <div className="square square-1"></div>
        <div className="square square-2"></div>
        <div className="square square-3"></div>
        <div className="square square-4"></div>
      </div>
      <p className="loading-status">{status}</p>
    </div>
  );
}
