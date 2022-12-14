import fs from "fs";
import path from "path";
import chai from "chai";

import envAgent from "../lib/env-agent";
import { hasOwnProperty, shallowMerge } from "../lib/utils";

const DOTENV_FILENAME = envAgent.DOTENV_FILENAME;

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
    EXPAND_MISSING_VAR=$MISSING_VAR
    EXPAND_PORT=\${PORT}
    EXPAND_RECURSIVE=\${PORT} \${PASSWORD} \${NODE_ENV}
`;

const templateVariables = `
    PORT=
    NODE_ENV=
    TEMPLATE_MISSING_KEY=
    MISSING_VAR=
`;

const parsedEnvironmentVariables = envAgent.parse(environmentVariables);

describe("envAgent", () => {
    before(() => {
        fs.writeFileSync(DOTENV_FILENAME, environmentVariables);
        fs.writeFileSync(".env.template", templateVariables);
        fs.writeFileSync(".env.empty", "");
    });

    after(() => {
        fs.unlinkSync(DOTENV_FILENAME);
        fs.unlinkSync(".env.template");
        fs.unlinkSync(".env.empty");
    });

    afterEach(() => {
        for (const key in parsedEnvironmentVariables) {
            if (hasOwnProperty(process.env, key)) {
                delete process.env[key];
            }
        }
    });

    it("should create a new instance", () => {
        const agent = envAgent.create();

        chai.expect(agent).to.be.an("object");
        chai.expect(agent).to.have.property("load");
        chai.expect(agent).to.have.property("parse");
        chai.expect(agent).to.have.property("expand");
    });

    it("should accept a configuration object", () => {
        const agent = envAgent.create();

        const options = {
            silent: true,
            strict: true,
            debug: false
        };

        agent.load(options);

        chai.expect(agent.options).to.deep.equal(
            shallowMerge(options, agent.options)
        );
    });

    it("should return true if the NODE_ENV is set to `production`", () => {
        const agent = envAgent.create();

        envAgent.set("NODE_ENV", "production");

        chai.expect(agent.isProduction).to.be.true;
        chai.expect(agent.isDevelopment).to.be.false;
    });

    it("should return true if NODE_ENV is set to `development`", () => {
        const agent = envAgent.create();

        envAgent.set("NODE_ENV", "development");

        chai.expect(agent.isDevelopment).to.be.true;
        chai.expect(agent.isProduction).to.be.false;
    });

    describe("config", () => {
        it("should throw an error when `silent` is false (silent)", () => {
            const agent = envAgent.create();

            chai.expect(() =>
                agent.load({
                    silent: false,
                    path: "fake/path"
                })
            ).to.throw();
        });

        it("should not throw an error when `silent` is true (silent)", () => {
            const agent = envAgent.create();

            chai.expect(() =>
                agent.load({
                    silent: true,
                    path: "fake/path"
                })
            ).to.not.throw();
        });

        it("should set the variable when the value is not defined (strict)", () => {
            const agent = envAgent.create();

            agent.load({
                silent: true,
                strict: false
            });

            chai.expect(hasOwnProperty(process.env, "MISSING_VAR")).to.be.true;
            chai.expect(agent.get("MISSING_VAR")).to.equal("");
        });

        it("should not set the variable when the value is not defined (strict)", () => {
            const agent = envAgent.create();

            agent.load({
                strict: true
            });

            chai.expect(hasOwnProperty(process.env, "MISSING_VAR")).to.be.false;
            chai.expect(agent.get("MISSING_VAR")).to.equal(undefined);
        });

        it("should expand variables when `expand` is set to `project`", () => {
            const agent = envAgent.create();

            agent.load({
                expand: "project"
            });

            chai.expect(agent.get("EXPAND_MISSING_VAR")).to.equal("");
            chai.expect(agent.get("EXPAND_PORT")).to.equal("3000");
            chai.expect(agent.get("EXPAND_RECURSIVE")).to.equal(
                "3000 123456 development"
            );
        });

        it("should allow a custom path to the .env file", () => {
            const agent = envAgent.create();

            const options = {
                silent: true,
                path: "fake/path"
            };

            agent.load(options);

            chai.expect(agent.options.path).to.equal(options.path);
        });

        it("should properly set the variables based on the `template` option", () => {
            const agent = envAgent.create();

            const loadedEnv = agent.load({
                template: ".env.template"
            });

            const env = {
                PORT: "3000",
                NODE_ENV: "development",
                MISSING_VAR: ""
            };

            chai.expect(loadedEnv).to.deep.equal(env);
        });
    });

    describe("templates", () => {
        it("should only load variables from the template", () => {
            const agent = envAgent.create();

            agent.load({
                template: ".env.template"
            });

            chai.expect(agent.get("PORT")).to.equal("3000");
            chai.expect(agent.get("NODE_ENV")).to.equal("development");
            chai.expect(agent.get("MISSING_VAR")).to.equal("");
            chai.expect(agent.get("TEMPLATE_MISSING_KEY")).to.equal(undefined);
            chai.expect(agent.get("EXPAND_MISSING_VAR")).to.equal(undefined);
        });

        it("should throw an error if there is a missing key in the template", () => {
            const agent = envAgent.create();

            chai.expect(() =>
                agent.load({
                    template: ".env.template",
                    strict: true
                })
            ).to.throw();
        });

        it("should throw an error if the template file is empty", () => {
            const agent = envAgent.create();

            chai.expect(() =>
                agent.load({
                    template: ".env.empty"
                })
            ).to.throw();
        });

        it("should throw an error if the `.env` file is empty", () => {
            const agent = envAgent.create();

            chai.expect(() =>
                agent.load({
                    path: ".env.empty",
                    template: ".env.template",
                    strict: true
                })
            ).to.throw();
        });
    });

    describe("load()", () => {
        it("should load variables from a .env file", () => {
            const env = envAgent.load();

            chai.expect(env).to.deep.equal(parsedEnvironmentVariables);
        });

        it("should expand variables", () => {
            const env = envAgent.create().load({
                expand: "project"
            });

            chai.expect(env.EXPAND_MISSING_VAR).to.equal("");
            chai.expect(env.EXPAND_PORT).to.equal("3000");
            chai.expect(env.EXPAND_RECURSIVE).to.equal(
                "3000 123456 development"
            );
        });
    });

    describe("parse()", () => {
        it("should parse a file into an object", () => {
            const envPath = path.resolve(process.cwd(), DOTENV_FILENAME);
            const file = fs.readFileSync(envPath);
            const env = envAgent.parse(file);

            chai.expect(env).to.deep.equal(parsedEnvironmentVariables);
        });

        it("should parse a buffer into an object", () => {
            const variables = Buffer.from("PORT=3000\nNODE_ENV=development");

            const env = envAgent.parse(variables);

            chai.expect(env).to.deep.equal({
                PORT: "3000",
                NODE_ENV: "development"
            });
        });

        it("should parse a string into an object", () => {
            const variables = `
                PORT=3000
                NODE_ENV=development
            `;

            const env = envAgent.parse(variables);

            chai.expect(env).to.deep.equal({
                PORT: "3000",
                NODE_ENV: "development"
            });
        });
    });

    it("should expand variables (project)", () => {
        const env = envAgent.load({
            expand: "none"
        });

        const expanded = envAgent.expand(env, "project");

        chai.expect(expanded).to.deep.equal({
            PORT: "3000",
            NODE_ENV: "development",
            PASSWORD: "123456",
            MONGO_URL: "mongodb://localhost:27017",
            MONGO_PASSWORD: "123456",
            MISSING_VAR: "",
            EXPAND_MISSING_VAR: "",
            EXPAND_PORT: "3000",
            EXPAND_RECURSIVE: "3000 123456 development"
        });

        chai.expect(envAgent.get("EXPAND_RECURSIVE")).to.equal(
            "3000 123456 development"
        );
    });

    it("should be accessible from process.env", () => {
        const env = envAgent.load();

        for (const key of Object.keys(env)) {
            chai.expect(hasOwnProperty(process.env, key)).to.be.true;
        }
    });

    it("should get an environment variable", () => {
        envAgent.load();

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

    it("should set an environment variable and overwrite it", () => {
        const key = "ALLOW_INLINE_OVERWRITES";
        envAgent.set(key, "default");
        envAgent.set(key, "overwritten", true);

        chai.expect(hasOwnProperty(process.env, key)).to.be.true;
        chai.expect(envAgent.get(key)).to.equal("overwritten");
    });

    it("should delete an environment variable", () => {
        envAgent.load();

        chai.expect(hasOwnProperty(process.env, "PORT")).to.be.true;

        envAgent.delete("PORT");

        chai.expect(hasOwnProperty(process.env, "PORT")).to.be.false;
    });
});
