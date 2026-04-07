import { parse } from "../external/toml.js";
let config;
async function getConfig() {
    const res = await fetch("./config.toml");
    if (!res.ok) {
        throw new Error(`Failed to load config.toml: ${res.status}`);
    }
    const rawConfig = await res.text();
    return parse(rawConfig);
}
config = await getConfig();
export default config;
