import Header from "@components/Header";
import LandingHeader from "@components/LandingHeader";
import Footer from "@components/Footer";
import AppRoutes from "@/routes/routes";
import AuthProvider from "@/context/AuthProvider";
import { BrowserRouter, useLocation } from "react-router";

function AppShell() {
  const { pathname } = useLocation();
  const isAuthPage = ["/iniciar-sesion", "/registrarse"].includes(pathname);
  const HeaderComponent = pathname === "/landing" ? LandingHeader : Header;

  return (
    <div className="app-shell">
      {!isAuthPage && <HeaderComponent />}
      <AppRoutes />
      {!isAuthPage && <Footer />}
    </div>
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
