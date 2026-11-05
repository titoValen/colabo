const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(message, { status = 0, code = "unknown", errors = {} } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

const MENSAJES_POR_ESTADO = {
  400: "Revisá los datos enviados e intentá de nuevo.",
  401: "Tu sesión venció. Volvé a iniciar sesión.",
  403: "No tenés permiso para hacer esto.",
  404: "No encontramos lo que buscabas.",
  422: "Revisá los datos ingresados.",
  429: "Hiciste demasiados intentos. Esperá un momento.",
};

const MENSAJE_ERROR_SERVIDOR =
  "Tenemos un problema en el servidor. Intentá más tarde.";

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "No pudimos conectarnos con Colabo. Revisá tu conexión e intentá de nuevo.",
      { code: "network" },
    );
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const esServidor = res.status >= 500;

    throw new ApiError(
      esServidor
        ? MENSAJE_ERROR_SERVIDOR
        : (MENSAJES_POR_ESTADO[res.status] ?? "Error en la solicitud."),
      {
        status: res.status,
        code: data?.code ?? (esServidor ? "server_error" : "request_error"),
        errors: data?.errors ?? {},
      },
    );
  }
  return data;
}
