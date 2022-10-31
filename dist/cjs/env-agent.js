"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOTENV_FILENAME = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const utils_1 = require("./utils");
exports.DOTENV_FILENAME = ".env";
const DOTENV_LINE = /^\s*([^\#]+)\s*=\s*([^#]*)/m;
function parse(file) {
    var _a, _b;
    try {
        const environmentVariables = {};
        const fileAsString = file.toString();
        const lines = fileAsString.replace(os_1.default.EOL, "\n").split(/\n/);
        for (const potentialLine of lines) {
            const isMatch = DOTENV_LINE.test(potentialLine);
            if (!isMatch) {
                continue;
            }
            const line = potentialLine.match(DOTENV_LINE);
            if (line === null) {
                continue;
            }
            const keyValuePairs = line.slice(1);
            let key = (_a = keyValuePairs[0]) !== null && _a !== void 0 ? _a : "";
            let value = (_b = keyValuePairs[1]) !== null && _b !== void 0 ? _b : "";
            key = key.trim();
            value = value.trim();
            if (key) {
                environmentVariables[key] = value;
            }
        }
        return environmentVariables;
    }
    catch (error) {
        return {};
    }
}
function configure() {
    const envPath = path_1.default.resolve(process.cwd(), exports.DOTENV_FILENAME);
    try {
        const file = fs_1.default.readFileSync(envPath);
        const env = parse(file);
        for (const key in env) {
            if ((0, utils_1.hasOwnProperty)(process.env, key)) {
                continue;
            }
            set(key, env[key]);
        }
        return env;
    }
    catch (error) {
        return {};
    }
}
function get(key) {
    const value = process.env[key];
    if ((0, utils_1.isUndefined)(value)) {
        return "";
    }
    return value;
}
function set(key, value) {
    process.env[key] = value;
}
const envAgent = {
    parse: parse,
    configure: configure,
    get: get,
    set: set
};
exports.default = envAgent;
