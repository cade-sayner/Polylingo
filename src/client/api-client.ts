// API client
//--------------------------------------------------------------------------------------------------------------------------
let token: string | null = null;
import { API_BASE_URL } from "./constants";
import { navigateTo } from "./navigation";
import { FillBlankQuestion, Language } from "./types";

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

export async function getFillBlankQuestion(language: Language): Promise<FillBlankQuestion>{
        // no this needs to go through the api client
        let response = await apiFetch(`/api/fill_blank/user?language=${language}`);
        return response as FillBlankQuestion;
}


export async function auditFillBlank(fillBlankId: number, correct: boolean, currentUserId : number) {
    if(!currentUserId){throw new Error("Failed to audit");}
    console.log(fillBlankId);
    await apiFetch("/api/audit/fill-blank", {
        method:"Post",
        body: JSON.stringify({
            userId: currentUserId,
            fillBlankQuestionId: fillBlankId,
            answerCorrect: correct
        })
    })
}