import path from "path";
import fs from "fs";
import os from "os";

import {
    isUndefined,
    hasOwnProperty,
    shallowMerge,
    removeQuotes
} from "./utils";
import { debug, DebugColors } from "./debug";

const DOTENV_FILENAME = ".env";
const DOTENV_LINE = /^\s*([^\#]+)\s*=\s*([^#]*)/m;
const DOTENV_EXPANSION = /\$\{?(\w+)\}?/g;
const DOTENV_EXPANSION_KEY = /\$|\{|\}/g;

interface EnvType {
    [key: string]: string;
}

type ExpansionMode = "none" | "project" | "machine";

interface EnvManipulator {
    /**
     * Parses a .env file and returns an object containing the environment variables.
     */
    parse(file: Buffer | string): EnvType;

    /**
     * Loads the environment variables by reading the .env file and sets the variable
     * if it does not exist.
     */
    load(options: ConfigurableOptions): EnvType;

    /**
     * Programmatically set environment variables that are only available in the current process.
     */
    set(key: string, value: string): void;

    /**
     * Retrieve an environment variable from the current process.
     */
    get(key?: string): string | undefined;

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
     * Choose to expand variables defined in your .env file. Select the expansion mode
     * that best suits your needs.
     *
     * - `none` - No expansion will be performed.
     * - `project` - Expand variables defined in the .env file.
     * - `machine` - Expand variables defined on your machine's environment.
     *
     * Defaults to `none`.
     */
    expand?: ExpansionMode;

    /**
     * When parsing variables, ensure that values are defined before attempting to set them.
     * Expanding variables will ensure the value is also defined. If not, the variable
     * that was attempted will be removed from the end result.
     *
     * If `template` is set and `strict` is `true`, any missing variables will throw an error,
     * and any variables that are defined in the template but not in the current .env file
     * will be removed from the end result.
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

    /**
     * Uses another .env file as a template for the current .env file,
     * such as a .env.example file. Any missing variables will be removed
     * from the end result unless `strict` is set to `true`, in which case
     * an error will be thrown.
     *
     * Defaults to `undefined`.
     */
    template?: string;
}

const defaults: ConfigurableOptions = {
    silent: false,
    strict: false,
    overwrite: false,
    encoding: "utf8",
    expand: "none",
    debug: false,
    template: undefined
};

class EnvAgent implements EnvManipulator {
    private $options: ConfigurableOptions = {};

    public DOTENV_FILENAME = DOTENV_FILENAME;

    get options() {
        return this.$options;
    }

    get isProduction() {
        return this.get("NODE_ENV") === "production";
    }

    get isDevelopment() {
        return this.get("NODE_ENV") === "development";
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

    /**
     * Creates a new instance of EnvAgent. Not sure why you would want to
     * do this, but it's here if you need it.
     */
    public create(): EnvAgent {
        return new EnvAgent();
    }

    /**
     * Parses a Buffer or string and returns an object containing the environment variables.
     *
     * ```
     * const env = envAgent.parse(fs.readFileSync(".env", "utf8"));
     * // or
     * const env = envAgent.parse(`FOO=bar\nBAR=baz`);
     * ```
     */
    public parse(file: Buffer | string, bypassStrict = false): EnvType {
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
                    if (this.options.strict && !value && !bypassStrict) {
                        continue;
                    }

                    environmentVariables[key] = removeQuotes(value);
                }
            }

            return environmentVariables;
        } catch (error: any) {
            this.handleErrorException(error);

            return {};
        }
    }

    /**
     * The main entry point for loading the .env file. This method will
     * attempt to load the .env file and set the environment variables.
     *
     * You can pass in an object to configure the behavior of the method.
     *
     * ```
     * const env = envAgent.load();
     * ```
     */
    public load(options: ConfigurableOptions = {}): EnvType {
        this.$options = shallowMerge(defaults, options);

        try {
            const envPath = this.resolvePathName();
            const encoding = this.options.encoding;

            const file = fs.readFileSync(envPath, { encoding });

            let template: EnvType | undefined = undefined;

            if (this.options.template) {
                const templateFile = fs.readFileSync(this.options.template, {
                    encoding
                });

                const templateEnv = this.parse(templateFile, true);

                if (Object.keys(templateEnv).length === 0) {
                    throw new Error(
                        "A template was provided, but it is empty. You may have an empty template file."
                    );
                }

                template = templateEnv;
            }

            this.handleDebug("Found .env file", "green");

            const env = this.parse(file);

            this.handleDebug("Parsed .env file", "green");

            this.expand(env, this.options.expand, false);

            if (template) {
                const enforcedKeys = Object.keys(template);
                const envKeys = Object.keys(env);

                if (envKeys.length === 0) {
                    throw new Error(
                        "The .env file is empty. You may have an empty .env file."
                    );
                }

                for (const key of envKeys) {
                    if (enforcedKeys.includes(key)) {
                        continue;
                    }

                    const message = `The environment variable "${key}" is not in your .env template file.`;

                    if (this.options.strict) {
                        this.handleErrorException(new Error(message));
                    } else {
                        this.handleDebug(message, "yellow");
                    }

                    delete env[key];
                }
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

    /**
     * A method to expand variables defined in your .env file. It is
     * recommended to expand variables when calling `load()`, but this
     * method is available if you need to expand variables at a later
     * time.
     */
    public expand(
        variables: EnvType = {},
        mode: ExpansionMode = "project",
        forceSet: boolean = true
    ): EnvType {
        if (mode === "none" || !mode) {
            return variables;
        }

        const env = mode === "project" ? variables : process.env;

        for (const key in variables) {
            const value = variables[key];

            if (typeof value !== "string") {
                continue;
            }

            const match = value.match(DOTENV_EXPANSION);

            if (match === null) {
                continue;
            }

            const attemptedExpansion = match.reduce((acc, variable) => {
                const variableName = variable.replace(DOTENV_EXPANSION_KEY, "");

                if (variableName in env) {
                    const variableValue = env[variableName];

                    if (isUndefined(variableValue)) {
                        return acc.replace(variable, "");
                    }

                    return acc.replace(variable, variableValue);
                }

                return acc;
            }, value);

            if (this.options.strict && !attemptedExpansion) {
                delete variables[key];
                continue;
            }

            const expandedValue = removeQuotes(attemptedExpansion.trim());

            variables[key] = expandedValue;

            if (forceSet) {
                process.env[key] = expandedValue;
                this.handleDebug(`Expanded ${key}`, "green");
            }
        }

        return variables;
    }

    /**
     * Retrieve a single environment variable from `process.env`.
     */
    public get(key?: string): string | undefined {
        if (isUndefined(key)) {
            this.handleDebug(
                "Attempted to retrieve an environment variable, but no key was passed",
                "yellow"
            );

            return "";
        }

        const value = process.env[key];
        return value;
    }

    /**
     * Sets a single environment variable in `process.env`.
     */
    public set(key: string, value: string, overwrite = false): void {
        const allowOverwrite = overwrite || this.options.overwrite;

        if (hasOwnProperty(process.env, key) && allowOverwrite !== true) {
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
        this.handleDebug(`Set ${key} to process.env`, "green");
    }

    /**
     * Deletes a single environment variable from `process.env`.
     */
    public delete(key: string): void {
        if (hasOwnProperty(process.env, key)) {
            delete process.env[key];
            this.handleDebug(`Deleted ${key} from process.env`, "green");
        }
    }

    public reset(): void {
        this.$options = {};
    }
}

const envAgent = new EnvAgent();

export default envAgent;
