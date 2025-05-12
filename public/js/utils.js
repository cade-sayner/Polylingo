import { apiFetch } from "./api-client";
export async function getSignedInUser() {
    return await apiFetch("/api/users");
}
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
