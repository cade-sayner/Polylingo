import { navigateTo } from "../navigation";
export class LandingCard {
    render(props) {
        return this.createLandingCard(props);
    }
    createLandingCard({ imageUrl, title, caption, redirectUri }) {
        const template = document.getElementById("landing-card-template");
        if (!template)
            return;
        const clone = template.content.cloneNode(true);
        const headerEl = clone.querySelector("#landing-card-header");
        if (headerEl)
            headerEl.textContent = title;
        const captionEl = clone.querySelector("#landing-card-caption");
        if (captionEl)
            captionEl.textContent = caption;
        const imageEl = clone.querySelector("#landing-card-image");
        if (imageEl)
            imageEl.src = imageUrl;
        const buttonEl = clone.querySelector("#landing-card-container");
        if (buttonEl && redirectUri) {
            buttonEl.onclick = () => navigateTo(redirectUri);
        }
        return clone.firstElementChild;
    }
}
