interface Result {
    files: number;
    folders: number;
}

export function countFiles(input: any): Result {
    let files = 0;
    let folders = 0;

    if (!input || typeof input !== "object") {
        return { files: 1, folders: 0 };
    }

    for (const key of Object.keys(input)) {
        const value = input[key];

        if (Array.isArray(value)) {
            files += value.length;
            continue;
        }

        if (value && typeof value === "object") {
            if ("path" in value) {
                files++;
            } else {
                folders++;
            }
            continue;
        }

        files++;
    }

    return { files, folders };
}

export default countFiles;