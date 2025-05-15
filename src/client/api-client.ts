// API client
//--------------------------------------------------------------------------------------------------------------------------
let token: string | null = null;
import { API_BASE_URL } from "./constants";
import { navigateTo } from "./navigation";
import { FillBlankQuestion, Language, TranslationQuestion } from "./types";

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

export async function getFillBlankQuestionForUser(language: Language): Promise<FillBlankQuestion>{
        let response = await apiFetch(`/api/fill_blank/user?language=${language}`);
        return response as FillBlankQuestion;
}

export async function getTranslationQuestionForUser(language: Language): Promise<TranslationQuestion> {
    let response = await apiFetch(`/api/translationquestions/user?prompt_language=${language}&answer_language=English`);
    return await response as TranslationQuestion;
}


export async function auditFillBlank(fillBlankId: number, correct: boolean, currentUserId : number) {
    if(!currentUserId){throw new Error("Failed to audit");}
    await apiFetch("/api/audit/fill-blank", {
        method:"Post",
        body: JSON.stringify({
            userId: currentUserId,
            fillBlankQuestionId: fillBlankId,
            answerCorrect: correct
        })
    })
}

export async function auditTranslation(translationQuestionId: number, correct: boolean, currentUserId : number) {
    if(!currentUserId){throw new Error("Failed to audit");}
    await apiFetch("/api/audit/translation", {
        method:"Post",
        body: JSON.stringify({
            userId: currentUserId,
            translationQuestionId: translationQuestionId,
            answerCorrect: correct
        })
    })
}

export async function getExistingTranslationQuestions(answerWordId: number) {
  let response = await apiFetch(`/api/translationquestions?answerWordId=${answerWordId}`);
  return response as TranslationQuestion[];
}

export async function getExistingFillBlankQuestions(answerWordId: number) {
  let response = await apiFetch(`/api/fill_blank?answerWordId=${answerWordId}`);
  return response as FillBlankQuestion[];
}

export async function deleteFillBlankQuestion(questionId: number) {
  await apiFetch(`/api/fill_blank/${questionId}`, {
    method:"Delete"
  })
}

export async function deleteTranslationQuestion(questionId: number) {
  await apiFetch(`/api/translationquestions/${questionId}`, {
    method:"Delete"
  })
}