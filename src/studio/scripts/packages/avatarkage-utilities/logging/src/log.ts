import { pad } from "../../formatting/index.js";
import colors from "./colors.js";
import icons from "./icons.js";

type LogLevel =
    | "info"
    | "success"
    | "warn"
    | "error"
    | "debug"
    | "trace"
    | "terminate";

type ScopedLogger = {
    info: ReturnType<typeof createLogMethod>;
    success: ReturnType<typeof createLogMethod>;
    warn: ReturnType<typeof createLogMethod>;
    error: ReturnType<typeof createLogMethod>;
    debug: ReturnType<typeof createLogMethod>;
    trace: ReturnType<typeof createLogMethod>;
};

type Wrapper = {
    tree: (lvl: number) => Wrapper;
    end: () => Wrapper;
    then: (resolve?: () => void) => Wrapper;
};

function color(code: number) {
    return (text: string): string => `\x1b[${code}m${text}\x1b[0m`;
}

function now(): { hour: number; minute: number; second: number } {
    const d = new Date();
    return {
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
    };
}

function print(
    scope: string,
    level: LogLevel,
    message: unknown,
    treeLevel = 0,
    endTree = false
): void {
    const t = now();

    const time = color(90)(
        `[${pad(t.hour, 2)}:${pad(t.minute, 2)}:${pad(t.second, 2)}]`
    );

    const levelColor =
        (colors as Record<string, (x: string) => string>)[level] ??
        ((x: string) => x);

    const scopeIcons =
        (icons as Record<string, any>)[scope] ?? icons["default"];

    const icon =
        scopeIcons?.[level] ??
        icons["default"]?.[level] ??
        icons["default"]?.info ??
        "";

    const tree = color(90)(
        `${treeLevel > 1 ? "│ ".repeat(treeLevel - 1) : ""}${
            treeLevel !== 0 ? (endTree ? "└─" : "├─") : ""
        }`
    );

    let msg =
        typeof message === "string"
            ? message
            : JSON.stringify(message, null, 4);

    msg = msg.replace(
        /(https?:\/\/[^\s"',\)\]\}<>]+)/g,
        (url) => color(90)(` ${url}`)
    );

    if (level === "terminate") {
        console.log(`${time} ${tree}${levelColor(`  ${msg} `)}`);
    } else {
        console.log(`${time} ${tree}${levelColor(`${icon} ${msg}`)}`);
    }
}

function createLogMethod(scope: string, level: LogLevel) {
    return (msg: unknown): Wrapper => {
        let treeLevel = 0;
        let endTree = false;
        let printed = false;

        const wrapper: Wrapper = {
            tree(lvl: number) {
                treeLevel = lvl;
                return wrapper;
            },
            end() {
                endTree = true;
                return wrapper;
            },
            then(resolve?: () => void) {
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

function scoped(scope: string): ScopedLogger {
    return {
        info: createLogMethod(scope, "info"),
        success: createLogMethod(scope, "success"),
        warn: createLogMethod(scope, "warn"),
        error: createLogMethod(scope, "error"),
        debug: createLogMethod(scope, "debug"),
        trace: createLogMethod(scope, "trace"),
    };
}

export const log = new Proxy<Record<string, ScopedLogger>>(
    {} as Record<string, ScopedLogger>,
    {
        get(_, key: string) {
            if (key === "terminate") {
                return createLogMethod("global", "terminate");
            }
            return scoped(key);
        },
    }
);