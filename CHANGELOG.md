# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.2](https://github.com/itsmichaelbtw/env-agent/compare/v2.1.1...v2.1.2) (2022-11-21)


### Fixed

* es module imports were targetting incorrect build output ([e26bab0](https://github.com/itsmichaelbtw/env-agent/commit/e26bab0cc9377929652ff0ed150607bdd2d854a5))

### [2.1.1](https://github.com/itsmichaelbtw/env-agent/compare/v2.1.0...v2.1.1) (2022-11-16)


### Fixed

* **env-agent:** `.get()` method now returns `undefined` when a variable is not defined ([6c9c47f](https://github.com/itsmichaelbtw/env-agent/commit/6c9c47fc8cbe142042b9ef09a927dfeb743ffa0c))

## [2.1.0](https://github.com/itsmichaelbtw/env-agent/compare/v2.0.0...v2.1.0) (2022-11-13)


### What's New

* added internal documentation ([4bb7334](https://github.com/itsmichaelbtw/env-agent/commit/4bb7334c30eabc3264f92c04594551fd8e75b274))


### Fixed

* incorrect build folder for v2.0.0 ([5aa40e0](https://github.com/itsmichaelbtw/env-agent/commit/5aa40e04758f0fb6c9591d7f8640b9fcc36a5661))
* pre build cmd somehow causing `vnull` tags to be produced ([5d31a68](https://github.com/itsmichaelbtw/env-agent/commit/5d31a6884ce64d9e80900fde17808a07b6fcc1e3))
* run build command before standard-version ([6b09bef](https://github.com/itsmichaelbtw/env-agent/commit/6b09bef680d9be6e93a4494ad10898ef31bfd8ec))

## [2.0.0](https://github.com/itsmichaelbtw/env-agent/compare/v1.2.0...v2.0.0) (2022-11-11)


### ⚠ BREAKING CHANGES

* **env-agent:** renamed `.configure()` to `.load()` for fitter clarity

### What's New

* **env-agent:** renamed `.configure()` to `.load()` for fitter clarity ([6d52265](https://github.com/itsmichaelbtw/env-agent/commit/6d5226563902fcff7030a8a0ae9cacbc470b7e55))

## [1.2.0](https://github.com/itsmichaelbtw/env-agent/compare/v1.1.1...v1.2.0) (2022-11-07)


### What's New

* **env-agent:** support for variable expansion with expansion modes ([bd593a5](https://github.com/itsmichaelbtw/env-agent/commit/bd593a5b0d18996ef61634dcc5cd9c92c8ed85db))

### [1.1.1](https://github.com/itsmichaelbtw/env-agent/compare/v1.1.0...v1.1.1) (2022-11-01)


### Fixed

* removed quotes around env values ([906ada2](https://github.com/itsmichaelbtw/env-agent/commit/906ada2c74a8570c763940238ae03e7390497782))

## [1.1.0](https://github.com/itsmichaelbtw/env-agent/compare/v1.0.0...v1.1.0) (2022-11-01)


### ⚠ BREAKING CHANGES

* migrated build process from tsc to rollup

### Fixed

* type 'undefined' cannot be used as an index type ([f0ac969](https://github.com/itsmichaelbtw/env-agent/commit/f0ac9696e8bdd92625472bab1558d076762552d9))


* migrated build process from tsc to rollup ([20186ea](https://github.com/itsmichaelbtw/env-agent/commit/20186eab3b738d3ea71e3f40bd73e69db2ed331f))


### What's New

* **env-agent:** added support for optional configuration settings ([13e0ffc](https://github.com/itsmichaelbtw/env-agent/commit/13e0ffcea5f7ce27090f3d2fc77c991c63e7bb5e))
* **env-agent:** local debugger with terminal color support ([eb6f9a6](https://github.com/itsmichaelbtw/env-agent/commit/eb6f9a619e066bc30bda87d9b3de1daf6951be9f))

## 1.0.0 (2022-10-31)


### What's New

* **env-agent:** added internal documentation to available methods ([867aa10](https://github.com/itsmichaelbtw/env-agent/commit/867aa107558dc4d0117691dc922e783e616523b8))
* **env-agent:** configure, parse and get environment variables ([5d28a57](https://github.com/itsmichaelbtw/env-agent/commit/5d28a57a453ba226adf759c9191876a7bb1ad7ac))


### Fixed

* **env-agent:** line breaks failing to split properly ([0209a5a](https://github.com/itsmichaelbtw/env-agent/commit/0209a5af0e82ac796b3d7876281f690b626fbc11))
* **env-agent:** variable with an empty key was incorrectly loaded ([4d559bc](https://github.com/itsmichaelbtw/env-agent/commit/4d559bc98fedb3992e613e52bed5f2b7fd5bc060))
