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
                    CardComponent.render({imageUrl: "/img/stack-of-books.png", caption:"Create a fill in the blank question", redirectUri:"/exercise/fill-blank", title:"Create Fill in the Blank Question"}),
                    CardComponent.render({imageUrl: "/img/translate.png", caption:"Create a translation question", redirectUri:"/exercise/translate", title:"Create Translation Question"}),
                 ].join(""))
            }
        `
    }

    load(){
        return;
    }
}