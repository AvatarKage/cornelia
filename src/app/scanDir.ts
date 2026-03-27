import fs from "fs";
import path from "path";
import os from "os";

import shouldWatch from "./shouldWatch.js";
import callCornelia from "./callCornelia.js";
import config from "../../config/index.js";
import { log } from "../../packages/avatarkage-utilities/logging/src/log.js";

async function scanDir(dir: string, force: boolean = false) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const platform = os.platform();

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (!shouldWatch(fullPath)) continue;

        if (entry.isDirectory()) {
            
            // Windows
            if (platform === "win32") {
            
                const iniPath = path.join(fullPath, "desktop.ini");
                const hasIni = fs.existsSync(iniPath);

                if (config.debug.folders) {
                    log.dir.trace(fullPath);
                }

                if (!hasIni || force) {
                    try {
                        await callCornelia(fullPath);
                    } catch (err) {
                        console.error("Error assigning icon:", err);
                    }
                }
            }

            // Recurse subfolders
            await scanDir(fullPath, force);
        }
    }
}

export default scanDir;