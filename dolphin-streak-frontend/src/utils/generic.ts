import { selectBackendUrl } from "./backend-selector";

export const fetchAPI = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, any>
): Promise<T> => {
  const backendUrl = selectBackendUrl();
  const url = `${backendUrl}${endpoint}`;

  console.log(`Fetching from ${url} with method ${method} and body:`, body);

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = Array.isArray(errorData.messages)
      ? errorData.messages.join(", ")
      : errorData.messages || "HTTP error!";
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    console.error(`Error fetching from ${url}: ${errorMessage}`);
    throw error;
  }

  const data = await response.json();
  console.log(`Fetched data from ${url}:`, data);
  return data;
};
