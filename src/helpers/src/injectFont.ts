import { svgFont } from "../../../server.js";

function injectFont(svgString: string) {
    const style = `
        <style>
            @font-face {
                font-family: 'jetbrains-nerdfont';
                src: url("data:font/ttf;base64,${svgFont}") format("truetype");
            }

            text {
                font-family: 'jetbrains-nerdfont';
                font-weight: 100;
            }
        </style>
    `;

    return svgString.replace(/<svg([^>]*)>/, `<svg$1>${style}`);
}

export default injectFont;