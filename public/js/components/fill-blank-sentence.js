export class FillBlankSentence {
    render(sentence) {
        return `
        ${sentence.split(" ").map((word) => `<span class=${word === "____" ? "placeholder-word" : "fade-in sentence-word"}> ${word === "____" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word </p>` : word} </span>`).join("")}
        `;
    }
}
