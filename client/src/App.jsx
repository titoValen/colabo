import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Header from "@components/Header";
import Footer from "@components/Footer";
import AppRoutes from "@/routes/routes";
import AuthProvider from "@/context/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { BrowserRouter, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";

function AppShell() {
  const { pathname } = useLocation();
  const { token, isCheckingSession, sessionError } = useAuth();
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [fontError, setFontError] = useState(null);
  const [fontLoadAttempt, setFontLoadAttempt] = useState(0);
  const isAuthPage = ["/iniciar-sesion", "/registrarse"].includes(pathname);
  const isAppPage = ["/onboarding", "/dashboard"].includes(pathname);
  const isAuthenticated = Boolean(token) && !(sessionError && !isAppPage);

  useEffect(() => {
    let isCancelled = false;

    const loadFonts = async () => {
      try {
        await Promise.all([
          document.fonts.load('16px "Asap"'),
          document.fonts.load('16px "Quicksand"'),
        ]);
        if (!isCancelled) setIsFontLoaded(true);
      } catch (error) {
        if (!isCancelled) setFontError(error);
      }
    };

    loadFonts();

    return () => {
      isCancelled = true;
    };
  }, [fontLoadAttempt]);

  if (fontError) {
    const errorMessage =
      fontError instanceof Error ? fontError.message : String(fontError);

    return (
      <section role="alert" aria-labelledby="error-tipografia-title">
        <h1 id="error-tipografia-title">No se pudo cargar la tipografía</h1>
        <p>{errorMessage}</p>
        <button
          type="button"
          onClick={() => {
            setIsFontLoaded(false);
            setFontError(null);
            setFontLoadAttempt((attempt) => attempt + 1);
          }}
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (!isFontLoaded || isCheckingSession) {
    return (
      <Loading
        status={
          isFontLoaded ? "Verificando sesión..." : "Cargando tipografía..."
        }
      />
    );
  }

  return (
    <>
      <Toaster position="top-center" />
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
