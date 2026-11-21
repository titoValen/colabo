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

const MESSAGES_BY_STATUS = {
  400: "Revisa los datos enviados e intenta nuevamente.",
  401: "Tu sesión venció. Vuelve a iniciar sesión.",
  403: "No tienes permiso para realizar esta acción.",
  404: "No encontramos lo que buscas.",
  422: "Revisa los datos ingresados.",
  429: "Hiciste demasiados intentos. Espera un momento.",
};

const SERVER_ERROR_MESSAGE =
  "Tenemos un problema en el servidor. Intenta más tarde.";

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  // Con FormData el navegador define el Content-Type (multipart + boundary).
  const isFormData = body instanceof FormData;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "No pudimos conectarnos con Colabo. Revisa tu conexión e intenta nuevamente.",
      { code: "network" },
    );
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const esServidor = res.status >= 500;

    throw new ApiError(
      esServidor
        ? SERVER_ERROR_MESSAGE
        : (MESSAGES_BY_STATUS[res.status] ?? "Error en la solicitud."),
      {
        status: res.status,
        code: data?.code ?? (esServidor ? "server_error" : "request_error"),
        errors: data?.errors ?? {},
      },
    );
  }
  return data;
}
