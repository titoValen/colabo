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
const Groups = lazy(() => import("@/pages/Groups"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const Events = lazy(() => import("@/pages/Events"));
const Expenses = lazy(() => import("@/pages/Expenses"));
const Agreements = lazy(() => import("@/pages/Agreements"));
const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const PUBLIC_ONLY_ROUTES = new Set([
  "/",
  "/iniciar-sesion",
  "/registrarse",
  "/recuperar-contrasena",
  "/restablecer-contrasena",
]);

const PUBLIC_ROUTES = new Set([...PUBLIC_ONLY_ROUTES, "/precios"]);
const AUTHENTICATED_REDIRECT_ROUTES = PUBLIC_ONLY_ROUTES;
const APP_ROUTES = new Set([
  "/dashboard",
  "/grupos",
  "/tareas",
  "/eventos",
  "/gastos",
  "/acuerdos",
  "/perfil",
]);

export default function AppRoutes() {
  const { pathname } = useLocation();
  const {
    token,
    user,
    isCheckingSession,
    sessionError,
    retrySession,
    isSessionExpired,
    clearSessionExpiredNotice,
  } = useAuth();
  const isAuthenticated = Boolean(token);
  const isOnboardingCompleted = Boolean(user?.onboarding_completed);
  const sessionErrorMessage =
    typeof sessionError === "string"
      ? sessionError
      : (sessionError?.message ??
        "No pudimos verificar tu sesión. Intentá nuevamente.");

  useEffect(() => {
    if (!isSessionExpired) return;

    toast.error("Tu sesión no está activa. Inicia sesión para continuar.", {
      id: "sesion-expirada",
    });
    if (pathname === "/") clearSessionExpiredNotice();
  }, [clearSessionExpiredNotice, pathname, isSessionExpired]);

  if (isCheckingSession) {
    return <Loading />;
  }

  if (isSessionExpired && pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  if (sessionError && !PUBLIC_ROUTES.has(pathname)) {
    return (
      <section
        className="alert"
        role="alert"
        aria-labelledby="error-sesion-title"
      >
        <h1 id="error-sesion-title" className="alert-title">
          No se pudo verificar la sesión
        </h1>
        <p className="alert-message">{sessionErrorMessage}</p>
        <div className="alert-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={retrySession}
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

  if (
    isAuthenticated &&
    !sessionError &&
    AUTHENTICATED_REDIRECT_ROUTES.has(pathname)
  ) {
    return (
      <Navigate
        to={isOnboardingCompleted ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  if (pathname === "/onboarding") {
    if (!isAuthenticated) return <Navigate to="/iniciar-sesion" replace />;
    if (isOnboardingCompleted) return <Navigate to="/dashboard" replace />;
  }

  if (APP_ROUTES.has(pathname)) {
    if (!isAuthenticated) return <Navigate to="/iniciar-sesion" replace />;
    if (!isOnboardingCompleted) return <Navigate to="/onboarding" replace />;
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
        <Route path="/grupos" element={<Groups />} />
        <Route path="/tareas" element={<Tasks />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/gastos" element={<Expenses />} />
        <Route path="/acuerdos" element={<Agreements />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
