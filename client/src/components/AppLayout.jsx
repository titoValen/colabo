import AppSidebar from "@components/AppSidebar";
import "@/styles/app.css";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <AppSidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
