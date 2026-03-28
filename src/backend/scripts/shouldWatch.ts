import fs from "fs";

import config from "../../common/config.js";

function shouldWatch(filePath: string) {
    const lower = filePath.toLowerCase();
    if (config.rules.ignore.some((folder: string) => lower.includes(folder))) return false;
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) return true;
    if (filePath.endsWith(".ini")) return true;
    return false;
}

export default shouldWatch;