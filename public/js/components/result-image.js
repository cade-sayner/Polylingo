export class ResultImageComponent {
    render(props) {
        return `<img class="result-image fade-in" src="/img/${props.imageUrl}"> <div class="answer-text"> ${props.message} </div>`;
    }
}
