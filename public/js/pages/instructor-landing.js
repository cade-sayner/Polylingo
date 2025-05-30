import { LandingCard } from "../components/landing-card";
import { Navbar } from "../components/navbar";
export class InstructorLandingPage {
    render() {
        const CardComponent = new LandingCard();
        const landingTemplate = document.querySelector("#user-landing-template").content.cloneNode(true);
        landingTemplate.querySelector(".landing-container");
        const cardContainer = landingTemplate.querySelector(".landing-cards");
        cardContainer.append(...[
            CardComponent.render({ imageUrl: "/img/stack-of-books.png", caption: "Create a fill in the blank question", redirectUri: "/exercise/fill-blank", title: "Create Fill in the Blank Question" }),
            CardComponent.render({ imageUrl: "/img/translate.png", caption: "Create a translation question", redirectUri: "/exercise/translate", title: "Create Translation Question" }),
        ]);
        return [
            new Navbar(false).render(),
            cardContainer
        ];
    }
    load() {
        return;
    }
}
