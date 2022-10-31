/**
    * env-agent v1.0.0
    * https://github.com/itsmichaelbtw/env-agent#readme
    * (c) 2022 Michael Cizek
    * @license MIT
    */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const path = require('path');
const fs = require('fs');
const os = require('os');

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

var DOTENV_FILENAME = ".env";
var DOTENV_LINE = /^\s*([^\#]+)\s*=\s*([^#]*)/m;
/**
 * Parses a .env file and returns an object containing the environment variables.
 */
function parse(file) {
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
    return {};
  }
}
function configure() {
  var envPath = path.resolve(process.cwd(), DOTENV_FILENAME);
  try {
    var _file = fs.readFileSync(envPath);
    var env = parse(_file);
    for (var _key2 in env) {
      if (hasOwnProperty(process.env, _key2)) {
        continue;
      }
      set(_key2, env[_key2]);
    }
    return env;
  } catch (error) {
    return {};
  }
}
function get(key) {
  if (isUndefined(key)) {
    return "";
  }
  var value = process.env[key];
  if (isUndefined(value)) {
    return "";
  }
  return value;
}
function set(key, value) {
  process.env[key] = value;
}
var envAgent = {
  parse: parse,
  configure: configure,
  get: get,
  set: set,
  DOTENV_FILENAME: DOTENV_FILENAME
};

exports.default = envAgent;
//# sourceMappingURL=env-agent.cjs.map
