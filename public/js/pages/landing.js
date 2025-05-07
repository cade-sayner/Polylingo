import { navigateTo } from "../navigation";
import { apiFetch } from "../api-client";
export async function loadLandingPage() {
    let role = await apiFetch("/api/users/role");
    if (role.role == "USER") {
        navigateTo("/landing/user");
        return;
    }
    if (role.role == "INSTRUCTOR") {
        navigateTo("/landing/instructor");
    }
}
