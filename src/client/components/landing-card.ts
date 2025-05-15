import { navigateTo } from "../navigation";
import { BaseComponent } from "../types";

export class LandingCard implements BaseComponent{
     
    render(props :{imageUrl : string, title : string, caption: string, redirectUri:string}){
        return this.createLandingCard(props) as HTMLElement;
    }

    createLandingCard({imageUrl, title, caption, redirectUri}) {
    const template = document.getElementById("landing-card-template") as HTMLTemplateElement;
    if (!template) return;

    const clone = template.content.cloneNode(true) as DocumentFragment;

    const headerEl = clone.querySelector("#landing-card-header");
    if (headerEl) headerEl.textContent = title;

    const captionEl = clone.querySelector("#landing-card-caption");
    if (captionEl) captionEl.textContent = caption;

    const imageEl = clone.querySelector("#landing-card-image") as HTMLImageElement;
    if (imageEl) imageEl.src = imageUrl;

    const buttonEl = clone.querySelector("#landing-card-container") as HTMLButtonElement;
    if (buttonEl && redirectUri) {
        buttonEl.onclick = () => navigateTo(redirectUri);
    }
    return clone.firstElementChild as HTMLElement;
}

}