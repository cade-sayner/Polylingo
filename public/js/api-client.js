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
export async function getFillBlankQuestionForUser(language) {
    let response = await apiFetch(`/api/fill_blank/user?language=${language}`);
    return response;
}
export async function getTranslationQuestionForUser(language, toEnglish) {
    if (toEnglish) {
        let response = await apiFetch(`/api/translationquestions/user?prompt_language=${language}&answer_language=English`);
        return response;
    }
    else {
        let response = await apiFetch(`/api/translationquestions/user?prompt_language=English&answer_language=${language}`);
        return response;
    }
}
export async function fetchLanguages() {
    try {
        const response = await apiFetch("/api/languages");
        const languages = (await response).map((lang) => ({
            language_id: lang.languageId,
            language_name: lang.languageName
        }));
        return languages;
    }
    catch (error) {
        console.error("Failed to load languages:", error);
    }
}
export async function auditFillBlank(fillBlankId, correct, currentUserId) {
    if (!currentUserId) {
        throw new Error("Failed to audit");
    }
    await apiFetch("/api/audit/fill-blank", {
        method: "Post",
        body: JSON.stringify({
            userId: currentUserId,
            fillBlankQuestionId: fillBlankId,
            answerCorrect: correct
        })
    });
}
export async function auditTranslation(translationQuestionId, correct, currentUserId) {
    if (!currentUserId) {
        throw new Error("Failed to audit");
    }
    await apiFetch("/api/audit/translation", {
        method: "Post",
        body: JSON.stringify({
            userId: currentUserId,
            translationQuestionId: translationQuestionId,
            answerCorrect: correct
        })
    });
}
export async function getExistingTranslationQuestions(answerWordId) {
    let response = await apiFetch(`/api/translationquestions?answerWordId=${answerWordId}`);
    return response;
}
export async function getExistingFillBlankQuestions(answerWordId) {
    let response = await apiFetch(`/api/fill_blank?answerWordId=${answerWordId}`);
    return response;
}
export async function deleteFillBlankQuestion(questionId) {
    await apiFetch(`/api/fill_blank/${questionId}`, {
        method: "Delete"
    });
}
export async function deleteTranslationQuestion(questionId) {
    await apiFetch(`/api/translationquestions/${questionId}`, {
        method: "Delete"
    });
}
