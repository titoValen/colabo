import { useState } from "react";
import { AuthContext } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  });

  const guardarSesion = ({ token, usuario }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    setToken(token);
    setUsuario(usuario);
  };

  const register = async (datos) =>
    guardarSesion(await apiFetch("/register", { method: "POST", body: datos }));

  const login = async (datos) =>
    guardarSesion(await apiFetch("/login", { method: "POST", body: datos }));

  const logout = async () => {
    try {
      await apiFetch("/logout", { method: "POST", token });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      setToken(null);
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, usuario, register, login, logout }}>
      { children }
    </AuthContext.Provider>
  );
}
