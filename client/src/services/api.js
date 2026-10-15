const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message ?? "Error en la solicitud");
    error.status = res.status;
    error.errors = data?.errors ?? {};
    throw error;
  }
  return data;
}
