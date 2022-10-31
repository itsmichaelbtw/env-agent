import path from "path";
import fs from "fs";
import os from "os";

import { isUndefined, hasOwnProperty } from "./utils";

const DOTENV_FILENAME = ".env";
const DOTENV_LINE = /^\s*([^\#]+)\s*=\s*([^#]*)/m;

interface EnvType {
    [key: string]: string;
}

interface EnvManipulator {
    /**
     * Parses a .env file and returns an object containing the environment variables.
     */
    parse(file: Buffer): EnvType;
    /**
     * Configures the environment variables by reading the .env file and sets the variable
     * if it does not exist.
     */
    configure(): EnvType;

    /**
     * Programmatically set environment variables that are only available in the current process.
     */
    set(key: string, value: string): void;

    /**
     * Retrieve an environment variable from the current process.
     */
    get(key?: string): string;

    /**
     * Default filename for the .env file.
     */
    DOTENV_FILENAME: string;
}

function parse(file: Buffer): EnvType {
    try {
        const environmentVariables: EnvType = {};
        const fileAsString = file.toString();
        const lines = fileAsString.replace(os.EOL, "\n").split(/\n/);

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

            let key = keyValuePairs[0] ?? "";
            let value = keyValuePairs[1] ?? "";

            key = key.trim();
            value = value.trim();

            if (key) {
                environmentVariables[key] = value;
            }
        }

        return environmentVariables;
    } catch (error) {
        return {};
    }
}

function configure(): EnvType {
    const envPath = path.resolve(process.cwd(), DOTENV_FILENAME);

    try {
        const file = fs.readFileSync(envPath);
        const env = parse(file);

        for (const key in env) {
            if (hasOwnProperty(process.env, key)) {
                continue;
            }

            set(key, env[key]);
        }

        return env;
    } catch (error) {
        return {};
    }
}

function get(key?: string): string {
    if (isUndefined(key)) {
        return "";
    }

    const value = process.env[key];

    if (isUndefined(value)) {
        return "";
    }

    return value;
}

function set(key: string, value: string): void {
    process.env[key] = value;
}

const envAgent: EnvManipulator = {
    parse: parse,
    configure: configure,
    get: get,
    set: set,
    DOTENV_FILENAME: DOTENV_FILENAME
};

export default envAgent;
