import { execSync } from "child_process";
import os from "os";
import fs from "fs";
import path from "path";

function updateFolderIcon(folderPath: string, iconPath: string) {
    const platform = os.platform();

    // Windows
    if (platform === "win32") {
        const iniPath = path.join(folderPath, "desktop.ini");

        try {
            execSync(`attrib -r "${folderPath}"`);
            execSync(`attrib -r "${iniPath}"`);
        } catch {}

        const content = `[.ShellClassInfo]
            IconResource=${iconPath},0`;

        fs.writeFileSync(iniPath, content, "utf8");

        execSync(`attrib +h +s "${iniPath}"`);
        execSync(`attrib +r "${folderPath}"`);

        try {
            execSync("ie4uinit.exe -show");
        } catch (error) {
            console.error(error);
        }
    }
}

export default updateFolderIcon;