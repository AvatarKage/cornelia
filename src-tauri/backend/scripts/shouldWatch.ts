import fs from "fs";

import config from "../config/index.ts";

function shouldWatch(filePath: string) {
    const lower = filePath.toLowerCase();
    if (config.rules.ignore.some(folder => lower.includes(folder))) return false;
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) return true;
    if (filePath.endsWith(".ini")) return true;
    return false;
}

export default shouldWatch;