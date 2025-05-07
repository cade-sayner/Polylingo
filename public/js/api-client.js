// API client
//--------------------------------------------------------------------------------------------------------------------------
let token = null;
import { API_BASE_URL } from "./constants";
export function setToken(newToken) {
    token = newToken;
}
export async function apiFetch(path, options = {}) {
    const headers = Object.assign(Object.assign({}, (options.headers || {})), { Authorization: token ? `Bearer ${token}` : "", "Content-Type": "application/json" });
    const response = await fetch(`${API_BASE_URL}${path}`, Object.assign(Object.assign({}, options), { headers }));
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}, Message: ${(await response.json()).message}`);
    }
    return response.json();
}
