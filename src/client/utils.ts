import { apiFetch } from "./api-client";
import { JwtPayload, User } from "./types";

export async function getSignedInUser(){
    return await apiFetch("/api/users") as User
}
