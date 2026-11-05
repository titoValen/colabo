import { Children, useState } from "react";
import AppSidebar from "@components/AppSidebar";
import HideSidebarIcon from "@/assets/icons/hide_sidebar.svg";
import ColaboLogo from "@/assets/colabo_isotipo.svg";
import "@/styles/app.css";

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [header, ...content] = Children.toArray(children);

  const toggleSidebar = () => setIsSidebarOpen((isOpen) => !isOpen);

  return (
    <div
      className={`app-layout${isSidebarOpen ? "" : " is-sidebar-collapsed"}`}
    >
      <AppSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <main className="app-main">
        <div className="app-main-header">
          {!isSidebarOpen && (
            <button
              type="button"
              className="app-sidebar-open"
              onClick={toggleSidebar}
              aria-label="Mostrar menú lateral"
              aria-expanded={isSidebarOpen}
              aria-controls="app-sidebar"
            >
              <figure className="app-sidebar-open-figure app-sidebar-open-logo">
                <img
                  className="app-sidebar-open-logo-img"
                  src={ColaboLogo}
                  alt="Colabo"
                />
              </figure>
              <figure className="app-sidebar-open-figure app-sidebar-open-icon">
                <img
                  className="app-sidebar-open-icon-img"
                  src={HideSidebarIcon}
                  alt=""
                />
              </figure>
            </button>
          )}
          {header}
        </div>
        {content}
      </main>
    </div>
  );
}
