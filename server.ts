/* 
————————————————————————————————————————————————————————————————
Copyright (c) 2026 AvatarKage. All Rights Reserved.

https://avatarkage.com
————————————————————————————————————————————————————————————————
*/

// External dependencies
import express from "express";
// @ts-ignore
import Stopwatch from "statman-stopwatch";
import chokidar from "chokidar";
import os from "os";

// Internal modules
import config from "./config/index.js";
// import routes from "./routes/index.js";
import log from "./packages/avatarkage-utilities/logging/index.js";
import { toMs } from "./packages/avatarkage-utilities/formatting/index.js";
import Snowflake from "./packages/avatarkage-utilities/snowflake/index.js";
import path from "path";
import fs from "fs";
// @ts-ignore
import generateFolder from "./src/api/generateFolder.js";
import { getColor } from "./src/helpers/index.js";
import scanDir from "./src/app/scanDir.js";
import shouldWatch from "./src/app/shouldWatch.js";

// Start stopwatch
const sw = new Stopwatch(true);

// Log start of application
log.app.info("Starting up application...");

// Create express server
const server = express(); 

// Create watcher
const watcher = chokidar.watch(os.homedir(), {
    persistent: true,
    ignoreInitial: true,
    depth: undefined,
    usePolling: false,
    interval: 500,
    ignored: (filePath: string) => !shouldWatch(filePath)
});

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

server.post("/api/render", async (req, res) => {
    try {
        const response = await generateFolder(req.body);
        return response;
    } catch (err: any) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

/* 
————————————————————————————————————————————————————————————————
Server
———————————————————————————————————————————————————————————————— 
*/

server.listen(config.port, () => {
    sw.stop();
    log.server.success(`Cornelia Studio running on http://${config.ip}:${config.port}`).tree(1);
    log.sw.info(`Took ${toMs(sw.read())}s`).tree(1).end();
});

process.on("SIGINT", shutdown); // Ctrl+C
process.on("SIGTERM", shutdown); // Host shutdown

/* 
————————————————————————————————————————————————————————————————
Events
———————————————————————————————————————————————————————————————— 
*/

// Automate icons based on folder names
scanDir(os.homedir());

watcher
    .on('add', path => console.log(`File added: ${path}`))
    .on('change', path => console.log(`File changed: ${path}`))
    .on('unlink', path => console.log(`File removed: ${path}`))
    .on('addDir', path => console.log(`Directory added: ${path}`))
    .on('unlinkDir', path => console.log(`Directory removed: ${path}`))
    .on('error', error => console.error(`Watcher error: ${error}`))
    .on('ready', () => console.log('Initial scan complete. Ready for changes'));

/* 
————————————————————————————————————————————————————————————————
DEVELOPER SANDBOX
———————————————————————————————————————————————————————————————— 
*/

// await generateFolder({ mediumIcon: "", baseColor: getColor(config.colors.random.purple) })