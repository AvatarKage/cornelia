import { pad } from "../../formatting/index.js";
import colors from "./colors.js";
import icons from "./icons.js";
function color(code) {
    return (text) => `\x1b[${code}m${text}\x1b[0m`;
}
function now() {
    const d = new Date();
    return {
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
    };
}
function print(scope, level, message, treeLevel = 0, endTree = false) {
    const t = now();
    const time = color(90)(`[${pad(t.hour, 2)}:${pad(t.minute, 2)}:${pad(t.second, 2)}]`);
    const levelColor = colors[level] ??
        ((x) => x);
    const scopeIcons = icons[scope] ?? icons["default"];
    const icon = scopeIcons?.[level] ??
        icons["default"]?.[level] ??
        icons["default"]?.info ??
        "";
    const tree = color(90)(`${treeLevel > 1 ? "│ ".repeat(treeLevel - 1) : ""}${treeLevel !== 0 ? (endTree ? "└─" : "├─") : ""}`);
    let msg = typeof message === "string"
        ? message
        : JSON.stringify(message, null, 4);
    msg = msg.replace(/(https?:\/\/[^\s"',\)\]\}<>]+)/g, (url) => color(90)(` ${url}`));
    if (level === "terminate") {
        console.log(`${time} ${tree}${levelColor(`  ${msg} `)}`);
    }
    else {
        console.log(`${time} ${tree}${levelColor(`${icon} ${msg}`)}`);
    }
}
function createLogMethod(scope, level) {
    return (msg) => {
        let treeLevel = 0;
        let endTree = false;
        let printed = false;
        const wrapper = {
            tree(lvl) {
                treeLevel = lvl;
                return wrapper;
            },
            end() {
                endTree = true;
                return wrapper;
            },
            then(resolve) {
                if (!printed) {
                    printed = true;
                    print(scope, level, msg, treeLevel, endTree);
                }
                resolve?.();
                return wrapper;
            },
        };
        setTimeout(() => {
            if (!printed) {
                printed = true;
                print(scope, level, msg, treeLevel, endTree);
            }
        }, 0);
        return wrapper;
    };
}
function scoped(scope) {
    return {
        info: createLogMethod(scope, "info"),
        success: createLogMethod(scope, "success"),
        warn: createLogMethod(scope, "warn"),
        error: createLogMethod(scope, "error"),
        debug: createLogMethod(scope, "debug"),
        trace: createLogMethod(scope, "trace"),
    };
}
export const log = new Proxy({}, {
    get(_, key) {
        if (key === "terminate") {
            return createLogMethod("global", "terminate");
        }
        return scoped(key);
    },
});
