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
import { random } from "./src/helpers/index.js";

// Start stopwatch
const sw = new Stopwatch(true);

// Log start of application
log.app.info("Starting up application...");

// Create express server
const server = express(); 

// Setup snowflake
export const snowflake = new Snowflake(new Date(config.snowflake.eposh).getTime());

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

// Middleware here

/* 
————————————————————————————————————————————————————————————————
Routes
———————————————————————————————————————————————————————————————— 
*/

// server.use("/", routes.root);

/* 
————————————————————————————————————————————————————————————————
Server
———————————————————————————————————————————————————————————————— 
*/

let httpsConfig;

httpsConfig = { // ENABLE BACK LATER
//    cert: fs.readFileSync(config.ssl.crt),
//    key: fs.readFileSync(config.ssl.key)
};

const httpsServer = https.createServer(httpsConfig, server);

httpsServer.listen(config.ports.proxy, () => {
    sw.stop();
    log.server.success(`API running on ${config.routes.api}/v1/cornelia`).tree(1);
    log.sw.info(`Took ${toMs(sw.read())}s`).tree(1).end();
});

process.on("SIGINT", shutdown); // Ctrl+C
process.on("SIGTERM", shutdown); // Host shutdown

/* 
————————————————————————————————————————————————————————————————
DEVELOPER SANDBOX
———————————————————————————————————————————————————————————————— 
*/

// log.config.info(config.rules.exact);