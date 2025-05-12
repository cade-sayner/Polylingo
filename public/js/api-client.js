// API client
//--------------------------------------------------------------------------------------------------------------------------
let token = null;
import { API_BASE_URL } from "./constants";
import { navigateTo } from "./navigation";
export function setToken(newToken) {
    token = newToken;
}
export async function apiFetch(path, options = {}) {
    const headers = Object.assign(Object.assign({}, (options.headers || {})), { Authorization: token ? `Bearer ${token}` : "", "Content-Type": "application/json" });
    const response = await fetch(`${API_BASE_URL}${path}`, Object.assign(Object.assign({}, options), { headers }));
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("polylingo_jwt");
            setToken(null);
            navigateTo("/login");
        }
        throw new Error(`HTTP error ${response.status}, Message: ${(await response.json()).message}`);
    }
    return response.json();
}
export async function getFillBlankQuestion(language) {
    // no this needs to go through the api client
    let response = await apiFetch(`/api/fill_blank/user?language=${language}`);
    return response;
}
export async function auditFillBlank(fillBlankId, correct, currentUserId) {
    if (!currentUserId) {
        throw new Error("Failed to audit");
    }
    console.log(fillBlankId);
    await apiFetch("/api/audit/fill-blank", {
        method: "Post",
        body: JSON.stringify({
            userId: currentUserId,
            fillBlankQuestionId: fillBlankId,
            answerCorrect: correct
        })
    });
}
