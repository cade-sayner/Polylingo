// API client
//--------------------------------------------------------------------------------------------------------------------------
let token: string | null = null;
import { API_BASE_URL } from "./constants";
import { navigateTo } from "./navigation";

export function setToken(newToken: string|null) {
  token = newToken;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if(response.status === 401){
      localStorage.removeItem("polylingo_jwt")
      setToken(null);
      navigateTo("/login");
    }
    throw new Error(`HTTP error ${response.status}, Message: ${(await response.json() as { message: string }).message}`);
  }
  return response.json();
}