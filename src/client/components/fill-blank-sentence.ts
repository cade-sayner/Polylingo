import { BaseComponent } from "../types";

export class FillBlankSentence implements BaseComponent {
    render(sentence: string) {
        const container = document.createElement("div");
        sentence.split(" ").forEach((word) => {
            const span = document.createElement("span");

            if (word === "____") {
                span.className = "placeholder-word";

                const p = document.createElement("p");
                p.id = "missing-word-placeholder";
                p.className = "missing-word flip-animate";
                p.textContent = "A Word";

                span.appendChild(p);
            } else {
                span.className = "fade-in sentence-word";
                span.textContent = word;
            }
            container.appendChild(span);
            container.appendChild(document.createTextNode(" ")); 
        });

        return container;
    }
}