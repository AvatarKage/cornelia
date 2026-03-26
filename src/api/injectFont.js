import { svgFont } from "../../server.js";

function injectFont(svgString) {
    const style = `
        <style>
            @font-face {
                font-family: 'jetbrains-nerdfont';
                src: url("data:font/ttf;base64,${svgFont}") format("truetype");
            }

            text {
                font-family: 'jetbrains-nerdfont', sans-serif;
            }
        </style>
    `;

    return svgString.replace(/<svg([^>]*)>/, `<svg$1>${style}`);
}

export default injectFont;