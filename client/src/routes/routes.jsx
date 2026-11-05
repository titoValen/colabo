import { lazy, Suspense, useEffect } from "react";
import { Navigate, Routes, Route, useLocation, Link } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading.jsx";
import "@/styles/alert.css";

const Register = lazy(() => import("@/pages/Register"));
const Login = lazy(() => import("@/pages/Login"));
const Price = lazy(() => import("@/pages/Price"));
const Landing = lazy(() => import("@/pages/Landing"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

const RUTAS_PUBLICAS_BLOQUEADAS = new Set([
  "/",
  "/iniciar-sesion",
  "/registrarse",
  "/recuperar-contrasena",
  "/restablecer-contrasena",
]);

const RUTAS_PUBLICAS = new Set([...RUTAS_PUBLICAS_BLOQUEADAS, "/precios"]);

export default function AppRoutes() {
  const { pathname } = useLocation();
  const {
    token,
    usuario,
    verificandoSesion,
    errorSesion,
    reintentarSesion,
    sesionExpirada,
    limpiarAvisoSesionExpirada,
  } = useAuth();
  const autenticado = Boolean(token);
  const onboardingCompletado = Boolean(usuario?.onboarding_completed);
  const mensajeErrorSesion =
    typeof errorSesion === "string"
      ? errorSesion
      : (errorSesion?.message ??
        "No pudimos verificar tu sesión. Intenta nuevamente.");

  useEffect(() => {
    if (!sesionExpirada) return;

    toast.error("Tu sesión no está activa. Inicia sesión para continuar.", {
      id: "sesion-expirada",
    });
    if (pathname === "/") limpiarAvisoSesionExpirada();
  }, [limpiarAvisoSesionExpirada, pathname, sesionExpirada]);

  if (verificandoSesion) {
    return <Loading />;
  }

  if (sesionExpirada && pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  if (errorSesion && !RUTAS_PUBLICAS.has(pathname)) {
    return (
      <section
        className="alert"
        role="alert"
        aria-labelledby="error-sesion-title"
      >
        <h1 id="error-sesion-title" className="alert-title">
          No se pudo verificar la sesión
        </h1>
        <p className="alert-message">{mensajeErrorSesion}</p>
        <div className="alert-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={reintentarSesion}
          >
            Reintentar
          </button>
          <Link to="/" className="btn btn-secondary">
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

  if (autenticado && !errorSesion && RUTAS_PUBLICAS_BLOQUEADAS.has(pathname)) {
    return (
      <Navigate
        to={onboardingCompletado ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  if (pathname === "/onboarding") {
    if (!autenticado) return <Navigate to="/iniciar-sesion" replace />;
    if (onboardingCompletado) return <Navigate to="/dashboard" replace />;
  }

  if (pathname === "/dashboard") {
    if (!autenticado) return <Navigate to="/iniciar-sesion" replace />;
    if (!onboardingCompletado) return <Navigate to="/onboarding" replace />;
  }

  return (
    <Suspense fallback={<Loading status="Cargando página..." />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/precios" element={<Price />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
        <Route path="/restablecer-contrasena" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
