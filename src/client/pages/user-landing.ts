import { LandingCard } from "../components/landing-card";
import { Navbar } from "../components/navbar";
import { BasePage } from "../types";

export class UserLandingPage implements BasePage {
    render() {
        const CardComponent = new LandingCard();
        return `
            ${(new Navbar(false)).render()}
            ${
                document.querySelector("#user-landing-template")?.innerHTML
                .replace("TEMPLATE:CARDS", 
                 [
                    CardComponent.render({imageUrl: "/img/stack-of-books.png", caption:"Given a sentence, fill in the missing word.", redirectUri:"/exercise/fill-blank", title:"Fill in the Blank"}),
                    CardComponent.render({imageUrl: "/img/translate.png", caption:"Given a word, provide the correct translation.", redirectUri:"/exercise/translate", title:"Translation"}),
                 ].join(""))
            }
        `
    }

    load(){
        return;
    }
}