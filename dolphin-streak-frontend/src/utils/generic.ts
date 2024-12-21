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

  console.log(
    `Fetching from ${url.toString()} with method ${method} and body:`,
    body
  );

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = Array.isArray(errorData.messages)
      ? errorData.messages.join(", ")
      : errorData.messages || "HTTP error!";
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    console.error(`Error fetching from ${url.toString()}: ${errorMessage}`);
    throw error;
  }

  const data = await response.json();
  console.log(`Fetched data from ${url.toString()}:`, data);
  return data;
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};