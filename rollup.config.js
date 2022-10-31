import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import packageJson from "./package.json";

const extensions = [".ts"];
const banner = `/**
    * ${packageJson.name} v${packageJson.version}
    * ${packageJson.homepage}
    * (c) ${new Date().getFullYear()} ${packageJson.author}
    * @license ${packageJson.license}
    */
`;

export default {
    input: "lib/env-agent.ts",
    output: [
        {
            file: packageJson.main,
            format: "cjs",
            sourcemap: true,
            exports: "named",
            generatedCode: {
                constBindings: true
            },
            banner: banner
        },
        {
            file: packageJson.module,
            format: "esm",
            sourcemap: true,
            exports: "default",
            banner: banner
        }
    ],
    plugins: [
        resolve({ extensions }),
        babel({
            babelHelpers: "bundled",
            include: ["lib/**/*.ts"],
            extensions: extensions,
            exclude: "node_modules/**",
            presets: ["@babel/preset-typescript", "@babel/preset-env"]
        })
    ]
};
