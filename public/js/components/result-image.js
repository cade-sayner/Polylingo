export class ResultImageComponent {
    render(props) {
        const parser = new DOMParser();
        return Array.from(parser.parseFromString(`<img class="result-image fade-in" src="/img/${props.imageUrl}"> 
     <div class="answer-text">${props.message}</div>`, 'text/html').body.childNodes).filter((node) => node.nodeType === Node.ELEMENT_NODE);
    }
}
