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

// Internal modules
import config from "./config/index.js";
// import routes from "./routes/index.js";
import log from "./packages/avatarkage-utilities/logging/index.js";
import { toMs } from "./packages/avatarkage-utilities/formatting/index.js";
import Snowflake from "./packages/avatarkage-utilities/snowflake/index.js";
import { injectFont } from "./src/helpers/index.js";
import path from "path";
import fs from "fs";
import { recolor } from "./src/backend/index.js";

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
        style,
        varient,
        baseColor,
        backColor,
        iconColor,
        mediumIcon,
        smallIcon,
        text,
        saturation,
        brightness,
        contrast,
        isCustomBackColor,
        isCustomIconColor
    } = req.body;

    if (!style || !varient || !baseColor) {
        return res.status(400).send("Style, varient, and base color are required");
    }

    const svgPath = path.join(config.folders.resources, "svg", style, `${varient}.svg`);

    fs.readFile(svgPath, "utf8", (err, data) => {
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