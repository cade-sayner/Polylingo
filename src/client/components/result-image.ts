import { BaseComponent } from "../types";

export class ResultImageComponent implements BaseComponent{
    render(props : {imageUrl : string, message : string}){
        return `<img class="result-image fade-in" src="/img/${props.imageUrl}"> <div class="answer-text"> ${props.message} </div>`
    }
} 