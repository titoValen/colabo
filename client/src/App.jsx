import Header from "@components/Header";
import Footer from "@components/Footer";
import AppRoutes from "@/routes/routes";
import AuthProvider from "@/context/AuthProvider";
import { BrowserRouter } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Header />
          <AppRoutes />
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
