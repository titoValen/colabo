import Header from "@components/Header";
import Footer from "@components/Footer";
import AppRoutes from "@/routes/routes";
import { BrowserRouter } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Footer />
      <AppRoutes />
    </BrowserRouter>
  );
}
