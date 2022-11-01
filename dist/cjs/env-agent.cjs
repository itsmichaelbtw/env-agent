/**
    * env-agent v1.1.0
    * https://github.com/itsmichaelbtw/env-agent#readme
    * (c) 2022 Michael Cizek
    * @license MIT
    */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const path = require('path');
const fs = require('fs');
const os = require('os');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function isUndefined(value) {
  return typeof value === "undefined";
}
function hasOwnProperty(obj, prop) {
  return obj.hasOwnProperty(prop);
}
function shallowMerge(target, source) {
  return Object.assign({}, target, source);
}

var colors = {
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m"
};
var globals = {
  reset: "\x1b[0m",
  bright: "\x1b[1m"
};
function debug(message, color) {
  var prefix = "[ENV-AGENT] ";
  var colorizedMessage = "".concat(colors[color]).concat(prefix).concat(message).concat(globals.reset);
  console.log(colorizedMessage);
}

var DOTENV_FILENAME = ".env";
var DOTENV_LINE = /^\s*([^\#]+)\s*=\s*([^#]*)/m;
var defaults = {
  silent: true,
  strict: false,
  overwrite: false,
  encoding: "utf8",
  debug: false
};
var EnvAgent = /*#__PURE__*/function () {
  function EnvAgent() {
    _classCallCheck(this, EnvAgent);
    _defineProperty(this, "$options", {});
    _defineProperty(this, "DOTENV_FILENAME", DOTENV_FILENAME);
  }
  _createClass(EnvAgent, [{
    key: "options",
    get: function get() {
      return this.$options;
    }
  }, {
    key: "resolvePathName",
    value: function resolvePathName() {
      if (this.options.path) {
        return path.resolve(this.options.path);
      } else {
        return path.resolve(process.cwd(), DOTENV_FILENAME);
      }
    }
  }, {
    key: "handleErrorException",
    value: function handleErrorException(error) {
      this.handleDebug(error.message, "red");
      if (this.options.silent) {
        return;
      }
      throw error;
    }
  }, {
    key: "handleDebug",
    value: function handleDebug(message, color) {
      if (this.options.debug) {
        debug(message, color);
      }
    }
  }, {
    key: "create",
    value: function create() {
      return new EnvAgent();
    }
  }, {
    key: "parse",
    value: function parse(file) {
      try {
        var environmentVariables = {};
        var fileAsString = file.toString();
        var lines = fileAsString.replace(os.EOL, "\n").split(/\n/);
        var _iterator = _createForOfIteratorHelper(lines),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _keyValuePairs$, _keyValuePairs$2;
            var potentialLine = _step.value;
            var isMatch = DOTENV_LINE.test(potentialLine);
            if (!isMatch) {
              continue;
            }
            var line = potentialLine.match(DOTENV_LINE);
            if (line === null) {
              continue;
            }
            var keyValuePairs = line.slice(1);
            var _key = (_keyValuePairs$ = keyValuePairs[0]) !== null && _keyValuePairs$ !== void 0 ? _keyValuePairs$ : "";
            var _value = (_keyValuePairs$2 = keyValuePairs[1]) !== null && _keyValuePairs$2 !== void 0 ? _keyValuePairs$2 : "";
            _key = _key.trim();
            _value = _value.trim();
            if (_key) {
              if (this.options.strict && !_value) {
                continue;
              }
              _value = _value.replace(/(^['"]|['"]$)/g, "");
              environmentVariables[_key] = _value;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return environmentVariables;
      } catch (error) {
        this.handleErrorException(error);
        return {};
      }
    }
  }, {
    key: "configure",
    value: function configure() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.$options = shallowMerge(defaults, options);
      try {
        var envPath = this.resolvePathName();
        var encoding = this.options.encoding;
        var _file = fs.readFileSync(envPath, {
          encoding: encoding
        });
        this.handleDebug("Found .env file", "green");
        var env = this.parse(_file);
        this.handleDebug("Parsed .env file", "green");
        if (Object.keys(env).length === 0) {
          this.handleDebug("No environment variables found. You may have an empty .env file", "yellow");
          return {};
        }
        for (var _key2 in env) {
          this.set(_key2, env[_key2]);
        }
        return env;
      } catch (error) {
        this.handleErrorException(error);
        return {};
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      if (isUndefined(key)) {
        this.handleDebug("Attempted to retrieve an environment variable, but no key was passed", "yellow");
        return "";
      }
      var value = process.env[key];
      if (isUndefined(value)) {
        return "";
      }
      return value;
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (hasOwnProperty(process.env, key) && this.options.overwrite !== true) {
        this.handleDebug("Environment variable ".concat(key, " already exists, skipping"), "yellow");
        return;
      }
      if (this.$options.strict && !value) {
        this.handleDebug("Environment variable ".concat(key, " is not defined, skipping"), "yellow");
        return;
      }
      process.env[key] = value;
      this.handleDebug("Set ".concat(key, " to ").concat(value), "green");
    }
  }, {
    key: "reset",
    value: function reset() {
      this.$options = {};
    }
  }]);
  return EnvAgent;
}();
var envAgent = new EnvAgent();

exports.default = envAgent;
//# sourceMappingURL=env-agent.cjs.map
