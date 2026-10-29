import { useEffect, useState, useRef, useCallback } from "react";
import { AuthContext } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";

const MAX_REINTENTOS = 3;

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  });
  const [verificandoSesion, setVerificandoSesion] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );
  const [errorSesion, setErrorSesion] = useState("");
  const [disparoSesion, setDisparoSesion] = useState(0);

  const guardarSesion = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(user));

    setToken(token);
    setUsuario(user);
    setVerificandoSesion(false);
    setErrorSesion("");
  };

  const timerReintento = useRef(null);

  const register = async (datos) =>
    guardarSesion(await apiFetch("/register", { method: "POST", body: datos }));

  const login = async (datos) =>
    guardarSesion(await apiFetch("/login", { method: "POST", body: datos }));

  const actualizarEstadoOnboarding = async (body) => {
    const response = await apiFetch("/onboarding", {
      method: "POST",
      body,
      token,
    });
    localStorage.setItem("usuario", JSON.stringify(response.user));
    setUsuario(response.user);
    return response;
  };

  const completarOnboarding = (datos) => actualizarEstadoOnboarding(datos);

  const saltarOnboarding = () => actualizarEstadoOnboarding({ saltar: true });

  const cancelarReintento = useCallback(() => {
    if (timerReintento.current) {
      clearTimeout(timerReintento.current);
      timerReintento.current = null;
    }
  }, []);

  const logout = async () => {
    try {
      cancelarReintento();
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

  const cerrarSesionLocal = useCallback(() => {
    cancelarReintento();
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
    setErrorSesion(null);
    setVerificandoSesion(false);
  }, [cancelarReintento]);

  // Cada ejecución representa un ciclo independiente; así un reintento no
  // puede actualizar el estado después de que cambió el token o se cerró sesión.
  useEffect(() => {
    if (!token) return undefined;

    let cancelado = false;
    let intento = 0;

    const verificar = async () => {
      try {
        const { user } = await apiFetch("/me", { token });
        if (cancelado) return;

        localStorage.setItem("usuario", JSON.stringify(user));
        setUsuario(user);
        setErrorSesion(null);
        setVerificandoSesion(false);
      } catch (error) {
        if (cancelado) return;

        // Solo un 401 invalida la sesión; los demás errores son recuperables.
        if (error.status === 401) {
          cerrarSesionLocal();
          return;
        }

        setErrorSesion(error);

        if (intento < MAX_REINTENTOS) {
          const demora = 1000 * 2 ** intento;
          intento += 1;
          timerReintento.current = setTimeout(verificar, demora);
        } else {
          setVerificandoSesion(false);
        }
      }
    };

    verificar();

    return () => {
      cancelado = true;
      cancelarReintento();
    };
  }, [token, disparoSesion, cerrarSesionLocal, cancelarReintento]);

  // Lo llama un botón "Reintentar" desde la UI
  const reintentarSesion = useCallback(() => {
    if (!token) return;

    cancelarReintento();
    setErrorSesion(null);
    setVerificandoSesion(true);
    setDisparoSesion((n) => n + 1);
  }, [token, cancelarReintento]);

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
        reintentarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
