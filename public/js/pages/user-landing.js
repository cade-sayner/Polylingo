import { LandingCard } from "../components/landing-card";
import { Navbar } from "../components/navbar";
export class UserLandingPage {
    render() {
        const CardComponent = new LandingCard();
        const landingTemplate = document.querySelector("#user-landing-template").content.cloneNode(true);
        const cardContainer = landingTemplate.querySelector(".landing-cards");
        cardContainer.append(...[
            CardComponent.render({ imageUrl: "/img/stack-of-books.png", caption: "Given a sentence, fill in the missing word.", redirectUri: "/exercise/fill-blank", title: "Fill in the Blank" }),
            CardComponent.render({ imageUrl: "/img/translate.png", caption: "Given a word, provide the correct translation.", redirectUri: "/exercise/translate", title: "Translation" }),
        ]);
        return [
            new Navbar(false).render(),
            landingTemplate
        ];
    }
    load() {
        return;
    }
}
