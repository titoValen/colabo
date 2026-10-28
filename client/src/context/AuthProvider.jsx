import { useEffect, useState } from "react";
import { AuthContext } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  });
  const [verificandoSesion, setVerificandoSesion] = useState(
    () => Boolean(localStorage.getItem("token")),
  );
  const [errorSesion, setErrorSesion] = useState("");

  const guardarSesion = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(user));

    setToken(token);
    setUsuario(user);
    setVerificandoSesion(false);
    setErrorSesion("");
  };

  const register = async (datos) =>
    guardarSesion(await apiFetch("/register", { method: "POST", body: datos }));

  const login = async (datos) =>
    guardarSesion(await apiFetch("/login", { method: "POST", body: datos }));

  const actualizarEstadoOnboarding = async (body) => {
    const response = await apiFetch("/onboarding", { method: "POST", body, token });
    localStorage.setItem("usuario", JSON.stringify(response.user));
    setUsuario(response.user);
    return response;
  };

  const completarOnboarding = (datos) => actualizarEstadoOnboarding(datos);

  const saltarOnboarding = () =>
    actualizarEstadoOnboarding({ saltar: true });

  const logout = async () => {
    try {
      await apiFetch("/logout", { method: "POST", token });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      setToken(null);
      setUsuario(null);
      setErrorSesion("");
      setVerificandoSesion(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let activo = true;

    apiFetch("/me", { token })
      .then(({ user: usuarioActual }) => {
        if (!activo) return;
        localStorage.setItem("usuario", JSON.stringify(usuarioActual));
        setUsuario(usuarioActual);
      })
      .catch((error) => {
        if (!activo) return;
        if (error.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setToken(null);
          setUsuario(null);
          return;
        }
        setErrorSesion(error.message);
      })
      .finally(() => {
        if (activo) setVerificandoSesion(false);
      });

    return () => {
      activo = false;
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        register,
        login,
        logout,
        completarOnboarding,
        saltarOnboarding,
        verificandoSesion,
        errorSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
