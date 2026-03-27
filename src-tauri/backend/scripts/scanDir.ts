import fs from "fs";
import path from "path";
import os from "os";

import shouldWatch from "./shouldWatch.ts";
import callCornelia from "./callCornelia.ts";
import config from "../config/index.ts";
import log from "../packages/avatarkage-utilities/logging/index.ts";

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