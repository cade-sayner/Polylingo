export class LandingCard {
    render(props) {
        var _a;
        return `
        ${(_a = document.querySelector("#landing-card-template")) === null || _a === void 0 ? void 0 : _a.innerHTML.replace("REDIRECT_URI", `'${props.redirectUri}'`).replace("TEMPLATE:HEADER", props.title).replace("TEMPLATE:CAPTION", props.caption).replace("TEMPLATE:IMAGESRC", props.imageUrl)}
        `;
    }
}
