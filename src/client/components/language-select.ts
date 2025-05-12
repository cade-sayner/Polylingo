import { BaseComponent } from "../types";

export class LanguageSelection implements BaseComponent{
    render(){
        return document.querySelector("#language-select")?.innerHTML ?? "";
    }
}