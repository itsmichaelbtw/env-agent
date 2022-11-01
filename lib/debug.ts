const colors = {
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m"
};

const globals = {
    reset: "\x1b[0m",
    bright: "\x1b[1m"
};

export type DebugColors = keyof typeof colors;

export function debug(message: string, color: DebugColors) {
    const prefix = "[ENV-AGENT] ";
    const colorizedMessage = `${colors[color]}${prefix}${message}${globals.reset}`;

    console.log(colorizedMessage);
}
