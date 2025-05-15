import { navigateTo } from "../navigation";
import { apiFetch } from "../api-client";
export class LandingPage {
    render() {
        return [document.createElement("section")];
    }
    async load() {
        let role = await apiFetch("/api/users/role");
        if (role === null || role === void 0 ? void 0 : role.role) {
            role;
            if (role.role === "USER") {
                navigateTo("/landing/user");
                return;
            }
            if (role.role === "INSTRUCTOR") {
                navigateTo("/landing/instructor");
            }
        }
    }
}
