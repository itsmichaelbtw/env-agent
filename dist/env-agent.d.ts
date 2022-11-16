/// <reference types="node" />
interface EnvType {
    [key: string]: string;
}
declare type ExpansionMode = "none" | "project" | "machine";
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
declare class EnvAgent implements EnvManipulator {
    private $options;
    DOTENV_FILENAME: string;
    get options(): ConfigurableOptions;
    private resolvePathName;
    private handleErrorException;
    private handleDebug;
    /**
     * Creates a new instance of EnvAgent. Not sure why you would want to
     * do this, but it's here if you need it.
     */
    create(): EnvAgent;
    /**
     * Parses a Buffer or string and returns an object containing the environment variables.
     *
     * ```
     * const env = envAgent.parse(fs.readFileSync(".env", "utf8"));
     * // or
     * const env = envAgent.parse(`FOO=bar\nBAR=baz`);
     * ```
     */
    parse(file: Buffer | string): EnvType;
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
    load(options?: ConfigurableOptions): EnvType;
    /**
     * A method to expand variables defined in your .env file. It is
     * recommended to expand variables when calling `load()`, but this
     * method is available if you need to expand variables at a later
     * time.
     */
    expand(variables?: EnvType, mode?: ExpansionMode, forceSet?: boolean): EnvType;
    /**
     * Retrieve a single environment variable from `process.env`.
     */
    get(key?: string): string | undefined;
    /**
     * Sets a single environment variable in `process.env`.
     */
    set(key: string, value: string): void;
    reset(): void;
}
declare const envAgent: EnvAgent;
export default envAgent;
