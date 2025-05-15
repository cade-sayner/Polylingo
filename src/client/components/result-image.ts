import { BaseComponent } from "../types";

export class ResultImageComponent implements BaseComponent {

    render(props: { imageUrl: string, message: string }) {
        const parser = new DOMParser();

        return Array.from(
            parser.parseFromString(
                `<img class="result-image fade-in" src="/img/${props.imageUrl}"> 
     <div class="answer-text">${props.message}</div>`,
                'text/html'
            ).body.childNodes
        ).filter((node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE);
    }
} 