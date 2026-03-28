import { readFile } from "fs/promises";

async function readJSON<T = unknown>(filePath: string): Promise<T> {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
}

export default readJSON;