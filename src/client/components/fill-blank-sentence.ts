import { BaseComponent } from "../types";

export class FillBlankSentence implements BaseComponent{
    render(sentence : string){
        return `
        ${ sentence.split(" ").map((word) => `<span class=${word === "____" ? "placeholder-word" : "fade-in sentence-word"}> ${word === "____" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word </p>` : word} </span>`).join("")}
        `
    }
}