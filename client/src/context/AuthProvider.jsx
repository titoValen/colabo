import { useEffect, useState, useRef, useCallback } from "react";
import { AuthContext } from "@/hooks/useAuth";
import { apiFetch } from "@/services/api";

const MAX_RETRIES = 3;

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  });
  const [isCheckingSession, setIsCheckingSession] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );
  const [sessionError, setSessionError] = useState("");
  const [sessionRetryTrigger, setSessionRetryTrigger] = useState(0);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const saveSession = ({ token, user: authenticatedUser }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(authenticatedUser));

    setToken(token);
    setUser(authenticatedUser);
    setIsCheckingSession(false);
    setSessionError("");
    setIsSessionExpired(false);
  };

  const retryTimer = useRef(null);

  const register = async (data) =>
    saveSession(await apiFetch("/register", { method: "POST", body: data }));

  const login = async (data) =>
    saveSession(await apiFetch("/login", { method: "POST", body: data }));

  const updateOnboardingStatus = async (body) => {
    const response = await apiFetch("/onboarding", {
      method: "POST",
      body,
      token,
    });
    localStorage.setItem("usuario", JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const completeOnboarding = (data) => updateOnboardingStatus(data);

  const skipOnboarding = () => updateOnboardingStatus({ saltar: true });

  const cancelRetry = useCallback(() => {
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }
  }, []);

  const logout = async () => {
    try {
      cancelRetry();
      await apiFetch("/logout", { method: "POST", token });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      setToken(null);
      setUser(null);
      setSessionError("");
      setIsCheckingSession(false);
    }
  };

  const clearLocalSession = useCallback(() => {
    cancelRetry();
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUser(null);
    setSessionError(null);
    setIsCheckingSession(false);
    setIsSessionExpired(true);
  }, [cancelRetry]);

  const clearSessionExpiredNotice = useCallback(() => {
    setIsSessionExpired(false);
  }, []);

  // Each execution is an independent cycle, so a retry cannot update state
  // after the token changes or the session is closed.
  useEffect(() => {
    if (!token) return undefined;

    let isCancelled = false;
    let retryCount = 0;

    const verifySession = async () => {
      try {
        const { user } = await apiFetch("/me", { token });
        if (isCancelled) return;

        localStorage.setItem("usuario", JSON.stringify(user));
        setUser(user);
        setSessionError(null);
        setIsCheckingSession(false);
      } catch (error) {
        if (isCancelled) return;

        // Only a 401 invalidates the session; other errors are recoverable.
        if (error.status === 401) {
          clearLocalSession();
          return;
        }

        setSessionError(error);

        if (retryCount < MAX_RETRIES) {
          const delay = 1000 * 2 ** retryCount;
          retryCount += 1;
          retryTimer.current = setTimeout(verifySession, delay);
        } else {
          setIsCheckingSession(false);
        }
      }
    };

    verifySession();

    return () => {
      isCancelled = true;
      cancelRetry();
    };
  }, [token, sessionRetryTrigger, clearLocalSession, cancelRetry]);

  const retrySession = useCallback(() => {
    if (!token) return;

    cancelRetry();
    setSessionError(null);
    setIsCheckingSession(true);
    setSessionRetryTrigger((count) => count + 1);
  }, [token, cancelRetry]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        register,
        login,
        logout,
        completeOnboarding,
        skipOnboarding,
        isCheckingSession,
        sessionError,
        retrySession,
        isSessionExpired,
        clearSessionExpiredNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
