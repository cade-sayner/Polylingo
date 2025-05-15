import { BaseComponent } from "../types";
import { LanguageSelection } from "./language-select";

export class Navbar implements BaseComponent{
    includeLanguageSelection : boolean = false;
    navbar : HTMLElement;
    
    languageSelectionComponent : LanguageSelection | null;

    constructor(includeLanguageSelection : boolean){
        this.includeLanguageSelection = includeLanguageSelection
        this.languageSelectionComponent = includeLanguageSelection ? new LanguageSelection() : null;
        if(!document.querySelector("#navbar")) throw new Error("Required template is missing from html");
        this.navbar = document.querySelector("#navbar") as HTMLTemplateElement;
    }
    render(){
            const navBar = document.createElement("nav");
            navBar.classList.add("header");
            navBar.appendChild((this.navbar as HTMLTemplateElement).content.cloneNode(true));
            if(this.includeLanguageSelection){
                navBar.appendChild(this.languageSelectionComponent?.render() as Node);
            }
            return navBar as HTMLElement;
        }
    }
