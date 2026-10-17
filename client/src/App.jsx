import Header from "@components/Header";
import Footer from "@components/Footer";
import AppRoutes from "@/routes/routes";
import AuthProvider from "@/context/AuthProvider";
import { BrowserRouter, useLocation } from "react-router";

function AppShell() {
  const { pathname } = useLocation();
  const isAuthPage = ["/iniciar-sesion", "/registrarse"].includes(pathname);

  return (
    <div className="app-shell">
      {!isAuthPage && <Header />}
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
