"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOwnProperty = exports.isUndefined = void 0;
function isUndefined(value) {
    return typeof value === "undefined";
}
exports.isUndefined = isUndefined;
function hasOwnProperty(obj, prop) {
    return obj.hasOwnProperty(prop);
}
exports.hasOwnProperty = hasOwnProperty;
