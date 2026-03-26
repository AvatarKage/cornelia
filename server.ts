/* 
————————————————————————————————————————————————————————————————
Copyright (c) 2026 AvatarKage. All Rights Reserved.

https://avatarkage.com
————————————————————————————————————————————————————————————————
*/

// External dependencies
import express from "express";
import https from "https";
// @ts-ignore
import Stopwatch from "statman-stopwatch";
import { createCanvas, loadImage } from "canvas";
import pngToIco from "png-to-ico";

// Internal modules
import config from "./config/index.js";
// import routes from "./routes/index.js";
import log from "./packages/avatarkage-utilities/logging/index.js";
import { toMs } from "./packages/avatarkage-utilities/formatting/index.js";
import Snowflake from "./packages/avatarkage-utilities/snowflake/index.js";
import path from "path";
import fs from "fs";
// @ts-ignore
import recolor from "./src/api/recolor.js";
// @ts-ignore
import injectFont from "./src/api/injectFont.js";
import { getColor } from "./src/helpers/index.js";

// Start stopwatch
const sw = new Stopwatch(true);

// Log start of application
log.app.info("Starting up application...");

// Create express server
const server = express(); 

// Setup snowflake
export const snowflake = new Snowflake(new Date(config.snowflake.eposh).getTime());

// Load folder font
export const svgFont = fs.readFileSync(
    path.join(config.folders.resources, "fonts", "jetbrains", "nerdfont.ttf")
).toString("base64");

/* 
————————————————————————————————————————————————————————————————
Functions
———————————————————————————————————————————————————————————————— 
*/

async function shutdown() {
    await log.terminate("Application terminated");
    process.exit(0);
}

/* 
————————————————————————————————————————————————————————————————
Middlewares
———————————————————————————————————————————————————————————————— 
*/

server.use(express.json());

/* 
————————————————————————————————————————————————————————————————
Routes
———————————————————————————————————————————————————————————————— 
*/

server.get("/", (req, res) => {
    const indexPath = path.join(config.folders.frontend, "index.html");
    res.sendFile(indexPath);
});

server.use(express.static(config.folders.frontend)); 
server.use("/resources", express.static(config.folders.resources));

server.post("/api/render", (req, res) => {
    const {
        style = "shaded",
        varient = "left1",
        baseColor = "#ffca38",
        backColor = "#000000",
        iconColor = "#000000",
        mediumIcon = "",
        smallIcon = "",
        text = "",
        saturation = parseFloat("100") / 100,
        brightness = parseFloat("100") / 100,
        contrast = parseFloat("100") / 100,
        isCustomBackColor = false,
        isCustomIconColor = false
    } = req.body;

    const svgPath = path.join(config.folders.resources, "svg", style, `${varient}.svg`);

    fs.readFile(svgPath, "utf8", async (err, data) => {
        if (err) {
            console.error(err);
            return res.status(404).send("Folder not found");
        }

        let svg = recolor(
            data,
            style,
            varient,
            baseColor,
            backColor,
            iconColor,
            mediumIcon,
            smallIcon,
            text,
            Number(saturation),
            Number(brightness),
            Number(contrast),
            Boolean(isCustomBackColor),
            Boolean(isCustomIconColor)
        );

        if (mediumIcon || smallIcon || text) {
            svg = injectFont(svg);
        }

        const genFolder = path.join(config.folders.generated, style, varient);
        fs.mkdirSync(genFolder, { recursive: true });

        // Save to generated
        const saveSVG = false;
        const savePNG = false;
        const saveICO = true;
        let saveId: string = "";
        let pngBuffer = null;

        if (saveSVG || savePNG || saveICO) {
            saveId = snowflake.generate();
        }

        if (saveSVG) {
            const svgFile = path.join(genFolder, "folder.svg");
            fs.writeFileSync(svgFile, svg, "utf8");
        }

        if (savePNG || saveICO) {
            const canvas = createCanvas(256, 256);
            const ctx = canvas.getContext("2d");
            const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
            const image = await loadImage(svgDataUrl);
            ctx.drawImage(image, 0, 0, 256, 256);

            if (savePNG) {
                const pngFile = path.join(genFolder, "folder.png");
                pngBuffer = canvas.toBuffer("image/png");
                fs.writeFileSync(pngFile, pngBuffer);
            } else {
                pngBuffer = canvas.toBuffer("image/png");
            }
        }

        if (saveICO && pngBuffer) {
            const icoFile = path.join(genFolder, `${snowflake.generate()}.ico`);
            const icoBuffer = await pngToIco(pngBuffer);
            fs.writeFileSync(icoFile, icoBuffer);
        }

        res.setHeader("Content-Type", "image/svg+xml");
        res.send(svg);
    });
});

/* 
————————————————————————————————————————————————————————————————
Server
———————————————————————————————————————————————————————————————— 
*/

// let httpsConfig;

// httpsConfig = { // ENABLE BACK LATER
//    cert: fs.readFileSync(config.ssl.crt),
//    key: fs.readFileSync(config.ssl.key)
// };

// const httpsServer = https.createServer(httpsConfig, server);

// Use httpServer.listen if public
server.listen(config.port, () => {
    sw.stop();
    log.server.success(`Cornelia Studio running on http://${config.ip}:${config.port}`).tree(1);
    log.sw.info(`Took ${toMs(sw.read())}s`).tree(1).end();
});

process.on("SIGINT", shutdown); // Ctrl+C
process.on("SIGTERM", shutdown); // Host shutdown

/* 
————————————————————————————————————————————————————————————————
DEVELOPER SANDBOX
———————————————————————————————————————————————————————————————— 
*/

const generateFolder = async (payload: {}) => {
    try {
        const response = await fetch(`http://${config.ip}:${config.port}/api/render`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Render API error: ${errorText}`);
        }

        const svg = await response.text();

        return svg;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

await Promise.all(
    Array.from({ length: 0 }, () =>
        generateFolder({ baseColor: getColor(config.colors.random.red) })
    )
);