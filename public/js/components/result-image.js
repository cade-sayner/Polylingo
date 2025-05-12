export class ResultImageComponent {
    render(props) {
        return `<img class="result-image" src="/img/${props.imageUrl}"> <div class="answer-text"> ${props.message} </div>`;
    }
}
