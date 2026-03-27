import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import log from "../packages/avatarkage-utilities/logging/index.ts";
import colors from "./data/colors.ts";
import ignore from "./rules/ignore.ts";
import exact from "./rules/exact.ts";

const file = fileURLToPath(import.meta.url);
const dir =  resolve(dirname(file), "..")

dotenv.config({
    path: resolve(dir, "config", ".env"),
});

/* 
————————————————————————————————————————————————————————————————
Helpers
———————————————————————————————————————————————————————————————— 
*/

const toBoolean = (value: string | undefined, name: string) => {
    const string = String(value).toLowerCase();

    if (string === "true") return true;
    if (string === "false") return false;

    throw new Error(`Invalid boolean for "${name}": ${value}. Allowed values: "true", "false"`);
};

const toNumber = (value: string | undefined, name: string) => {
    const number = Number(value);
    if (Number.isNaN(number)) {
        throw new Error(`Invalid number for "${name}": ${value}. Please provide a valid number.`);
    }
    return number;
};

const toDomain = (hostname: string) =>
    production
        ? process.env[`DOMAIN_${hostname}`]
        : process.env[`DOMAIN_DEV_${hostname}`];

const toRoute = (hostname: string) =>
    `https://${toDomain(hostname)}`

/* 
————————————————————————————————————————————————————————————————
Variables
———————————————————————————————————————————————————————————————— 
*/

const production = toBoolean(process.env.PRODUCTION, "PRODUCTION");

const config = {
    production: production,

    snowflake: {
        machine: toNumber(process.env.MACHINE, "MACHINE"),
        eposh: process.env.EPOSH as string
    },

    ip: production ? process.env.IP : process.env.IP_DEV,

    debug: {
        config: toBoolean(process.env.DEBUG_CONFIG, "DEBUG_CONFIG"),
        snowflake: toBoolean(process.env.DEBUG_SNOWFLAKE, "DEBUG_SNOWFLAKE"),
        folders: toBoolean(process.env.DEBUG_FOLDERS, "DEBUG_FOLDERS")
    },

    port: toNumber(process.env.PORT, "PORT"),

    domains: {
        api: toDomain("API")
        // Add more domains here as needed
    },

    routes: {
        api: toRoute("API")
        // Add more routes here as needed
    },

    folders: {
        root: resolve(dir),
        config: resolve(dir, "config"),
        logs: resolve(dir, "logs"),
        packages: resolve(dir, "packages"),
        assets: resolve(dir, "..", "..", "src", "assets"),
        frontend: resolve(dir, "src"),
        generated: resolve(dir, "generated"),
        // Add more folders here as needed
    },

    ssl: {
        crt: resolve(dir, "config", "ssl", `${toDomain("API")}.crt`),
        key: resolve(dir, "config", "ssl", `${toDomain("API")}.key`)
    },

    metadata: {
        version: process.env.METADATA_VERSION as string,
        versionDate: process.env.METADATA_VERSION_DATE as string,
        developer: process.env.METADATA_DEVELOPER as string,
        status: process.env.METADATA_STATUS as string,
        theme: process.env.METADATA_THEME as string,
        name: process.env.METADATA_NAME as string,
        subtext: process.env.METADATA_SUBTEXT as string,
        separator: process.env.METADATA_SEPARATOR as string,
        description: process.env.METADATA_DESCRIPTION as string,
        keywords: process.env.METADATA_KEYWORDS as string,
        accent: process.env.METADATA_ACCENT as string,
        logo: process.env.METADATA_LOGO as string,
        icon: process.env.METADATA_ICON as string,
        banner: process.env.METADATA_BANNER as string,
        owner: process.env.METADATA_OWNER as string,
        legal: process.env.METADATA_LEGAL as string,
        trademark: process.env.METADATA_TRADEMARK as string
    },

    colors: colors,

    rules: {
        ignore,
        exact
    },

    messages: {
        errors: {
            validation: process.env.MESSAGE_ERROR_FIELD_VALIDATION as string,
        }
        // Add more messages here as needed
    }
};

if (config.debug.config) {
    log.config.debug(`Loaded config: ${JSON.stringify(config, null, 4)}`)
}

export default config;