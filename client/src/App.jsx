import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Header from "@components/Header";
import Footer from "@components/Footer";
import AppRoutes from "@/routes/routes";
import AuthProvider from "@/context/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { BrowserRouter, useLocation } from "react-router";

function AppShell() {
  const { pathname } = useLocation();
  const { token, verificandoSesion } = useAuth();
  const [tipografiaLista, setTipografiaLista] = useState(false);
  const [errorTipografia, setErrorTipografia] = useState(null);
  const [intentoCargaTipografia, setIntentoCargaTipografia] = useState(0);
  const isAuthPage = ["/iniciar-sesion", "/registrarse"].includes(pathname);
  const isAppPage = ["/onboarding", "/dashboard"].includes(pathname);
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    let cancelado = false;

    const cargarTipografia = async () => {
      try {
        await Promise.all([
          document.fonts.load('16px "Asap"'),
          document.fonts.load('16px "Quicksand"'),
        ]);
        if (!cancelado) setTipografiaLista(true);
      } catch (error) {
        if (!cancelado) setErrorTipografia(error);
      }
    };

    cargarTipografia();

    return () => {
      cancelado = true;
    };
  }, [intentoCargaTipografia]);

  if (errorTipografia) {
    const mensajeError =
      errorTipografia instanceof Error
        ? errorTipografia.message
        : String(errorTipografia);

    return (
      <section role="alert" aria-labelledby="error-tipografia-title">
        <h1 id="error-tipografia-title">No se pudo cargar la tipografía</h1>
        <p>{mensajeError}</p>
        <button
          type="button"
          onClick={() => {
            setTipografiaLista(false);
            setErrorTipografia(null);
            setIntentoCargaTipografia((intento) => intento + 1);
          }}
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (!tipografiaLista || verificandoSesion) {
    return (
      <Loading
        status={
          tipografiaLista ? "Verificando sesión..." : "Cargando tipografía..."
        }
      />
    );
  }

  return (
    <>
      {!isAuthPage && !isAuthenticated && <Header />}
      <AppRoutes />
      {!isAuthPage && !isAppPage && !isAuthenticated && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
