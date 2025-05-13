import { BaseComponent } from "../types";

export class LandingCard implements BaseComponent{
     
    render(props :{imageUrl : string, title : string, caption: string, redirectUri:string}){
        return `
        ${document.querySelector("#landing-card-template")?.innerHTML
            .replace("REDIRECT_URI", `'${props.redirectUri}'`)
            .replace("TEMPLATE:HEADER", props.title)
            .replace("TEMPLATE:CAPTION", props.caption)
            .replace("TEMPLATE:IMAGESRC", props.imageUrl)
        }
        `
    }

}