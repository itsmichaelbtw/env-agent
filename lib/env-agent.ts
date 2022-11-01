import path from "path";
import fs from "fs";
import os from "os";

import { isUndefined, hasOwnProperty, shallowMerge } from "./utils";
import { debug, DebugColors } from "./debug";

const DOTENV_FILENAME = ".env";
const DOTENV_LINE = /^\s*([^\#]+)\s*=\s*([^#]*)/m;

interface EnvType {
    [key: string]: string;
}

interface EnvManipulator {
    /**
     * Parses a .env file and returns an object containing the environment variables.
     */
    parse(file: Buffer | string): EnvType;
    /**
     * Configures the environment variables by reading the .env file and sets the variable
     * if it does not exist.
     */
    configure(options: ConfigurableOptions): EnvType;

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

interface ConfigurableOptions {
    /**
     * When attempting to load the .env file, specify whether errors should be thrown or not.
     *
     * If set to false, operations will continue as normal.
     *
     * Defaults to `true`.
     */
    silent?: boolean;

    /**
     * When parsing variables, ensure that values are defined before attempting to set them.
     *
     * Defaults to `false`.
     */
    strict?: boolean;

    /**
     * The path to the .env file. Use only if you are attempting to load a file that is not
     * in the root directory.
     *
     * Defaults to `process.cwd()`.
     */
    path?: string;

    /**
     * Control wether or not to overwrite existing environment variables.
     */
    overwrite?: boolean;

    /**
     * The encoding to use when reading the .env file.
     *
     * Defaults to `utf8`.
     */
    encoding?: BufferEncoding;

    /**
     * Show debug messages when loading the .env file.
     *
     * Includes errors, warnings, and success messages.
     *
     * Defaults to `false`.
     */
    debug?: boolean;
}

const defaults: ConfigurableOptions = {
    silent: true,
    strict: false,
    overwrite: false,
    encoding: "utf8",
    debug: false
};

class EnvAgent implements EnvManipulator {
    private $options: ConfigurableOptions = {};

    public DOTENV_FILENAME = DOTENV_FILENAME;

    get options() {
        return this.$options;
    }

    private resolvePathName(): string {
        if (this.options.path) {
            return path.resolve(this.options.path);
        } else {
            return path.resolve(process.cwd(), DOTENV_FILENAME);
        }
    }

    private handleErrorException(error: Error): void {
        this.handleDebug(error.message, "red");

        if (this.options.silent) {
            return;
        }

        throw error;
    }

    private handleDebug(message: string, color: DebugColors): void {
        if (this.options.debug) {
            debug(message, color);
        }
    }

    public create(): EnvAgent {
        return new EnvAgent();
    }

    public parse(file: Buffer | string): EnvType {
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
                    if (this.options.strict && !value) {
                        continue;
                    }

                    value = value.replace(/(^['"]|['"]$)/g, "");
                    environmentVariables[key] = value;
                }
            }

            return environmentVariables;
        } catch (error: any) {
            this.handleErrorException(error);

            return {};
        }
    }

    public configure(options: ConfigurableOptions = {}): EnvType {
        this.$options = shallowMerge(defaults, options);

        try {
            const envPath = this.resolvePathName();
            const encoding = this.options.encoding;

            const file = fs.readFileSync(envPath, { encoding });

            this.handleDebug("Found .env file", "green");

            const env = this.parse(file);

            this.handleDebug("Parsed .env file", "green");

            if (Object.keys(env).length === 0) {
                this.handleDebug(
                    "No environment variables found. You may have an empty .env file",
                    "yellow"
                );
                return {};
            }

            for (const key in env) {
                this.set(key, env[key]);
            }

            return env;
        } catch (error: any) {
            this.handleErrorException(error);

            return {};
        }
    }

    public get(key?: string): string {
        if (isUndefined(key)) {
            this.handleDebug(
                "Attempted to retrieve an environment variable, but no key was passed",
                "yellow"
            );

            return "";
        }

        const value = process.env[key];

        if (isUndefined(value)) {
            return "";
        }

        return value;
    }

    public set(key: string, value: string): void {
        if (
            hasOwnProperty(process.env, key) &&
            this.options.overwrite !== true
        ) {
            this.handleDebug(
                `Environment variable ${key} already exists, skipping`,
                "yellow"
            );

            return;
        }

        if (this.$options.strict && !value) {
            this.handleDebug(
                `Environment variable ${key} is not defined, skipping`,
                "yellow"
            );

            return;
        }

        process.env[key] = value;
        this.handleDebug(`Set ${key} to ${value}`, "green");
    }

    public reset(): void {
        this.$options = {};
    }
}

const envAgent = new EnvAgent();

export default envAgent;
