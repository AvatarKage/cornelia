import path from "path";

import config from "../../config/index.js";
// @ts-ignore
import generateFolder from "../api/generateFolder.js";
import updateFolderIcon from "./updateFolderIcon.js";

export async function callCornelia(folderPath: string) {
    const folderName = path.basename(folderPath).toLowerCase();

    let iconPreset: object = {};

    for (const [key, value] of Object.entries(config.rules.exact)) {
        if (key.toLowerCase() === folderName) {
            iconPreset = value;
            break;
        }
    }

    if (Object.keys(iconPreset).length > 0) {
        const result = await generateFolder(iconPreset);

        if (!result?.options?.style || !result?.options?.variant || !result?.id) {
            console.warn("Skipping folder, incomplete generation result:", folderPath, result);
            return null;
        }

        const iconPath = path.join(
            config.folders.generated, 
            result.options.style,
            result.options.variant,
            `${result.id}.ico`
        );

        updateFolderIcon(folderPath, iconPath);
    }

    return null;
}

export default callCornelia;