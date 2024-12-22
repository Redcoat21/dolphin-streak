import { selectBackendUrl } from "./backend-selector";

interface FetchOptions {
  body?: Record<string, any>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  token?: string;
}

export const fetchAPI = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  { body, params, query, token }: FetchOptions = {}
): Promise<T> => {
  const backendUrl = selectBackendUrl();
  const url = new URL(`${backendUrl}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
  }

  if (query) {
    Object.entries(query).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        Array.isArray(errorData.messages)
          ? errorData.messages[0]
          : errorData.message || "An error occurred"
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
