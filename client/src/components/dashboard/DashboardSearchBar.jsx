import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import SearchIcon from "@/assets/icons/search.svg";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY_MS = 300;

const EMPTY_RESULTS = { users: [], groups: [], tasks: [] };

const RESULT_SECTIONS = [
  { key: "users", label: "Usuarios" },
  { key: "groups", label: "Grupos" },
  { key: "tasks", label: "Tareas" },
];

export default function DashboardSearchBar() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      return undefined;
    }

    let active = true;

    const timer = setTimeout(() => {
      setOpen(true);
      setLoading(true);
      setError("");

      apiFetch(`/dashboard/search?q=${encodeURIComponent(normalizedQuery)}`, { token })
        .then((data) => {
          if (!active) return;
          setResults({
            users: data.users ?? [],
            groups: data.groups ?? [],
            tasks: data.tasks ?? [],
          });
        })
        .catch((searchError) => {
          if (!active) return;
          setResults(EMPTY_RESULTS);
          setError(searchError.message || "No pudimos realizar la búsqueda.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, SEARCH_DELAY_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, token]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const goToGroup = (groupId) => {
    setOpen(false);
    navigate(`/grupos/${groupId}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim().length >= MIN_QUERY_LENGTH) setOpen(true);
  };

  const handleQueryChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    if (nextQuery.trim().length < MIN_QUERY_LENGTH) {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      setError("");
      setOpen(false);
    }
  };

  const hasResults = RESULT_SECTIONS.some(({ key }) => results[key].length > 0);
  const showResults = open && query.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div className="dashboard-search-container" ref={containerRef}>
      <form className="dashboard-search" role="search" onSubmit={handleSubmit}>
        <img src={SearchIcon} alt="" />
        <input
          type="search"
          className="dashboard-search-input"
          placeholder="Buscar usuarios, grupos o tareas..."
          aria-label="Buscar usuarios, grupos o tareas"
          aria-expanded={showResults}
          aria-controls="dashboard-search-results"
          value={query}
          onFocus={() => query.trim().length >= MIN_QUERY_LENGTH && setOpen(true)}
          onChange={handleQueryChange}
        />
      </form>

      {showResults && (
        <div className="dashboard-search-results" id="dashboard-search-results" role="listbox">
          {loading && <p className="dashboard-search-message">Buscando…</p>}
          {!loading && error && <p className="dashboard-search-message dashboard-search-error">{error}</p>}
          {!loading && !error && !hasResults && (
            <p className="dashboard-search-message">No encontramos resultados.</p>
          )}

          {!loading && !error && hasResults && RESULT_SECTIONS.map(({ key, label }) => {
            if (results[key].length === 0) return null;

            return (
              <section className="dashboard-search-section" key={key}>
                <h2>{label}</h2>
                <ul>
                  {results[key].map((result) => {
                    if (key === "users") {
                      return (
                        <li key={result.id}>
                          <div className="dashboard-search-result dashboard-search-result-static">
                            <strong>{result.name}</strong>
                            <span>{result.email}</span>
                          </div>
                        </li>
                      );
                    }

                    if (key === "groups") {
                      return (
                        <li key={result.id}>
                          <button
                            type="button"
                            className="dashboard-search-result"
                            onClick={() => goToGroup(result.id)}
                          >
                            <strong>{result.name}</strong>
                            <span>{result.type || result.description || "Grupo"}</span>
                          </button>
                        </li>
                      );
                    }

                    return (
                      <li key={result.id}>
                        <button
                          type="button"
                          className="dashboard-search-result"
                          onClick={() => goToGroup(result.group_id)}
                        >
                          <strong>{result.title}</strong>
                          <span>{result.group_name || "Tarea"}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
