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

const RUTAS_PUBLICAS_BLOQUEADAS = new Set([
  "/",
  "/iniciar-sesion",
  "/registrarse",
  "/recuperar-contrasena",
  "/restablecer-contrasena",
]);

export default function AppRoutes() {
  const { pathname } = useLocation();
  const {
    token,
    usuario,
    verificandoSesion,
    errorSesion,
  } = useAuth();
  const autenticado = Boolean(token);
  const onboardingCompletado = Boolean(usuario?.onboarding_completado);

  if (verificandoSesion) {
    return <p role="status">Verificando sesión...</p>;
  }

  if (errorSesion) {
    return <p role="alert">No se pudo verificar la sesión: {errorSesion}</p>;
  }

  if (autenticado && RUTAS_PUBLICAS_BLOQUEADAS.has(pathname)) {
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
