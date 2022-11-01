import fs from "fs";
import path from "path";
import chai from "chai";

import envAgent from "../lib/env-agent";
import { hasOwnProperty, shallowMerge } from "../lib/utils";

const DOTENV_FILENAME = envAgent.DOTENV_FILENAME;

const parsedEnvironmentVariables = {
    PORT: "3000",
    NODE_ENV: "development",
    PASSWORD: "123456",
    MONGO_URL: "mongodb://localhost:27017",
    MONGO_PASSWORD: "$PASSWORD",
    MISSING_VAR: ""
};

describe("envAgent", () => {
    before(() => {
        const environmentVariables = `
            # This is a comment
            PORT=3000
            NODE_ENV=development
            # This is another comment
            PASSWORD=123456
            MONGO_URL=mongodb://localhost:27017
            MONGO_PASSWORD=$PASSWORD # inline comment
            MISSING_VAR= # empty value
            ="MISSING KEY"
        `;

        fs.writeFileSync(DOTENV_FILENAME, environmentVariables);
    });

    after(() => {
        fs.unlinkSync(DOTENV_FILENAME);
    });

    afterEach(() => {
        for (const key in parsedEnvironmentVariables) {
            if (hasOwnProperty(process.env, key)) {
                delete process.env[key];
            }
        }
    });

    it("should accept a configuration object", () => {
        const agent = envAgent.create();

        const options = {
            silent: true,
            strict: true,
            debug: false
        };

        agent.configure(options);

        chai.expect(agent.options).to.deep.equal(
            shallowMerge(options, agent.options)
        );
    });

    describe("configuration options", () => {
        it("should throw an error when `silent` is false (silent)", () => {
            const agent = envAgent.create();

            const options = {
                silent: false,
                path: "fake/path"
            };

            chai.expect(() => agent.configure(options)).to.throw();
        });

        it("should not throw an error when `silent` is true (silent)", () => {
            const agent = envAgent.create();

            const options = {
                silent: true,
                path: "fake/path"
            };

            chai.expect(() => agent.configure(options)).to.not.throw();
        });

        it("should set the variable when the value is not defined (strict)", () => {
            const agent = envAgent.create();

            const options = {
                silent: true,
                strict: false
            };

            agent.configure(options);

            chai.expect(hasOwnProperty(process.env, "MISSING_VAR")).to.be.true;
            chai.expect(agent.get("MISSING_VAR")).to.equal("");
        });

        it("should not set the variable when the value is not defined (strict)", () => {
            const agent = envAgent.create();

            const options = {
                strict: true
            };

            agent.configure(options);

            chai.expect(hasOwnProperty(process.env, "MISSING_VAR")).to.be.false;
            chai.expect(agent.get("MISSING_VAR")).to.equal("");
        });

        it("should allow a custom path to the .env file", () => {
            const agent = envAgent.create();

            const options = {
                silent: true,
                path: "fake/path"
            };

            agent.configure(options);

            chai.expect(agent.options.path).to.equal(options.path);
        });
    });

    it("should parse a buffer into an object", () => {
        const envPath = path.resolve(process.cwd(), DOTENV_FILENAME);
        const file = fs.readFileSync(envPath);
        const env = envAgent.parse(file);

        chai.expect(env).to.deep.equal(parsedEnvironmentVariables);
    });

    it("should configure variables from .env file", () => {
        const env = envAgent.configure();

        chai.expect(env).to.deep.equal(parsedEnvironmentVariables);
    });

    it("should be accessible from process.env", () => {
        const env = envAgent.configure();

        for (const key of Object.keys(env)) {
            chai.expect(hasOwnProperty(process.env, key)).to.be.true;
        }
    });

    it("should get an environment variable", () => {
        envAgent.configure();

        const port = envAgent.get("PORT");
        const nodeEnv = envAgent.get("NODE_ENV");

        chai.expect(port).to.equal("3000");
        chai.expect(nodeEnv).to.equal("development");
    });

    it("should set an environment variable", () => {
        envAgent.set("TEST_VAR", "test");

        chai.expect(envAgent.get("TEST_VAR")).to.equal("test");
        chai.expect(hasOwnProperty(process.env, "TEST_VAR")).to.be.true;
    });
});
