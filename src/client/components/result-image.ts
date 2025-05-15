import { BaseComponent } from "../types";

export class ResultImageComponent implements BaseComponent{

    render(props : {imageUrl : string, message : string}){
        const parser = new DOMParser();
        return parser.parseFromString(`<img class="result-image fade-in" src="/img/${props.imageUrl}"> <div class="answer-text"> ${props.message} </div>`, 'text/html').body.firstElementChild as HTMLElement
    }
} 