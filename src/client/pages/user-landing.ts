import { LandingCard } from "../components/landing-card";
import { Navbar } from "../components/navbar";
import { BasePage } from "../types";

export class UserLandingPage implements BasePage {
    render() {
        const CardComponent = new LandingCard();

        const landingTemplate = (document.querySelector("#user-landing-template") as HTMLTemplateElement).content.cloneNode(true)
        const cardContainter = Array.from((landingTemplate as HTMLElement).children).find(
        (el) => (el as HTMLElement).classList.contains('landing-cards')
        ) as HTMLElement[][0];

        cardContainter.append(...[
                    CardComponent.render({imageUrl: "/img/stack-of-books.png", caption:"Given a sentence, fill in the missing word.", redirectUri:"/exercise/fill-blank", title:"Fill in the Blank"}),
                    CardComponent.render({imageUrl: "/img/translate.png", caption:"Given a word, provide the correct translation.", redirectUri:"/exercise/translate", title:"Translation"}),
        ]);

        return [
            new Navbar(false).render(),
            cardContainter as HTMLElement
        ]
    }

    load(){
        return;
    }
}