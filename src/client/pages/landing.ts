import { navigateTo } from "../navigation";
import { apiFetch } from "../api-client";
import {Role} from "../types";
import { BasePage } from "../types";

export class LandingPage implements BasePage{
  render(){
    return `Loading ...`
  }
  async load() {
      let role = await apiFetch("/api/users/role");
      if(role?.role){
        role as Role;
        if (role.role === "USER") {
          navigateTo("/landing/user");
          return
        }
        if (role.role === "INSTRUCTOR") {
          navigateTo("/landing/instructor")
        }
      }
  }
}