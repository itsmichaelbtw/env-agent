# env-agent

A zero-dependency package for reading environment variables into `process.env` at runtime. Easily parse, configure and expand environment variables from `.env` files. Provides sanity checks when parsing `.env` files and ensures all incoming variables are defined before being added to `process.env`.

[![Unit Tests](https://github.com/itsmichaelbtw/env-agent/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/itsmichaelbtw/env-agent/actions/workflows/unit-tests.yml)

## Installation

```bash
$ npm install env-agent --save
```

## Usage

Ensure you have a `.env` file in the root of your project. This file should contain all the environment variables you want to use in your project. For example:

```bash
# .env
PORT=3000
NODE_ENV=development
```

Then, in your project, import the `env-agent` package and call the `configure` function:

> It is highly recommended to call the `configure` function as early as possible in your project. This will ensure all environment variables are available to your project as soon as possible.

```js
// index.js
import envAgent from 'env-agent';

envAgent.configure();

// {
//   PORT: 3000,
//   NODE_ENV: 'development'
// }
```

Now all the environment variables defined in your `.env` file are available in `process.env`

## CHANGELOG

See [CHANGELOG.md](CHANGELOG.md)

## LICENSE

See [LICENSE](LICENSE)


