import { useState } from "react";
import SearchIcon from "@/assets/icons/search.svg";

export default function DashboardSearchBar() {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form className="dashboard-search" role="search" onSubmit={handleSubmit}>
      <img src={SearchIcon} alt="" />
      <input
        type="search"
        className="dashboard-search-input"
        placeholder="Buscar grupos, tareas o eventos..."
        aria-label="Buscar grupos, tareas o eventos"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  );
}
