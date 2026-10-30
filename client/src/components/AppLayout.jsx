import { useState } from "react";
import AppSidebar from "@components/AppSidebar";
import HideSidebarIcon from "@/assets/icons/hide_sidebar.svg";
import "@/styles/app.css";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((isOpen) => !isOpen);

  return (
    <div
      className={`app-layout${isSidebarOpen ? "" : " is-sidebar-collapsed"}`}
    >
      <AppSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <main className="app-main">
        {!isSidebarOpen && (
          <button
            type="button"
            className="app-sidebar-open"
            onClick={toggleSidebar}
            aria-label="Mostrar menú lateral"
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
          >
            <img src={HideSidebarIcon} alt="" />
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
