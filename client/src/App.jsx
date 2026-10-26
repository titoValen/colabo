import Header from "@components/Header";
import Footer from "@components/Footer";
import AppRoutes from "@/routes/routes";
import AuthProvider from "@/context/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { BrowserRouter, useLocation } from "react-router";

function AppShell() {
  const { pathname } = useLocation();
  const { token } = useAuth();
  const isAuthPage = ["/iniciar-sesion", "/registrarse"].includes(pathname);
  const isAuthenticated = Boolean(token);

  return (
    <>
      {!isAuthPage && !isAuthenticated && <Header />}
      <AppRoutes />
      {!isAuthPage && <Footer />}
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
