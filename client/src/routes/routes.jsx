import { lazy, Suspense } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

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

const PUBLIC_ONLY_ROUTES = new Set([
  "/",
  "/iniciar-sesion",
  "/registrarse",
  "/recuperar-contrasena",
  "/restablecer-contrasena",
]);

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
    usuario: user,
    verificandoSesion: verifyingSession,
    errorSesion: sessionError,
  } = useAuth();
  const isAuthenticated = Boolean(token);
  const isOnboardingCompleted = Boolean(user?.onboarding_completed);

  if (verifyingSession) {
    return <p role="status">Verificando sesión...</p>;
  }

  if (sessionError) {
    return <p role="alert">No se pudo verificar la sesión: {sessionError}</p>;
  }

  if (isAuthenticated && PUBLIC_ONLY_ROUTES.has(pathname)) {
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
    <Suspense fallback={<p>Cargando...</p>}>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
