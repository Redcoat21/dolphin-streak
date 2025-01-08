import { selectBackendUrl } from "./backend-selector";

interface FetchOptions {
  body?: Record<string, any> | FormData;
  params?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  token?: string;
  isFormData?: boolean;
}

export const fetchAPI = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  { body, params, query, token, isFormData }: FetchOptions = {}
): Promise<T> => {
  const backendUrl = selectBackendUrl();
  const url = new URL(`${backendUrl}${endpoint}`);
  // console.log({ url, method, body, params, query, token })
  // Handle path parameters (replace placeholders in the endpoint)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.pathname = url.pathname.replace(`:${key}`, value);
    });
  }

  // Handle query parameters using URLSearchParams
  if (query) {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    url.search = searchParams.toString();
  }

  // Set up headers
  const headers: HeadersInit = isFormData
    ? { Authorization: `Bearer ${token}` }  // Don't set Content-Type for FormData
    : { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) };

  try {
    console.log("Fetching:", url.toString());
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData); // Log the full error response
      console.error({ errorData })
      throw new Error(
        Array.isArray(errorData.messages)
          ? errorData.messages[0]
          : errorData.message || "An error occurred"
      );
    }

    // Parse and return the response
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
