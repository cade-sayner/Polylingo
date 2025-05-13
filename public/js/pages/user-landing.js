import { LandingCard } from "../components/landing-card";
import { Navbar } from "../components/navbar";
export class UserLandingPage {
    render() {
        var _a;
        const CardComponent = new LandingCard();
        return `
            ${(new Navbar(false)).render()}
            ${(_a = document.querySelector("#user-landing-template")) === null || _a === void 0 ? void 0 : _a.innerHTML.replace("TEMPLATE:CARDS", [
            CardComponent.render({ imageUrl: "/img/stack-of-books.png", caption: "Given a sentence, fill in the missing word.", redirectUri: "/exercise/fill-blank", title: "Fill in the Blank" }),
            CardComponent.render({ imageUrl: "/img/translate.png", caption: "Given a word, provide the correct translation.", redirectUri: "/exercise/translate", title: "Translation" }),
        ].join(""))}
        `;
    }
    load() {
        return;
    }
}
