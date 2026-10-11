function resolveApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return "http://localhost:4000/api/v1";
}

const API_BASE_URL = resolveApiBaseUrl();

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const config: RequestInit = {
    method: data ? "POST" : "GET",
    credentials: "include", // send httpOnly cookies
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorJson = await response.json();
      errorMessage = errorJson?.error?.message || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
