import { BaseComponent } from "../types";

export class LanguageSelection implements BaseComponent{
    render(){
        return  (document.querySelector("#language-select") as HTMLTemplateElement).content.cloneNode(true) as HTMLElement ;
    }
}