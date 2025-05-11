import { apiFetch } from "./api-client";
export async function getSignedInUser() {
    return await apiFetch("/api/users");
}
