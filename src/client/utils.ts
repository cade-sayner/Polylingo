import { apiFetch } from "./api-client";
import { User } from "./types";

export async function getSignedInUser(){
    return await apiFetch("/api/users") as User
}