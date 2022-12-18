# env-agent

A zero-dependency package for reading environment variables into `process.env` at runtime. Easily parse, load and expand environment variables from `.env` files. Provides sanity checks when parsing `.env` files and ensures all incoming variables are defined before being added to `process.env`.

[![Unit Tests](https://github.com/itsmichaelbtw/env-agent/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/itsmichaelbtw/env-agent/actions/workflows/unit-tests.yml)
![npm](https://img.shields.io/npm/v/env-agent)

## Installation

npm:
```bash
$ npm install env-agent --save
```
yarn:
```bash
$ yarn add env-agent
```

## Usage

Ensure you have a `.env` file in the root of your project. This file should contain all the environment variables you want to use in your project. For example:

```bash
# .env
PORT=3000
NODE_ENV=development
```

Then, in your project, import the `env-agent` package and call the `load` function:

> It is highly recommended to call the `load` function as early as possible in your project. This will ensure all environment variables are available to your project as soon as possible.

### CommonJS:

```js
const envAgent = require('env-agent').default;

envAgent.load();
```

### ES6:

```js
import envAgent from 'env-agent';

envAgent.load();

// {
//   PORT: 3000,
//   NODE_ENV: 'development'
// }
```
Now all the environment variables defined in your `.env` file are available in `process.env`.

## API

### `load([, options])`

loads the environment variables defined in your `.env` file. This function should be called as early as possible in your project.

#### `options`

| Option    | Type    | Default       | Description                                                                            |
|-----------|---------|---------------|----------------------------------------------------------------------------------------|
| silent    | boolean | true          | When attempting to load the .env file, specify whether errors should be thrown or not. |
| strict    | boolean | false         | Ensures variables are defined before being added to `process.env`.                     |
| path      | string  | process.cwd() | The path to the `.env` file.                                                           |
| expand    | string  | 'none'        | Choose to expand variables defined in your .env file.                                  |
| overwrite | boolean | false         | Overwrite existing environment variables.                                              |
| encoding  | string  | 'utf8'        | The encoding of the `.env` file when reading.                                          |
| debug     | boolean | false         | Show debug messages when loading the `.env` file.                                      |
| template  | string  | undefined     | Define a template to validate the `.env` file against.                                 |

```js
envAgent.load({
    silent: false,
    debug: true
});
```

### `parse(file)`

Parses the input and returns an object containing the environment variables. 

```js
const env = envAgent.parse(`
    PORT=3000
    NODE_ENV=development
`);

// or

const env = envAgent.parse(Buffer.from('PORT=3000\nNODE_ENV=development'));
```

### `expand(variables, expansionMode)`

Choose to expand variables defined in your .env file. It is recommened to expand variables when calling envAgent.load(). Select the expansion mode that best suits your needs.

- `none` - No expansion will be performed.
- `project` - Expand variables defined in the .env file (does not expand current process.env variables).
- `machine` - Expand variables defined on your machine's environment (expands current process.env variables).

```js
envAgent.load({ expand: "project" }) // variables will automatically expand

// or

const variables = envAgent.load();

envAgent.expand(variables, "project"); // variables will expand
```

You can denote a variable to be expanded by using the following syntax:

- `$VARIABLE`
- `${VARIABLE}`

```bash
# .env
PORT=3000
NODE_ENV=development
HOST=localhost
URL=http://${HOST}:$PORT # HOST and PORT will be expanded
```

```js
envAgent.load({ expand: "project" });

// {
//   PORT: 3000,
//   NODE_ENV: 'development',
//   HOST: 'localhost',
//   URL: 'http://localhost:3000'
// }
```

### `get(key)`

Retrieve a single environment variable from `process.env`.

### `set(key, value)`

Sets a single environment variable in `process.env`. Ensures configuration rules are followed:

- If `strict` is `true`, the variable must be defined before being added to `process.env`.
- If `overwrite` is `false`, the variable must not already exist in `process.env`.

### `delete(key)`

Deletes a single environment variable from `process.env`.

## CHANGELOG

See [CHANGELOG.md](CHANGELOG.md)

## LICENSE

See [LICENSE](LICENSE)


