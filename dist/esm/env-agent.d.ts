/// <reference types="node" />
export declare const DOTENV_FILENAME = ".env";
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
}
declare const envAgent: EnvManipulator;
export default envAgent;
