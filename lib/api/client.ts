const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function getAuthToken(): Promise<string | null> {
  // TODO: Integrate with existing JWT auth system
  // For now, read from localStorage or cookie
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    let message = `API error ${response.status}`;
    try {
      const parsed = JSON.parse(body);
      message = parsed.message || message;
    } catch {
      // use default message
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
};

export { ApiError };
