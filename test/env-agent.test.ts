import fs from "fs";
import path from "path";
import chai from "chai";

import envAgent from "../lib/env-agent";
import { hasOwnProperty } from "../lib/utils";

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
        const port = envAgent.get("PORT");
        const nodeEnv = envAgent.get("NODE_ENV");

        chai.expect(port).to.equal("3000");
        chai.expect(nodeEnv).to.equal("development");
    });

    it("should set an environment variable", () => {
        envAgent.set("TEST_VAR", "test");

        chai.expect(envAgent.get("TEST_VAR")).to.equal("test");
    });
});
